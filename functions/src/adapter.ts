'use strict'
/*
 * Copyright 2021 MeiliSearch
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

type MeiliSearchGeoPoint = {
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
  | MeiliSearchGeoPoint

/**
 * Adapt Document
 * @param {string} documentId
 * @param {DocumentSnapshot} snapshot Contains data read from a document in your Firestore database
 * @return {Record<string, any>}
 */
export function adaptDocument(
  documentId: string,
  snapshot: DocumentSnapshot
): Record<string, any> {
  const fields = getFieldsToIndex()
  const data = snapshot.data()
  if (fields.length === 0 || !data) {
    return { id: documentId, ...data }
  }
  const document = Object.keys(data).reduce(
    (acc, key) => {
      if (fields.includes(key)) {
        const [field, value] = adaptValues(key, data[key])
        return { ...acc, [field]: value }
      }
      return acc
    },
    { id: documentId }
  )
  return document
}

/**
 * Adapt fields
 * @param {string} field
 * @param {FirestoreRow} value
 * @return {[string,FirestoreRow]}
 */
export function adaptValues(
  field: string,
  value: FirestoreRow
): [string, FirestoreRow | MeiliSearchGeoPoint] {
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
 * Adapt GeoPoint to fit with Meilisearch geo point
 * @param {firestore.GeoPoint} geoPoint
 * @return {MeiliSearchGeoPoint}
 */
const adaptGeoPoint = (geoPoint: firestore.GeoPoint): MeiliSearchGeoPoint => {
  return {
    lat: geoPoint.latitude,
    lng: geoPoint.longitude,
  }
}
