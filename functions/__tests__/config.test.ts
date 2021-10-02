import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import { readFileSync } from 'fs'
import { resolve as pathResolve } from 'path'

import * as yaml from 'js-yaml'
import mockedEnv from 'mocked-env'

const EXTENSION_YAML = yaml.load(
  readFileSync(pathResolve(__dirname, '../../extension.yaml'), 'utf8')
)

const extensionParams = EXTENSION_YAML.params.reduce((obj, parameter) => {
  obj[parameter.param] = parameter
  return obj
}, {})

const environment = {
  LOCATION: 'us-central1',
  PROJECT_ID: 'fake-project',
  COLLECTION_PATH: 'collection',
  FIELDS_TO_INDEX: '',
  SEARCHABLE_FIELDS: '',
  MEILISEARCH_INDEX_NAME: 'example',
  MEILISEARCH_HOST: 'http://127.0.0.1:7700',
  MEILISEARCH_API_KEY: 'masterKey',
}

// Mocking of Firebase functions
firebaseFunctionsTestInit()

describe('extensions config', () => {
  let restoreEnv
  let config

  beforeEach(() => {
    jest.resetModules()
    restoreEnv = mockedEnv(environment)
    config = global.config()
  })
  afterEach(() => restoreEnv())

  test('config loaded from environment variables', () => {
    const testConfig = {
      location: environment.LOCATION,
      collectionPath: environment.COLLECTION_PATH,
      fieldsToIndex: environment.FIELDS_TO_INDEX,
      searchableFields: environment.SEARCHABLE_FIELDS,
      meilisearchIndex: environment.MEILISEARCH_INDEX_NAME,
      meilisearchHost: environment.MEILISEARCH_HOST,
      meilisearchApiKey: environment.MEILISEARCH_API_KEY,
    }

    expect(config).toStrictEqual(testConfig)
  })

  // FIELDS_TO_INDEX
  describe('Test fieldsToIndex parameter', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['FIELDS_TO_INDEX']
      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow spaces', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeFalsy()
      })

      test('allow comma-separated list', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'field1,field2,field3'
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeTruthy()
      })

      test('allows a alphanumeric underscore list of field', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'field_1,field_2,field_3'
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeTruthy()
      })

      test('allows a alphanumeric dash list of field', () => {
        const { validationRegex } = extensionParams['FIELDS_TO_INDEX']
        const text = 'field-1,field-2,field-3'
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeTruthy()
      })
    })
  })

  // MEILISEARCH_INDEX_NAME
  describe('Test meilisearchIndex parameter', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['MEILISEARCH_INDEX_NAME']
      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow empty strings', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = ''
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeFalsy()
      })

      test('does not allow spaces', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeFalsy()
      })

      test('allows a alphanumeric underscore in index name', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'index_1'
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeTruthy()
      })

      test('allows a alphanumeric dash in index name', () => {
        const { validationRegex } = extensionParams['MEILISEARCH_INDEX_NAME']
        const text = 'index-1'
        const search = new RegExp(validationRegex)
        expect(Boolean(search.exec(text))).toBeTruthy()
      })
    })
  })

  // SEARCHABLE_FIELDS
  describe('Test searchableFields parameter', () => {
    test('param exists', () => {
      const extensionParam = extensionParams['SEARCHABLE_FIELDS']
      expect(extensionParam).toMatchSnapshot()
    })

    describe('validationRegex', () => {
      test('does not allow spaces', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'foo bar'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })

      test('allow comma-separated list', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'field1,field2,field3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })

      test('allows a alphanumeric underscore list of field', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'field_1,field_2,field_3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })

      test('allows a alphanumeric dash list of field', () => {
        const { validationRegex } = extensionParams['SEARCHABLE_FIELDS']
        const text = 'field-1,field-2,field-3'
        const search = new RegExp(validationRegex)
        expect(search.exec(text)).toBeNull()
      })
    })
  })
})
