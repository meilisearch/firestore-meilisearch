'use strict'
/*
 * Copyright 2022 Meilisearch
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import { firestore } from 'firebase-admin/lib/firestore'
import { getFieldsToIndex } from './util'
import * as logs from './logs'

type MeilisearchGeoPoint = {
  lat: number
  lng: number
}

type FirestoreRow =
  | null
  | boolean
  | number
  | string
  | firestore.DocumentReference
  | firestore.GeoPoint
  | firestore.Timestamp
  | Array<any>
  | Map<any, any>
  | MeilisearchGeoPoint

/**
 * Adapts documents from the Firestore database to Meilisearch compatible documents.
 * @param {string} documentId Document id.
 * @param {DocumentSnapshot} snapshot Snapshot of the data contained in the document read from your Firestore database.
 * @return {Record<string, any>} A properly formatted document to be added or updated in Meilisearch.
 */
export function adaptDocument(
  documentId: string,
  snapshot: DocumentSnapshot
): Record<string, any> {
  const fields = getFieldsToIndex()
  const data = snapshot.data() || {}
  if ('_firestore_id' in data) {
    delete data.id
  }
  if (fields.length === 0) {
    return { _firestore_id: documentId, ...data }
  }
  const document = Object.keys(data).reduce(
    (acc, key) => {
      if (fields.includes(key)) {
        const [field, value] = adaptValues(key, data[key])
        return { ...acc, [field]: value }
      }
      return acc
    },
    { _firestore_id: documentId }
  )
  return document
}

/**
 * Checks and adapts each values to be compatible with Meilisearch documents.
 * @param {string} field
 * @param {FirestoreRow} value
 * @return {[string,FirestoreRow]} A properly formatted array of field and value.
 */
export function adaptValues(
  field: string,
  value: FirestoreRow
): [string, FirestoreRow | MeilisearchGeoPoint] {
  if (value instanceof firestore.GeoPoint) {
    if (field === '_geo') {
      logs.infoGeoPoint(true)
      return [field, adaptGeoPoint(value)]
    } else {
      logs.infoGeoPoint(false)
    }
  }
  return [field, value]
}

/**
 * Adapts GeoPoint Firestore instance to fit with Meilisearch geo point.
 * @param {firestore.GeoPoint} geoPoint GeoPoint Firestore object.
 * @return {MeilisearchGeoPoint} A properly formatted geo point for Meilisearch.
 */
const adaptGeoPoint = (geoPoint: firestore.GeoPoint): MeilisearchGeoPoint => {
  return {
    lat: geoPoint.latitude,
    lng: geoPoint.longitude,
  }
}
