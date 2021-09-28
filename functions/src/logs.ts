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

import { logger } from 'firebase-functions'

import config from './config'

/**
 * Initialization logger.
 */
export function init() {
  logger.log('Initializing extension with configuration')
}

/**
 * Start logger.
 */
export function start() {
  logger.log('Started execution of extension with configuration')
}

/**
 * Error logger.
 * @param {Error} err
 */
export function error(err: Error) {
  logger.log('Unhandled error occurred during processing:', err)
}

/**
 * Complete logger.
 */
export function complete() {
  logger.log('Completed execution of extension')
}

/**
 * Addition of a document logger.
 * @param {string} id
 * @param {object} data
 */
export function addDocument(id: string, data: Record<string, any>) {
  logger.info(
    `Creating new document ${id} in MeiliSearch index ${config.meilisearchIndex}`,
    data
  )
}

/**
 * Update of a document logger.
 * @param {string} id
 * @param {object} data
 */
export function updateDocument(id: string, data: Record<string, any>) {
  logger.info(
    `Updating document ${id} in MeiliSearch index ${config.meilisearchIndex}`,
    data
  )
}

/**
 * Deletion of a document logger.
 * @param {string} id
 */
export function deleteDocument(id: string) {
  logger.info(
    `Deleting document ${id} in MeiliSearch index ${config.meilisearchIndex}`
  )
}
