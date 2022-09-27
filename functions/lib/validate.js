"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDocumentId = void 0;
/**
 * @param  {string} documentId
 *
 * @return {boolean}
 */
function validateDocumentId(documentId) {
    const wrongChars = documentId.search(/([^a-zA-Z0-9-_]+)/);
    return wrongChars === -1;
}
exports.validateDocumentId = validateDocumentId;
