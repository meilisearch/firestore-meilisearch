import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import { readFileSync } from 'fs'
import { resolve as pathResolve } from 'path'

import * as yaml from 'js-yaml'
import mockedEnv from 'mocked-env'

let restoreEnv
let extensionYaml
let extensionParams
let functionsConfig

// Mocking of Firebase functions
firebaseFunctionsTestInit()

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

describe('extensions config', () => {
  beforeAll(() => {
    // Load the yaml documentation who contain all the environment parameters
    extensionYaml = yaml.load(
      readFileSync(pathResolve(__dirname, '../../extension.yaml'), 'utf8')
    )

    // Get all environment parameters in an object
    extensionParams = extensionYaml.params.reduce((obj, param) => {
      obj[param.param] = param
      return obj
    }, {})
  })

  beforeEach(() => {
    jest.resetModules()
    restoreEnv = mockedEnv(environment)
    functionsConfig = global.config
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

    expect(functionsConfig()).toStrictEqual(testConfig)
  })

  // FIELDS_TO_INDEX
  describe('config.fieldsToIndex', () => {
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
  describe('config.meilisearchIndex', () => {
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
})