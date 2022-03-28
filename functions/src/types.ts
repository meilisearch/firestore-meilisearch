export type { Index } from 'meilisearch'

export type MeilisearchConfig = {
  host: string
  apiKey: string
  indexUid: string
  fieldsToIndex?: string
}
