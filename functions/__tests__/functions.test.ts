import * as functionsTestInit from 'firebase-functions-test'
import mockedEnv from 'mocked-env'
import { mocked } from 'ts-jest/utils'
import { MeiliSearch } from 'meilisearch'

jest.mock('meilisearch')

const defaultEnvironment = {
  LOCATION: 'us-central1',
  PROJECT_ID: 'fake-project',
  COLLECTION_PATH: 'example',
  INPUT_FIELD_NAME: '',
  MEILISEARCH_INDEX_NAME: 'example',
  MEILISEARCH_HOST: 'http://127.0.0.1:7700',
  MEILISEARCH_API_KEY: 'masterKey',
}

let restoreEnv
  const functionsTest = functionsTestInit()

describe('extension', () => {
  const mockExport = (document: any, data: any) => {
    const ref = require('../src/index').indexingWorker
    return functionsTestInit().wrap(ref)(document, data)
}

  const mockedMeilisearch = mocked(MeiliSearch, true)

  const mockedAddDocuments = jest.fn()
  const mockedUpdateDocuments = jest.fn()
  const mockedDeleteDocument = jest.fn()
  const mockedIndex = jest.fn(() => ({
    addDocuments: mockedAddDocuments,
    updateDocuments: mockedUpdateDocuments,
    deleteDocument: mockedDeleteDocument,
  }))
  mockedMeilisearch.mockReturnValue({
    // @ts-ignore
    index: mockedIndex,
  })

  beforeEach(() => {
    restoreEnv = mockedEnv(defaultEnvironment)
  })

  test('functions are exported', () => {
    const exportedFunctions = jest.requireActual('../src')
    expect(exportedFunctions.indexingWorker).toBeInstanceOf(Function)
  })

  test('meilisearch client initialized', () => {
    expect(mockedMeilisearch).toHaveBeenCalledWith({
      apiKey: defaultEnvironment.MEILISEARCH_API_KEY,
      host: defaultEnvironment.MEILISEARCH_HOST,
    })
  })

  test('meilisearch index initialized', () => {
    expect(mockedIndex).toHaveBeenCalledWith(
      defaultEnvironment.MEILISEARCH_INDEX_NAME
    )
  })

  test('function runs with created data', async () => {
    const beforeSnapshot = functionsTest.firestore.makeDocumentSnapshot(
      {},
      'collection/doc'
    )
    const afterSnapshot = functionsTest.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'collection/doc'
    )

    const documentChange = functionsTest.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const callResult = await mockExport(documentChange, {
      resource: {
        name: 'test',
      },
    })

    expect(callResult).toBeUndefined()
    expect(mockedAddDocuments).toHaveBeenCalled()
  })

  test('function runs with updated data', async () => {
    const beforeSnapshot = functionsTest.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'collection/doc'
    )
    const afterSnapshot = functionsTest.firestore.makeDocumentSnapshot(
      { foo: 'bars' },
      'collection/doc'
    )

    const documentChange = functionsTest.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const callResult = await mockExport(documentChange, {
      resource: {
        name: 'test',
      },
    })

    expect(callResult).toBeUndefined()
    expect(mockedUpdateDocuments).toHaveBeenCalled()
  })

  test('functions runs with deleted data', async () => {
    const beforeSnapshot = { foo: 'bar' }
    const afterSnapshot = { foo: 'bars', exists: false }

    const documentChange = functionsTest.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const callResult = await mockExport(documentChange, {
      resource: {
        name: 'test',
      },
    })

    expect(callResult).toBeUndefined()
    expect(mockedDeleteDocument).toHaveBeenCalled()
  })
})
