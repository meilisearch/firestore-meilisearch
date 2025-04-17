import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import { readFileSync } from 'fs'
import { resolve as pathResolve } from 'path'
import * as yaml from 'js-yaml'
import mockedEnv from 'mocked-env'
import defaultEnvironment from './data/environment'

const EXTENSION_YAML = yaml.load(
  readFileSync(pathResolve(__dirname, '../../extension.yaml'), 'utf8')
)

const extensionParams = EXTENSION_YAML.params.reduce((obj, parameter) => {
  obj[parameter.param] = parameter
  return obj
}, {})

describe('extensions config', () => {
  let config
  let restoreEnv

  beforeEach(() => {
    jest.resetModules()
    restoreEnv = mockedEnv(defaultEnvironment)
    config = require('../src/config').config
  })
  afterEach(() => restoreEnv())

  test('config loaded from environment variables', () => {
    const testConfig = {
      location: defaultEnvironment.LOCATION,
      collectionPath: defaultEnvironment.COLLECTION_PATH,
      meilisearch: {
        host: defaultEnvironment.MEILISEARCH_HOST,
        apiKey: defaultEnvironment.MEILISEARCH_API_KEY,
        indexUid: defaultEnvironment.MEILISEARCH_INDEX_NAME,
        fieldsToIndex: defaultEnvironment.MEILISEARCH_FIELDS_TO_INDEX,
      },
    }

    expect(config).toStrictEqual(testConfig)
  })

  // MEILISEARCH_FIELDS_TO_INDEX
  describe('Test fieldsToIndex parameter', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['MEILISEARCH_FIELDS_TO_INDEX']
      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow spaces', () => {
        const { validationRegex } =
          extensionParams['MEILISEARCH_FIELDS_TO_INDEX']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).toBeNull()
      })

      test('allow comma-separated list', () => {
        const { validationRegex } =
          extensionParams['MEILISEARCH_FIELDS_TO_INDEX']
        const text = 'field1,field2,field3'
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric underscore list of field', () => {
        const { validationRegex } =
          extensionParams['MEILISEARCH_FIELDS_TO_INDEX']
        const text = 'field_1,field_2,field_3'
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric dash list of field', () => {
        const { validationRegex } =
          extensionParams['MEILISEARCH_FIELDS_TO_INDEX']
        const text = 'field-1,field-2,field-3'
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).not.toBeNull()
      })
    })
  })

  // MEILISEARCH_INDEX_NAME
  describe('Test MeilisearchIndex parameters', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['MEILISEARCH_INDEX_NAME']

      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow empty strings', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = ''
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).toBeNull()
      })

      test('does not allow spaces', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).toBeNull()
      })

      test('allows a alphanumeric underscore in index name', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'index_1'
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).not.toBeNull()
      })

      test('allows a alphanumeric dash in index name', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'index-1'
        const search = new RegExp(validationRegex)

        expect(search.exec(text)).not.toBeNull()
      })
    })
  })
})
