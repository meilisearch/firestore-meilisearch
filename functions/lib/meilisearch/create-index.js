"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMeilisearchIndex = void 0;
const meilisearch_1 = require("meilisearch");
/**
 * initMeilisearchIndex
 * @param {MeilisearchConfig} - Meilisearch configuration
 * @return {Index}
 */
function initMeilisearchIndex({ host, apiKey, indexUid, }) {
    const client = new meilisearch_1.MeiliSearch({
        host,
        apiKey,
    });
    return client.index(indexUid);
}
exports.initMeilisearchIndex = initMeilisearchIndex;
