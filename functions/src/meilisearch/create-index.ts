import { MeiliSearch, Index } from 'meilisearch'
import { MeilisearchConfig } from '../types'
import { constructClientAgents } from './agents'

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
    clientAgents: constructClientAgents(),
  })

  return client.index(indexUid)
}
