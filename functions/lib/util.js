'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeDocuments = exports.parseFieldsToIndex = exports.getChangedDocumentId = exports.getChangeType = exports.ChangeType = void 0;
var ChangeType;
(function (ChangeType) {
    ChangeType[ChangeType["CREATE"] = 0] = "CREATE";
    ChangeType[ChangeType["DELETE"] = 1] = "DELETE";
    ChangeType[ChangeType["UPDATE"] = 2] = "UPDATE";
})(ChangeType = exports.ChangeType || (exports.ChangeType = {}));
/**
 * Get type of the modification perform on a document.
 * @param {Change<T>} change The Functions interface for events that change state.
 * @return {ChangeType} Final type of the event.
 */
function getChangeType(change) {
    if (!change.after.exists) {
        return ChangeType.DELETE;
    }
    if (!change.before.exists) {
        return ChangeType.CREATE;
    }
    return ChangeType.UPDATE;
}
exports.getChangeType = getChangeType;
/**
 * Get final id of a document after modification.
 * @param {Change<T>} change The Functions interface for events that change state.
 * @return {string} Final state type of the event.
 */
function getChangedDocumentId(change) {
    if (change.after.exists) {
        return change.after.id;
    }
    return change.before.id;
}
exports.getChangedDocumentId = getChangedDocumentId;
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
 * Remove unwanted fields from the document before it is send to Meilisearch.
 *
 * @param  {string[]} fieldsToIndex
 * @param  {Record<string, any>} document
 * @return {Record<string, any>} sanitized document
 *
 */
function sanitizeDocuments(fieldsToIndex, document) {
    if (fieldsToIndex.length === 0) {
        return document;
    }
    if (fieldsToIndex.includes('*')) {
        return document;
    }
    for (const key in document) {
        if (!fieldsToIndex.includes(key)) {
            delete document[key];
        }
    }
    return document;
}
exports.sanitizeDocuments = sanitizeDocuments;
