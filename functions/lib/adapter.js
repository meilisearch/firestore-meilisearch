'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptValues = exports.adaptDocument = void 0;
const firestore_1 = require("firebase-admin/lib/firestore");
const util_1 = require("./util");
const logs = require("./logs");
/**
 * Adapts documents from the Firestore database to Meilisearch compatible documents.
 * @param {string} documentId Document id.
 * @param {DocumentSnapshot} snapshot Snapshot of the data contained in the document read from your Firestore database.
 * @return {Record<string, any>} A properly formatted document to be added or updated in Meilisearch.
 */
function adaptDocument(documentId, snapshot) {
    const fields = (0, util_1.getFieldsToIndex)();
    const data = snapshot.data() || {};
    if ('_firestore_id' in data) {
        delete data.id;
    }
    if (fields.length === 0) {
        return { _firestore_id: documentId, ...data };
    }
    const document = Object.keys(data).reduce((acc, key) => {
        if (fields.includes(key)) {
            const [field, value] = adaptValues(key, data[key]);
            return { ...acc, [field]: value };
        }
        return acc;
    }, { _firestore_id: documentId });
    return document;
}
exports.adaptDocument = adaptDocument;
/**
 * Checks and adapts each values to be compatible with Meilisearch documents.
 * @param {string} field
 * @param {FirestoreRow} value
 * @return {[string,FirestoreRow]} A properly formatted array of field and value.
 */
function adaptValues(field, value) {
    if (value instanceof firestore_1.firestore.GeoPoint) {
        if (field === '_geo') {
            logs.infoGeoPoint(true);
            return [field, adaptGeoPoint(value)];
        }
        else {
            logs.infoGeoPoint(false);
        }
    }
    return [field, value];
}
exports.adaptValues = adaptValues;
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
