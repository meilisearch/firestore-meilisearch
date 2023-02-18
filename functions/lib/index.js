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
const firebase_functions_1 = require("firebase-functions");
const create_index_1 = require("./meilisearch/create-index");
const util_1 = require("./util");
const logs = require("./logs");
const meilisearch_adapter_1 = require("./meilisearch-adapter");
const config_1 = require("./config");
const validate_1 = require("./validate");
const index = (0, create_index_1.initMeilisearchIndex)(config_1.config.meilisearch);
logs.init();
/**
 * IndexingWorker is responsible for aggregating a defined field from a Firestore collection into a Meilisearch index.
 * It is controlled by a Firestore handler.
 */
exports.indexingWorker = functions.firestore
    .document(config_1.config.collectionPath + '/{documentId}')
    .onWrite(async (snapshot) => {
    logs.start();
    const actionType = (0, util_1.getActionType)(snapshot);
    const documentId = (0, util_1.getChangedDocumentId)(snapshot);
    switch (actionType) {
        case util_1.ChangeType.CREATE:
            await handleAddDocument(documentId, snapshot.after);
            break;
        case util_1.ChangeType.DELETE:
            await handleDeleteDocument(documentId);
            break;
        case util_1.ChangeType.UPDATE:
            await handleUpdateDocument(documentId, snapshot.after);
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
        logs.addDocument(documentId);
        if ((0, validate_1.validateDocumentId)(documentId)) {
            const document = (0, meilisearch_adapter_1.adaptDocumentForMeilisearch)(documentId, snapshot, config_1.config.meilisearch.fieldsToIndex || '');
            const { taskUid } = await index.addDocuments([document], {
                primaryKey: '_firestore_id',
            });
            firebase_functions_1.logger.info(`Document addition request for document with ID ${documentId} added to task list (task ID ${taskUid}).`);
        }
        else {
            firebase_functions_1.logger.error(`Could not create document with id: ${documentId}. The document id can only contain case-insensitive alphanumeric characters (abcDEF), hyphens (-) or underscores(_).`);
        }
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
        logs.deleteDocument(documentId);
        if ((0, validate_1.validateDocumentId)(documentId)) {
            const { taskUid } = await index.deleteDocument(documentId);
            firebase_functions_1.logger.info(`Document deletion request for document with ID ${documentId} added to task list (task ID ${taskUid}).`);
        }
        else {
            firebase_functions_1.logger.error(`Could not delete document with id: ${documentId}. The document id can only contain case-insensitive alphanumeric characters (abcDEF), hyphens (-) or underscores(_).`);
        }
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
        logs.updateDocument(documentId);
        if ((0, validate_1.validateDocumentId)(documentId)) {
            const document = (0, meilisearch_adapter_1.adaptDocumentForMeilisearch)(documentId, after, config_1.config.meilisearch.fieldsToIndex || '');
            const { taskUid } = await index.addDocuments([document]);
            firebase_functions_1.logger.info(`Document update request for document with ID ${documentId} added to task list (task ID ${taskUid}).`);
        }
        else {
            firebase_functions_1.logger.error(`Could not update document with id: ${documentId}.The document id can only contain case-insensitive alphanumeric characters (abcDEF), hyphens (-) or underscores(_).`);
        }
    }
    catch (e) {
        logs.error(e);
    }
}
