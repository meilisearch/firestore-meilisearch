import { MeiliSearch, Index } from 'meilisearch'
import { MeiliSearchConfig } from '../types'

/**
 * createMeiliSearchIndex
 * @param {MeiliSearchConfig} - MeiliSearch configuration
 * @return {Index}
 */
export function createMeiliSearchIndex({
  host,
  apiKey,
  indexUid,
}: MeiliSearchConfig): Index {
  const client = new MeiliSearch({
    host,
    apiKey,
  })

  return client.index(indexUid)
}
