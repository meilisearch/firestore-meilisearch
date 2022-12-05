'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptDocumentForMeilisearch = exports.adaptDocument = void 0;
const functions = require("firebase-functions");
// import { logger } from 'firebase-functions'
const firestore = require("firebase-admin/firestore");
const util_1 = require("./util");
/**
 * Adapts documents from the Firestore database to Meilisearch compatible documents.
 * @param {string} documentId Document id.
 * @param {DocumentSnapshot} snapshot Snapshot of the data contained in the document read from your Firestore database.
 * @param {string} fieldsToIndex list of fields added in the document send to Meilisearch.
 * @return {Record<string, any>} A properly formatted document to be added or updated in Meilisearch.
 */
function adaptDocument(documentId, snapshot, fieldsToIndex) {
    const fields = (0, util_1.parseFieldsToIndex)(fieldsToIndex);
    const data = snapshot.data() || {};
    if ('_firestore_id' in data) {
        delete data.id;
    }
    const document = (0, util_1.sanitizeDocuments)(fields, data);
    console.log({ document });
    const adaptedDoc = adaptDocumentForMeilisearch(document);
    console.log({ adaptedDoc });
    return { _firestore_id: documentId, ...document };
}
exports.adaptDocument = adaptDocument;
/**
 * Update special fields to Meilisearch compatible format
 * @param {firestore.DocumentData} document
 * @return {firestore.DocumentData} A properly formatted array of field and value.
 */
function adaptDocumentForMeilisearch(document) {
    functions.logger.info(`ADAPT VALUES`);
    return Object.keys(document).reduce((doc, currentField) => {
        const value = document[currentField];
        console.log({ currentField });
        if (currentField === '_geo' && value instanceof firestore.GeoPoint) {
            return {
                ...doc,
                _geo: adaptGeoPoint(value),
            };
        }
        return { ...doc, [currentField]: value };
    }, {});
}
exports.adaptDocumentForMeilisearch = adaptDocumentForMeilisearch;
/**
 * Adapts GeoPoint Firestore instance to fit with Meilisearch geo point.
 * @param {firestore.GeoPoint} geoPoint GeoPoint Firestore object.
 * @return {MeilisearchGeoPoint} A properly formatted geo point for Meilisearch.
 */
const adaptGeoPoint = (geoPoint) => {
    return {
        lat: geoPoint.latitude,
        lng: geoPoint.longitude,
    };
};
