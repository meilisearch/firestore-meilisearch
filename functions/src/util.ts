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
import { Change } from 'firebase-functions'
import { config } from './config'

export enum ChangeType {
  CREATE,
  DELETE,
  UPDATE,
}

/**
 * Get type of the modification perform on a document.
 * @param {Change<T>} change The Functions interface for events that change state.
 * @return {ChangeType} Final type of the event.
 */
export function getChangeType(change: Change<DocumentSnapshot>): ChangeType {
  if (!change.after.exists) {
    return ChangeType.DELETE
  }
  if (!change.before.exists) {
    return ChangeType.CREATE
  }
  return ChangeType.UPDATE
}

/**
 * Get final id of a document after modification.
 * @param {Change<T>} change The Functions interface for events that change state.
 * @return {string} Final state type of the event.
 */
export function getChangedDocumentId(change: Change<DocumentSnapshot>): string {
  if (change.after.exists) {
    return change.after.id
  }
  return change.before.id
}

/**
 * Returns the FIELDS_TO_INDEX value from the config file and formats it.
 * @return {string[]} An array of fields.
 */
export function getFieldsToIndex(): string[] {
  return config.meilisearch.fieldsToIndex
    ? config.meilisearch.fieldsToIndex.split(/[ ,]+/)
    : []
}

/**
 * Returns the SEARCHABLE_FIELDS value from the config file and formats it.
 * @return {string[]} An array of fields.
 */
export function getSearchableFields(): string[] {
  return config.meilisearch.searchableFields
    ? config.meilisearch.searchableFields.split(/[ ,]+/)
    : []
}
