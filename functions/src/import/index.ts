#!/usr/bin/env node

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

import * as admin from 'firebase-admin'
import { CliConfig, parseConfig } from './config'
import * as logs from '../logs'
import { adaptDocument } from '../adapter'
import { initMeilisearchIndex } from '../meilisearch/create-index'
import { Index } from '../types'
import { DocumentSnapshot } from 'firebase-functions/lib/providers/firestore'

const run = async () => {
  // Retrieve all arguments from the commande line.
  const config: CliConfig = await parseConfig()

  // Initialize Firebase using the Google Credentials in the GOOGLE_APPLICATION_CREDENTIALS environment variable.
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: `https://${config.projectId}.firebaseio.com`,
  })

  const database = admin.firestore()

  // Initialize Meilisearch index.
  const index = initMeilisearchIndex(config.meilisearch)

  await retrieveCollectionFromFirestore(database, config, index)
}

/**
 * Retrieves a collection or collection group in Firestore and aggregates the data.
 * @param {FirebaseFirestore.Firestore} database
 * @param {CliConfig} config
 * @param {Index} index
 */
async function retrieveCollectionFromFirestore(
  database: FirebaseFirestore.Firestore,
  config: CliConfig,
  index: Index
): Promise<number> {
  const batch: number = parseInt(config.batchSize)

  let query
  let total = 0
  let batches = 0
  let lastDocument = null
  let lastBatchSize: number = batch

  while (lastBatchSize === batch) {
    batches++

    if (config.queryCollectionGroup) {
      query = database.collectionGroup(config.sourceCollectionPath).limit(batch)
    } else {
      query = database.collection(config.sourceCollectionPath).limit(batch)
    }

    if (lastDocument !== null) {
      query = query.startAfter(lastDocument)
    }

    const snapshot = await query.get()
    const docs = snapshot.docs

    if (docs.length === 0) break
    total += await sendDocumentsToMeilisearch(docs, index)

    if (docs.length) {
      lastDocument = docs[docs.length - 1]
    }
    lastBatchSize = docs.length
  }

  logs.importData(total, batches)
  return total
}

/**
 * Adapts documents and indexes them in Meilisearch.
 * @param {any} docs
 * @param {Index} index
 * @param {Change<DocumentSnapshot>} change
 */
async function sendDocumentsToMeilisearch(
  docs: DocumentSnapshot[],
  index: Index
): Promise<number> {
  const document = docs.map(snapshot => {
    return adaptDocument(snapshot.id, snapshot)
  })
  try {
    await index.addDocuments(document, { primaryKey: '_firestore_id' })
  } catch (e) {
    logs.error(e as Error)
  }
  return document.length
}

void run()
