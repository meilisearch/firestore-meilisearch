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

import * as functions from 'firebase-functions'
import { EventContext, Change } from 'firebase-functions'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'

import { MeiliSearch } from 'meilisearch'

import { getChangeType, getDocumentId, ChangeType } from './util'

const client = new MeiliSearch({
  host: process.env.MEILISEARCH_HOST as string,
  apiKey: process.env.MEILISEARCH_API_KEY,
})

const index = client.index(process.env.MEILISEARCH_INDEX_NAME as string)

/**
 * indexingWorker is responsible for aggregating a defined field from a Firestore collection into a Meilisearch index.
 * It is controlled by a Firestore handler
 */
export const indexingWorker = functions.handler.firestore.document.onWrite(
  async (change: Change<DocumentSnapshot>): Promise<void> => {
    const changeType = getChangeType(change)
    const documentId = getDocumentId(change)

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
  }
)

/**
 * Handle addition of a document in the MeiliSearch index
 * @param {string} documentId
 * @param {Change} snapshot
 */
async function handleAddDocument(
  documentId: string,
  snapshot: DocumentSnapshot
): Promise<void> {
  try {
    const document = Object.assign({ id: documentId }, snapshot.data())
    await index.addDocuments([document])
  } catch (e) {
    console.log(e)
  }
}

/**
 * Handle deletion of a document in the MeiliSearch index
 * @param {string} documentId
 */
async function handleDeleteDocument(documentId: string): Promise<void> {
  try {
    await index.deleteDocument(documentId)
  } catch (e) {
    console.log(e)
  }
}

/**
 * Handle update of a document in the MeiliSearch index
 * @param {string} documentId
 * @param {Change} after
 */
async function handleUpdateDocument(
  documentId: string,
  after: DocumentSnapshot
): Promise<void> {
  try {
    const document = Object.assign({ id: documentId }, after.data())
    await index.updateDocuments([document])
  } catch (e) {
    console.log(e)
  }
}
