import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import mockedEnv from 'mocked-env'
import { mocked } from 'ts-jest/utils'
import { mockConsoleLog, mockConsoleInfo } from './__mocks__/console'
import { MeiliSearch } from 'meilisearch'

jest.mock('meilisearch')

const defaultEnvironment = {
  LOCATION: 'us-central1',
  PROJECT_ID: 'fake-project',
  COLLECTION_PATH: 'collection',
  FIELDS_TO_INDEX: '',
  MEILISEARCH_INDEX_NAME: 'example',
  MEILISEARCH_HOST: 'http://127.0.0.1:7700',
  MEILISEARCH_API_KEY: 'masterKey',
}

const defaultDocument = {
  id: '0jKUH3XUNXFyujm3rZAa',
  title: 'The Lord of the Rings: The Fellowship of the Ring',
  genre: ['Adventure', 'Fantasy', 'Action'],
  overview:
    'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
  poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
  release_date: 1008633600,
}

describe('extension', () => {
  // Mocking of Firebase functions
  const firebaseMock = firebaseFunctionsTestInit()

  // Mocking of MeiliSearch package
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

  // Mocking of firestore-meilisearch
  const mockExport = (document: any, data: any) => {
    const ref = require('../src/index').indexingWorker
    return firebaseFunctionsTestInit().wrap(ref)(document, data)
  }

  beforeEach(() => {
    mockedEnv(defaultEnvironment)
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
      'Initializing extension with configuration'
    )
    expect(mockConsoleLog).toBeCalledWith(
      'Started execution of extension with configuration'
    )
    expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
    expect(mockConsoleInfo).toBeCalledWith(
      `Creating new document ${
        afterSnapshot.id as string
      } in MeiliSearch index ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`,
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
      'Initializing extension with configuration'
    )
    expect(mockConsoleLog).toBeCalledWith(
      'Started execution of extension with configuration'
    )
    expect(mockConsoleInfo).toBeCalledWith(
      `Updating document ${afterSnapshot.id as string} in MeiliSearch index ${
        defaultEnvironment.MEILISEARCH_INDEX_NAME
      }`,
      { ...afterSnapshot.data() }
    )
    expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
    expect(mockedUpdateDocuments).toHaveBeenCalledWith([defaultDocument])
  })

  test('functions runs with deleted data', async () => {
    const beforeSnapshot = { ...defaultDocument }
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
      'Initializing extension with configuration'
    )
    expect(mockConsoleLog).toBeCalledWith(
      'Started execution of extension with configuration'
    )
    expect(mockConsoleInfo).toBeCalledWith(
      `Deleting document ${defaultDocument.id} in MeiliSearch index ${defaultEnvironment.MEILISEARCH_INDEX_NAME}`
    )
    expect(mockConsoleLog).toBeCalledWith('Completed execution of extension')
    expect(mockedDeleteDocument).toHaveBeenCalledWith(defaultDocument.id)
  })
})
