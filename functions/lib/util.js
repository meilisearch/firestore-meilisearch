'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSearchableFields = exports.getFieldsToIndex = exports.getChangedDocumentId = exports.getChangeType = exports.ChangeType = void 0;
const config_1 = require("./config");
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
 * Returns the MEILISEARCH_FIELDS_TO_INDEX value from the config file and formats it.
 * @return {string[]} An array of fields.
 */
function getFieldsToIndex() {
    return config_1.config.meilisearch.fieldsToIndex
        ? config_1.config.meilisearch.fieldsToIndex.split(/[ ,]+/)
        : [];
}
exports.getFieldsToIndex = getFieldsToIndex;
/**
 * Returns the MEILISEARCH_SEARCHABLE_FIELDS value from the config file and formats it.
 * @return {string[]} An array of fields.
 */
function getSearchableFields() {
    return config_1.config.meilisearch.searchableFields
        ? config_1.config.meilisearch.searchableFields.split(/[ ,]+/)
        : [];
}
exports.getSearchableFields = getSearchableFields;
