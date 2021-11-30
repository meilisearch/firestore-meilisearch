export type { Index } from 'meilisearch'

export type MeiliSearchConfig = {
  host: string
  apiKey: string
  indexUid: string
  fieldsToIndex?: string
  searchableFields?: string
}
