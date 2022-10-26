#!/usr/bin/env node
"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const config_1 = require("./config");
const logs = require("../logs");
const adapter_1 = require("../adapter");
const create_index_1 = require("../meilisearch/create-index");
const run = async () => {
    // Retrieve all arguments from the commande line.
    const config = await (0, config_1.parseConfig)();
    // Initialize Firebase using the Google Credentials in the GOOGLE_APPLICATION_CREDENTIALS environment variable.
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://${config.projectId}.firebaseio.com`,
    });
    const database = admin.firestore();
    // Initialize Meilisearch index.
    const index = (0, create_index_1.initMeilisearchIndex)(config.meilisearch);
    await retrieveCollectionFromFirestore(database, config, index);
};
/**
 * Retrieves a collection or collection group in Firestore and aggregates the data.
 * @param {FirebaseFirestore.Firestore} database
 * @param {CLIConfig} config
 * @param {Index} index
 */
async function retrieveCollectionFromFirestore(database, config, index) {
    var _a;
    const batch = parseInt(config.batchSize);
    let query;
    let total = 0;
    let batches = 0;
    let lastDocument = null;
    let lastBatchSize = batch;
    while (lastBatchSize === batch) {
        batches++;
        if (config.queryCollectionGroup) {
            query = database.collectionGroup(config.sourceCollectionPath).limit(batch);
        }
        else {
            query = database.collection(config.sourceCollectionPath).limit(batch);
        }
        if (lastDocument !== null) {
            query = query.startAfter(lastDocument);
        }
        const snapshot = await query.get();
        const docs = snapshot.docs;
        if (docs.length === 0)
            break;
        total += await sendDocumentsToMeilisearch(docs, index, ((_a = config.meilisearch) === null || _a === void 0 ? void 0 : _a.fieldsToIndex) || '');
        if (docs.length) {
            lastDocument = docs[docs.length - 1];
        }
        lastBatchSize = docs.length;
    }
    logs.importData(total, batches);
    return total;
}
/**
 * Adapts documents and indexes them in Meilisearch.
 * @param {Change<DocumentSnapshot>} docs
 * @param {Index} index
 * @param {string} fieldsToIndex list of fields added in the document send to Meilisearch.
 */
async function sendDocumentsToMeilisearch(docs, index, fieldsToIndex) {
    const document = docs.map(snapshot => {
        return (0, adapter_1.adaptDocument)(snapshot.id, snapshot, fieldsToIndex);
    });
    try {
        await index.addDocuments(document, { primaryKey: '_firestore_id' });
    }
    catch (e) {
        logs.error(e);
        return 0;
    }
    return document.length;
}
void run();
