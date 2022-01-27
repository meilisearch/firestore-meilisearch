import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import mockedEnv from 'mocked-env'
import { mocked } from 'ts-jest/utils'
import { mockConsoleLog, mockConsoleInfo } from './__mocks__/console'
import { MeiliSearch } from 'meilisearch'
import defaultEnvironment from './data/environment'
import defaultDocument from './data/document'

jest.mock('meilisearch')

// Mocking of Firebase functions
let firebaseMock = firebaseFunctionsTestInit()

describe('extension', () => {
  let config
  let restoreEnv

  // Mocking of Meilisearch package
  const mockedMeilisearch = mocked(MeiliSearch, true)
  const mockedUpdateSearchableAttributes = jest.fn()
  const mockedAddDocuments = jest.fn()
  const mockedUpdateDocuments = jest.fn()
  const mockedDeleteDocument = jest.fn()
  const mockedIndex = jest.fn(() => ({
    addDocuments: mockedAddDocuments,
    updateDocuments: mockedUpdateDocuments,
    deleteDocument: mockedDeleteDocument,
    updateSearchableAttributes: mockedUpdateSearchableAttributes,
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
    config = require('../src/config').default
  })
  afterEach(() => restoreEnv())

  test('functions are exported', () => {
    const exportedFunctions = jest.requireActual('../src')
    expect(exportedFunctions.indexingWorker).toBeInstanceOf(Function)
  })

  test('Meilisearch client initialized', () => {
    expect(mockedMeilisearch).toHaveBeenCalledWith({
      apiKey: defaultEnvironment.MEILISEARCH_API_KEY,
      host: defaultEnvironment.MEILISEARCH_HOST,
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

  test('Meilisearch updateSearchableAttributes', () => {
    expect(mockedUpdateSearchableAttributes).toHaveBeenCalledWith([
      defaultEnvironment.SEARCHABLE_FIELDS,
    ])
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
        'collection/doc'
      )
      const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument,
        'collection/doc'
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
        } in Meilisearch index ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`,
        { ...afterSnapshot.data() }
      )
      expect(mockedAddDocuments).toHaveBeenCalledWith([defaultDocument])
    })

    test('function runs with updated data', async () => {
      const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { foo: 'bar' },
        'collection/doc'
      )
      const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument,
        'collection/doc'
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
        `Updating document ${afterSnapshot.id as string} in Meilisearch index ${
          defaultEnvironment.MEILISEARCH_INDEX_NAME
        }`,
        { ...afterSnapshot.data() }
      )
      expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
      expect(mockedUpdateDocuments).toHaveBeenCalledWith([defaultDocument])
    })

    test('functions runs with deleted data', async () => {
      const beforeSnapshot = defaultDocument
      const afterSnapshot = { ...defaultDocument, exists: false }

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
        `Deleting document ${defaultDocument.id} in Meilisearch index ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
      )
      expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
      expect(mockedDeleteDocument).toHaveBeenCalledWith(defaultDocument.id)
    })
  })
})
