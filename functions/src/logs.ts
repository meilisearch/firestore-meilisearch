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

import { logger } from 'firebase-functions'
import { config } from './config'

/**
 * Initialization logger.
 */
export function init() {
  logger.log('Initializing extension with configuration', config)
}

/**
 * Start logger.
 */
export function start() {
  logger.log('Started execution of extension with configuration', config)
}

/**
 * Error logger.
 * @param {Error} err
 */
export function error(err: Error) {
  logger.error('Unhandled error occurred during processing:', err)
}

/**
 * Complete logger.
 */
export function complete() {
  logger.log('Completed execution of extension')
}

/**
 * Log an addition of a document.
 * @param {string} id Document id added.
 * @param {object} data Data contained in the document.
 */
export function addDocument(id: string, data: Record<string, any>) {
  logger.info(
    `Creating new document ${id} in Meilisearch index ${config.meilisearch.indexUid}`,
    data
  )
}

/**
 * Log an update of a document.
 * @param {string} id Document id updated.
 * @param {object} data Data contained in the document.
 */
export function updateDocument(id: string, data: Record<string, any>) {
  logger.info(
    `Updating document ${id} in Meilisearch index ${config.meilisearch.indexUid}`,
    data
  )
}

/**
 * Log a deletion of a document.
 * @param {string} id Document id deleted.
 */
export function deleteDocument(id: string) {
  logger.info(
    `Deleting document ${id} in Meilisearch index ${config.meilisearch.indexUid}`
  )
}

/**
 * Log a modification of geoPoint based on whether or not it has the correct naming to enable `geosearch` in Meilisearch.
 * @param {boolean} hasGeoField a boolean value that indicates whether the field is correctly named to enable `geosearch` in Meilisearch.
 */
export function infoGeoPoint(hasGeoField: boolean) {
  if (hasGeoField) {
    logger.info(
      `A GeoPoint was found with the field name '_geo' for compatibility with Meilisearch the field 'latitude' was renamed to 'lat' and the field 'longitude' to 'lng'`
    )
  } else {
    logger.info(
      `A GeoPoint was found without the field name '_geo' if you want to use the geoSearch with Meilisearch rename it to '_geo'`
    )
  }
}

/**
 * Importation data logger.
 * @param {number} total
 * @param {number} batches
 */
export function importData(total: number, batches: number) {
  logger.info(`Imported ${total} documents in ${batches} batches.`)
}
