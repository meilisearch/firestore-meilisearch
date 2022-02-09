import { MeiliSearch, Index } from 'meilisearch'
import { MeilisearchConfig } from '../types'

/**
 * createMeilisearchIndex
 * @param {MeilisearchConfig} - Meilisearch configuration
 * @return {Index}
 */
export function createMeilisearchIndex({
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
