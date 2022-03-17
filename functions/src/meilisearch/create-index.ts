import { MeiliSearch, Index } from 'meilisearch'
import { MeilisearchConfig } from '../types'

/**
 * initMeilisearchIndex
 * @param {MeilisearchConfig} - Meilisearch configuration
 * @return {Index}
 */
export function initMeilisearchIndex({
  host,
  apiKey,
  indexUid,
}: MeilisearchConfig): Index {
  const client = new MeiliSearch({
    host,
    apiKey,
  })

  return client.index(indexUid)
}
