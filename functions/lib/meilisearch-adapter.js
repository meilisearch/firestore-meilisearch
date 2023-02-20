'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptDocumentForMeilisearch = exports.adaptFields = exports.parseFieldsToIndex = exports.isAFieldToIndex = void 0;
const firestore = require("firebase-admin/firestore");
const logs_1 = require("./logs");
/**
 * Adapts GeoPoint Firestore instance to fit with Meilisearch geo point.
 * @param {firestore.GeoPoint} geoPoint GeoPoint Firestore object.
 * @return {MeilisearchGeoPoint} A properly formatted geo point for Meilisearch.
 */
function adaptGeoPoint(geoPoint) {
    return {
        lat: geoPoint.latitude,
        lng: geoPoint.longitude,
    };
}
/**
 * Check if the field is added to the document send to Meilisearch.
 *
 * @param  {string[]} fieldsToIndex
 * @param  {string} key
 * @return {boolean} true if it is a field that should be indexed in Meilisearch
 *
 */
function isAFieldToIndex(fieldsToIndex, key) {
    if (fieldsToIndex.length === 0 ||
        fieldsToIndex.includes('*') ||
        fieldsToIndex.includes(key)) {
        return true;
    }
    return false;
}
exports.isAFieldToIndex = isAFieldToIndex;
/**
 * Parse the fieldsToIndex string into an array.
 *
 * @param  {string} fieldsToIndex
 * @return {string[]} An array of fields.
 */
function parseFieldsToIndex(fieldsToIndex) {
    return fieldsToIndex ? fieldsToIndex.split(/[ ,]+/) : [];
}
exports.parseFieldsToIndex = parseFieldsToIndex;
/**
 * Update special fields to Meilisearch compatible format
 * @param {firestore.DocumentData} document
 * @param {string[]} rawFieldsToIndex
 * @return {firestore.DocumentData} A properly formatted array of field and value.
 */
function adaptFields(document, rawFieldsToIndex) {
    const fieldsToIndex = parseFieldsToIndex(rawFieldsToIndex);
    return Object.keys(document).reduce((doc, currentField) => {
        const value = document[currentField];
        if (!isAFieldToIndex(fieldsToIndex, currentField))
            return doc;
        if (value instanceof firestore.GeoPoint) {
            if (currentField === '_geo') {
                (0, logs_1.infoGeoPoint)(true);
                return {
                    ...doc,
                    _geo: adaptGeoPoint(value),
                };
            }
            else {
                (0, logs_1.infoGeoPoint)(false);
            }
        }
        return { ...doc, [currentField]: value };
    }, {});
}
exports.adaptFields = adaptFields;
/**
 * Adapts documents from the Firestore database to Meilisearch compatible documents.
 * @param {string} documentId Document id.
 * @param {DocumentSnapshot} snapshot Snapshot of the data contained in the document read from your Firestore database.
 * @param {string} rawFieldsToIndex Value of the setting `FIELDS_TO_INDEX`
 * @return {Record<string, any>} A properly formatted document to be added or updated in Meilisearch.
 */
function adaptDocumentForMeilisearch(documentId, snapshot, rawFieldsToIndex) {
    const data = snapshot.data() || {};
    if ('_firestore_id' in data) {
        delete data.id;
    }
    const adaptedDoc = adaptFields(data, rawFieldsToIndex);
    return { _firestore_id: documentId, ...adaptedDoc };
}
exports.adaptDocumentForMeilisearch = adaptDocumentForMeilisearch;
