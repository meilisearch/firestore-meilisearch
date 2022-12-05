'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChangedDocumentId = exports.getActionType = exports.ChangeType = void 0;
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
function getActionType(change) {
    if (!change.after.exists) {
        return ChangeType.DELETE;
    }
    if (!change.before.exists) {
        return ChangeType.CREATE;
    }
    return ChangeType.UPDATE;
}
exports.getActionType = getActionType;
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
