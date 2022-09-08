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

import * as functions from 'firebase-functions'
import { Change, logger } from 'firebase-functions'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'
import { initMeilisearchIndex } from './meilisearch/create-index'
import { getChangeType, getChangedDocumentId, ChangeType } from './util'
import * as logs from './logs'
import { adaptDocument } from './adapter'
import { config } from './config'
import { validateDocumentId } from './validate'

const index = initMeilisearchIndex(config.meilisearch)

logs.init()

/**
 * IndexingWorker is responsible for aggregating a defined field from a Firestore collection into a Meilisearch index.
 * It is controlled by a Firestore handler.
 */
export const indexingWorker = functions.handler.firestore.document.onWrite(
  async (change: Change<DocumentSnapshot>): Promise<void> => {
    logs.start()
    const changeType = getChangeType(change)
    const documentId = getChangedDocumentId(change)

    switch (changeType) {
      case ChangeType.CREATE:
        await handleAddDocument(documentId, change.after)
        break
      case ChangeType.DELETE:
        await handleDeleteDocument(documentId)
        break
      case ChangeType.UPDATE:
        await handleUpdateDocument(documentId, change.after)
        break
    }
    logs.complete()
  }
)

/**
 * Handle addition of a document in the Meilisearch index.
 * @param {string} documentId Document id to add.
 * @param {Change} snapshot Snapshot of the data contained in the document read from your Firestore database.
 */
async function handleAddDocument(
  documentId: string,
  snapshot: DocumentSnapshot
): Promise<void> {
  try {
    logs.addDocument(documentId)

    if (validateDocumentId(documentId)) {
      const document = adaptDocument(documentId, snapshot)
      await index.addDocuments([document], { primaryKey: '_firestore_id' })
    } else {
      logger.error(
        `Could not create document with id: ${documentId}. The document id can only contain case-insensitive alphanumeric characters (abcDEF), hyphens (-) or underscores(_).`
      )
    }
  } catch (e) {
    logs.error(e as Error)
  }
}

/**
 * Handle deletion of a document in the Meilisearch index.
 * @param {string} documentId Document id to delete.
 */
async function handleDeleteDocument(documentId: string): Promise<void> {
  try {
    logs.deleteDocument(documentId)
    if (validateDocumentId(documentId)) {
      await index.deleteDocument(documentId)
    } else {
      logger.error(
        `Could not create document with id: ${documentId}. The document id can only contain case-insensitive alphanumeric characters (abcDEF), hyphens (-) or underscores(_).`
      )
    }
  } catch (e) {
    logs.error(e as Error)
  }
}

/**
 * Handle update of a document in the Meilisearch index.
 * @param {string} documentId Document id to update.
 * @param {Change} after Snapshot of the data contained in the document read from your Firestore database.
 */
async function handleUpdateDocument(
  documentId: string,
  after: DocumentSnapshot
): Promise<void> {
  try {
    logs.updateDocument(documentId)
    if (validateDocumentId(documentId)) {
      const document = adaptDocument(documentId, after)
      await index.updateDocuments([document])
    } else {
      logger.error(
        `Could not create document with id: ${documentId}.The document id can only contain case-insensitive alphanumeric characters (abcDEF), hyphens (-) or underscores(_).`
      )
    }
  } catch (e) {
    logs.error(e as Error)
  }
}
