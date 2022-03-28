"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMeiliSearchIndex = void 0;
const meilisearch_1 = require("meilisearch");
/**
 * createMeiliSearchIndex
 * @param {MeiliSearchConfig}
 * @return {Index}
 */
function createMeiliSearchIndex({ host, apiKey, indexUid, }) {
    const client = new meilisearch_1.MeiliSearch({
        host,
        apiKey,
    });
    return client.index(indexUid);
}
exports.createMeiliSearchIndex = createMeiliSearchIndex;
