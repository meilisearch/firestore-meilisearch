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
import GeoPoint = firestore.GeoPoint

import { getFieldsToIndex } from './util'
import * as logs from './logs'

/**
 * Processing Document
 * @param {string} documentId
 * @param {DocumentSnapshot} snapshot The Functions interface for events that change state
 * @return {Record<string, any>}
 */
export function processDocument(
  documentId: string,
  snapshot: DocumentSnapshot
): Record<string, any> {
  const fields = getFieldsToIndex()
  const data = { ...snapshot.data() }
  if (fields.length === 0) {
    return { id: documentId, ...data }
  }
  const document = Object.keys(data).reduce(
    (acc, key) => {
      if (fields.includes(key)) {
        const [field, value] = processValue(key, data[key])
        return { ...acc, [field]: value }
        // return { ...acc, [key]: data[key] }
      }
      return acc
    },
    { id: documentId }
  )
  console.log('document:', document)
  return document
}

/**
 * Processing fields
 * @param {string} field
 * @param {object} value
 * @return {string | object}
 */
export function processValue(
  field: string,
  value: Record<string, any>
): [string, Record<string, any>] {
  if (value instanceof GeoPoint) {
    if (field === '_geo') {
      logs.infoGeoPoint(true)
      return [field, processGeoPoint(value)]
    } else {
      logs.infoGeoPoint(false)
    }
  }
  return [field, value]
}

/**
 * Processing GeoPoint
 * @param {GeoPoint} geoPoint
 * @return {object}
 */
const processGeoPoint = (geoPoint: GeoPoint) => {
  return {
    lat: geoPoint.latitude,
    lng: geoPoint.longitude,
  }
}
