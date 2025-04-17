import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals'
import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import mockedEnv from 'mocked-env'
import { mocked } from 'jest-mock'
import {
  mockConsoleLog,
  mockConsoleInfo,
  mockConsoleError,
} from './__mocks__/console'
import { MeiliSearch } from 'meilisearch'
import defaultEnvironment from './data/environment'
import defaultDocument from './data/document'
import { version } from '../src/version'

jest.mock('meilisearch')

// Mocking of Firebase functions
let firebaseMock = firebaseFunctionsTestInit()

describe('extension', () => {
  let config
  let restoreEnv

  // Mocking of Meilisearch package
  const mockedMeilisearch = mocked(MeiliSearch)
  const mockedAddDocuments = jest.fn()
  const mockedDeleteDocument = jest.fn()
  const mockedIndex = jest.fn(() => ({
    addDocuments: mockedAddDocuments,
    deleteDocument: mockedDeleteDocument,
  }))
  mockedMeilisearch.mockReturnValue({
    // @ts-ignore
    index: mockedIndex,
  })

  // Mocking of firestore-meilisearch
  const mockExport = (document: any, data: any) => {
    const ref = require('../src/index').indexingWorker
    return firebaseFunctionsTestInit().wrap(ref)(document, data)
  }

  beforeEach(() => {
    restoreEnv = mockedEnv(defaultEnvironment)
    config = require('../src/config').config
    config.collectionPath = 'collection'
  })
  afterEach(() => restoreEnv())

  test('functions are exported', () => {
    const exportedFunctions = jest.requireActual('../src')

    // @ts-ignore: We're asserting the export is a function
    expect(exportedFunctions.indexingWorker).toBeInstanceOf(Function)
  })

  test('Meilisearch client initialized', () => {
    expect(mockedMeilisearch).toHaveBeenCalledWith({
      apiKey: defaultEnvironment.MEILISEARCH_API_KEY,
      host: defaultEnvironment.MEILISEARCH_HOST,
      clientAgents: [`Meilisearch Firebase (v${version})`],
    })
    expect(mockConsoleLog).toBeCalledWith(
      'Initializing extension with configuration',
      config
    )
  })

  test('Meilisearch index initialized', () => {
    expect(mockedIndex).toHaveBeenCalledWith(
      defaultEnvironment.MEILISEARCH_INDEX_NAME
    )
    expect(mockConsoleLog).toBeCalledWith(
      'Initializing extension with configuration',
      config
    )
  })

  describe('functions.indexingWorker', () => {
    firebaseMock = firebaseFunctionsTestInit()

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('function runs with created data', async () => {
      const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        {},
        `collection/{}`
      )
      const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument.document,
        `collection/${defaultDocument.id}`
      )
      const documentChange = firebaseMock.makeChange(
        beforeSnapshot,
        afterSnapshot
      )

      const callResult = await mockExport(documentChange, {
        resource: {
          name: 'test',
        },
      })

      expect(callResult).toBeUndefined()
      expect(mockConsoleLog).toBeCalledWith(
        'Started execution of extension with configuration',
        config
      )
      expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
      expect(mockConsoleInfo).toBeCalledWith(
        `Creating new document ${
          afterSnapshot.id as string
        } in Meilisearch index: ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
      )
      expect(mockedAddDocuments).toHaveBeenCalledWith(
        [
          {
            _firestore_id: defaultDocument.id,
            ...defaultDocument.document,
          },
        ],
        { primaryKey: '_firestore_id' }
      )
    })

    test('function runs with created data with id fields in document', async () => {
      const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        {},
        `collection/{}`
      )
      const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { id: '12345', ...defaultDocument.document },
        `collection/${defaultDocument.id}`
      )
      const documentChange = firebaseMock.makeChange(
        beforeSnapshot,
        afterSnapshot
      )

      const callResult = await mockExport(documentChange, {
        resource: {
          name: 'test',
        },
      })

      expect(callResult).toBeUndefined()
      expect(mockConsoleLog).toBeCalledWith(
        'Started execution of extension with configuration',
        config
      )
      expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
      expect(mockConsoleInfo).toBeCalledWith(
        `Creating new document ${
          afterSnapshot.id as string
        } in Meilisearch index: ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
      )
      expect(mockedAddDocuments).toHaveBeenCalledWith(
        [
          {
            _firestore_id: defaultDocument.id,
            id: '12345',
            ...defaultDocument.document,
          },
        ],
        { primaryKey: '_firestore_id' }
      )
    })

    test('function run on creating document with unauthorized chars in document id', async () => {
      const badId = '@@ !#'
      const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        {},
        `collection/{}`
      )
      const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { id: badId },
        `collection/${badId}`
      )
      const documentChange = firebaseMock.makeChange(
        beforeSnapshot,
        afterSnapshot
      )

      await mockExport(documentChange, {
        resource: {
          name: 'test',
        },
      })

      expect(mockConsoleInfo).toBeCalledWith(
        `Creating new document ${
          afterSnapshot.id as string
        } in Meilisearch index: ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
      )
      expect(mockConsoleError).toBeCalledWith(
        `Could not create document with id: ${badId}. The document id can only contain case-insensitive alphanumeric characters (abcDEF), hyphens (-) or underscores(_).`
      )
    })

    test('function runs with updated data', async () => {
      const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { foo: 'bar' },
        `collection/${defaultDocument.id}`
      )
      const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument.document,
        `collection/${defaultDocument.id}`
      )
      const documentChange = firebaseMock.makeChange(
        beforeSnapshot,
        afterSnapshot
      )

      const callResult = await mockExport(documentChange, {
        resource: {
          name: 'test',
        },
      })

      expect(callResult).toBeUndefined()
      expect(mockConsoleLog).toBeCalledWith(
        'Started execution of extension with configuration',
        config
      )
      expect(mockConsoleInfo).toBeCalledWith(
        `Updating document ${
          afterSnapshot.id as string
        } in Meilisearch index: ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
      )
      expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
      expect(mockedAddDocuments).toHaveBeenCalledWith([
        {
          _firestore_id: defaultDocument.id,
          ...defaultDocument.document,
        },
      ])
    })

    test('function runs with updated data with id fields in document', async () => {
      const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { foo: 'bar' },
        `collection/${defaultDocument.id}`
      )
      const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { id: '12345', ...defaultDocument.document },
        `collection/${defaultDocument.id}`
      )
      const documentChange = firebaseMock.makeChange(
        beforeSnapshot,
        afterSnapshot
      )

      const callResult = await mockExport(documentChange, {
        resource: {
          name: 'test',
        },
      })

      expect(callResult).toBeUndefined()
      expect(mockConsoleLog).toBeCalledWith(
        'Started execution of extension with configuration',
        config
      )
      expect(mockConsoleInfo).toBeCalledWith(
        `Updating document ${
          afterSnapshot.id as string
        } in Meilisearch index: ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
      )
      expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
      expect(mockedAddDocuments).toHaveBeenCalledWith([
        {
          _firestore_id: defaultDocument.id,
          id: '12345',
          ...defaultDocument.document,
        },
      ])
    })

    test('functions runs with deleted data', async () => {
      const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { foo: 'bar' },
        `collection/${defaultDocument.id}`
      )
      const afterSnapshot = { ...defaultDocument.document, exists: false }
      const documentChange = firebaseMock.makeChange(
        beforeSnapshot,
        afterSnapshot
      )

      const callResult = await mockExport(documentChange, {
        resource: {
          name: 'test',
        },
      })

      expect(callResult).toBeUndefined()
      expect(mockConsoleLog).toBeCalledWith(
        'Started execution of extension with configuration',
        config
      )
      expect(mockConsoleInfo).toBeCalledWith(
        `Deleting document ${defaultDocument.id} in Meilisearch index: ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
      )
      expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
      expect(mockedDeleteDocument).toHaveBeenCalledWith(defaultDocument.id)
    })
  })
})
