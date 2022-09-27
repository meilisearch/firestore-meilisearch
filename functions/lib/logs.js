'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.importData = exports.infoGeoPoint = exports.deleteDocument = exports.updateDocument = exports.addDocument = exports.complete = exports.error = exports.start = exports.init = void 0;
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
const firebase_functions_1 = require("firebase-functions");
const config_1 = require("./config");
/**
 * Initialization logger.
 */
function init() {
    firebase_functions_1.logger.log('Initializing extension with configuration', config_1.config);
}
exports.init = init;
/**
 * Start logger.
 */
function start() {
    firebase_functions_1.logger.log('Started execution of extension with configuration', config_1.config);
}
exports.start = start;
/**
 * Error logger.
 * @param {Error} err
 */
function error(err) {
    firebase_functions_1.logger.error('Unhandled error occurred during processing:', err);
}
exports.error = error;
/**
 * Complete logger.
 */
function complete() {
    firebase_functions_1.logger.log('Completed execution of extension');
}
exports.complete = complete;
/**
 * Log an addition of a document.
 * @param {string} id Document id added.
 * @param {object} data Data contained in the document.
 */
function addDocument(id, data) {
    firebase_functions_1.logger.info(`Creating new document ${id} in Meilisearch index ${config_1.config.meilisearch.indexUid}`, data);
}
exports.addDocument = addDocument;
/**
 * Log an update of a document.
 * @param {string} id Document id updated.
 * @param {object} data Data contained in the document.
 */
function updateDocument(id, data) {
    firebase_functions_1.logger.info(`Updating document ${id} in Meilisearch index ${config_1.config.meilisearch.indexUid}`, data);
}
exports.updateDocument = updateDocument;
/**
 * Log a deletion of a document.
 * @param {string} id Document id deleted.
 */
function deleteDocument(id) {
    firebase_functions_1.logger.info(`Deleting document ${id} in Meilisearch index ${config_1.config.meilisearch.indexUid}`);
}
exports.deleteDocument = deleteDocument;
/**
 * Log a modification of geoPoint based on whether or not it has the correct naming to enable `geosearch` in Meilisearch.
 * @param {boolean} hasGeoField a boolean value that indicates whether the field is correctly named to enable `geosearch` in Meilisearch.
 */
function infoGeoPoint(hasGeoField) {
    if (hasGeoField) {
        firebase_functions_1.logger.info(`A GeoPoint was found with the field name '_geo' for compatibility with Meilisearch the field 'latitude' was renamed to 'lat' and the field 'longitude' to 'lng'`);
    }
    else {
        firebase_functions_1.logger.info(`A GeoPoint was found without the field name '_geo' if you want to use the geoSearch with Meilisearch rename it to '_geo'`);
    }
}
exports.infoGeoPoint = infoGeoPoint;
/**
 * Importation data logger.
 * @param {number} total
 * @param {number} batches
 */
function importData(total, batches) {
    firebase_functions_1.logger.info(`Imported ${total} documents in ${batches} batches.`);
}
exports.importData = importData;
