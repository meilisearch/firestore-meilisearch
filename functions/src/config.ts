'use strict'
/*
 * Copyright 2022 Meilisearch
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { MeilisearchConfig } from './types'

type PluginConfiguration = {
  location: string
  collectionPath: string
  meilisearch: MeilisearchConfig
}

export const config: PluginConfiguration = {
  location: process.env.LOCATION || 'europe-west1',
  collectionPath: process.env.COLLECTION_PATH || '',
  meilisearch: {
    host: process.env.MEILISEARCH_HOST || '',
    apiKey: process.env.MEILISEARCH_API_KEY || '',
    indexUid: process.env.MEILISEARCH_INDEX_NAME || '',
    fieldsToIndex: process.env.FIELDS_TO_INDEX || '',
    searchableFields: process.env.SEARCHABLE_FIELDS || '',
  },
}
