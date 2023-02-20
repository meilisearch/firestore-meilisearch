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

import { DocumentSnapshot } from 'firebase-functions/lib/v1/providers/firestore'
import * as firestore from 'firebase-admin/firestore'
import { infoGeoPoint } from './logs'

type MeilisearchGeoPoint = {
  lat: number
  lng: number
}

/**
 * Adapts GeoPoint Firestore instance to fit with Meilisearch geo point.
 * @param {firestore.GeoPoint} geoPoint GeoPoint Firestore object.
 * @return {MeilisearchGeoPoint} A properly formatted geo point for Meilisearch.
 */
function adaptGeoPoint(geoPoint: firestore.GeoPoint): MeilisearchGeoPoint {
  return {
    lat: geoPoint.latitude,
    lng: geoPoint.longitude,
  }
}

/**
 * Check if the field is added to the document send to Meilisearch.
 *
 * @param  {string[]} fieldsToIndex
 * @param  {string} key
 * @return {boolean} true if it is a field that should be indexed in Meilisearch
 *
 */
export function isAFieldToIndex(fieldsToIndex: string[], key: string): boolean {
  if (
    fieldsToIndex.length === 0 ||
    fieldsToIndex.includes('*') ||
    fieldsToIndex.includes(key)
  ) {
    return true
  }
  return false
}

/**
 * Parse the fieldsToIndex string into an array.
 *
 * @param  {string} fieldsToIndex
 * @return {string[]} An array of fields.
 */
export function parseFieldsToIndex(fieldsToIndex: string): string[] {
  return fieldsToIndex ? fieldsToIndex.split(/[ ,]+/) : []
}

/**
 * Update special fields to Meilisearch compatible format
 * @param {firestore.DocumentData} document
 * @param {string[]} rawFieldsToIndex
 * @return {firestore.DocumentData} A properly formatted array of field and value.
 */
export function adaptFields(
  document: firestore.DocumentData,
  rawFieldsToIndex: string
): firestore.DocumentData {
  const fieldsToIndex = parseFieldsToIndex(rawFieldsToIndex)

  return Object.keys(document).reduce((doc, currentField) => {
    const value = document[currentField]

    if (!isAFieldToIndex(fieldsToIndex, currentField)) return doc
    if (value instanceof firestore.GeoPoint) {
      if (currentField === '_geo') {
        infoGeoPoint(true)
        return {
          ...doc,
          _geo: adaptGeoPoint(value),
        }
      } else {
        infoGeoPoint(false)
      }
    }
    return { ...doc, [currentField]: value }
  }, {})
}

/**
 * Adapts documents from the Firestore database to Meilisearch compatible documents.
 * @param {string} documentId Document id.
 * @param {DocumentSnapshot} snapshot Snapshot of the data contained in the document read from your Firestore database.
 * @param {string} rawFieldsToIndex Value of the setting `FIELDS_TO_INDEX`
 * @return {Record<string, any>} A properly formatted document to be added or updated in Meilisearch.
 */
export function adaptDocumentForMeilisearch(
  documentId: string,
  snapshot: DocumentSnapshot,
  rawFieldsToIndex: string
): Record<string, any> {
  const data = snapshot.data() || {}
  if ('_firestore_id' in data) {
    delete data.id
  }
  const adaptedDoc = adaptFields(data, rawFieldsToIndex)

  return { _firestore_id: documentId, ...adaptedDoc }
}
