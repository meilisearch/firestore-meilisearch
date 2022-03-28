'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    location: process.env.LOCATION || 'europe-west1',
    collectionPath: process.env.COLLECTION_PATH || '',
    meilisearch: {
        host: process.env.MEILISEARCH_HOST || '',
        apiKey: process.env.MEILISEARCH_API_KEY || '',
        indexUid: process.env.MEILISEARCH_INDEX_NAME || '',
        fieldsToIndex: process.env.MEILISEARCH_FIELDS_TO_INDEX || '',
        searchableFields: process.env.MEILISEARCH_SEARCHABLE_FIELDS || '',
    },
};
