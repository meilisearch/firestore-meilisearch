'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexingWorker = void 0;
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
const functions = require("firebase-functions");
const create_index_1 = require("./meilisearch/create-index");
const util_1 = require("./util");
const logs = require("./logs");
const adapter_1 = require("./adapter");
const config_1 = require("./config");
const index = (0, create_index_1.initMeilisearchIndex)(config_1.config.meilisearch);
logs.init();
/**
 * IndexingWorker is responsible for aggregating a defined field from a Firestore collection into a Meilisearch index.
 * It is controlled by a Firestore handler.
 */
exports.indexingWorker = functions.handler.firestore.document.onWrite(async (change) => {
    logs.start();
    const changeType = (0, util_1.getChangeType)(change);
    const documentId = (0, util_1.getChangedDocumentId)(change);
    switch (changeType) {
        case util_1.ChangeType.CREATE:
            await handleAddDocument(documentId, change.after);
            break;
        case util_1.ChangeType.DELETE:
            await handleDeleteDocument(documentId);
            break;
        case util_1.ChangeType.UPDATE:
            await handleUpdateDocument(documentId, change.after);
            break;
    }
    logs.complete();
});
/**
 * Handle addition of a document in the Meilisearch index.
 * @param {string} documentId Document id to add.
 * @param {Change} snapshot Snapshot of the data contained in the document read from your Firestore database.
 */
async function handleAddDocument(documentId, snapshot) {
    try {
        const document = (0, adapter_1.adaptDocument)(documentId, snapshot);
        await index.addDocuments([document], { primaryKey: '_firestore_id' });
        logs.addDocument(documentId, document);
    }
    catch (e) {
        logs.error(e);
    }
}
/**
 * Handle deletion of a document in the Meilisearch index.
 * @param {string} documentId Document id to delete.
 */
async function handleDeleteDocument(documentId) {
    try {
        await index.deleteDocument(documentId);
        logs.deleteDocument(documentId);
    }
    catch (e) {
        logs.error(e);
    }
}
/**
 * Handle update of a document in the Meilisearch index.
 * @param {string} documentId Document id to update.
 * @param {Change} after Snapshot of the data contained in the document read from your Firestore database.
 */
async function handleUpdateDocument(documentId, after) {
    try {
        const document = (0, adapter_1.adaptDocument)(documentId, after);
        await index.updateDocuments([document]);
        logs.updateDocument(documentId, document);
    }
    catch (e) {
        logs.error(e);
    }
}
