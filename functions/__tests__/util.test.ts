import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import mockedEnv from 'mocked-env'

import { getChangeType, ChangeType, getDocumentId } from '../src/util'

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

describe('getChangeType', () => {
  const firebaseMock = firebaseFunctionsTestInit()

  test('return a create change type', () => {
    const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      {},
      'docs/1'
    )
    const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'docs/1'
    )

    const documentChange = firebaseMock.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const changeType: ChangeType = getChangeType(documentChange)

    expect(changeType).toEqual(ChangeType.CREATE)
  })

  test('return a update change type', () => {
    const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'docs/1'
    )
    const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bars' },
      'docs/1'
    )

    const documentChange = firebaseMock.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const changeType: ChangeType = getChangeType(documentChange)

    expect(changeType).toEqual(ChangeType.UPDATE)
  })

  test('return a delete change type', () => {
    const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'docs/1'
    )
    const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      {},
      'docs/1'
    )

    const documentChange = firebaseMock.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const changeType: ChangeType = getChangeType(documentChange)

    expect(changeType).toEqual(ChangeType.DELETE)
  })
})

describe('getDocumentId', () => {
  const firebaseMock = firebaseFunctionsTestInit()

  test('return id after create document', () => {
    const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      {},
      'docs/1'
    )
    const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'docs/2'
    )

    const documentChange = firebaseMock.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const id: string = getDocumentId(documentChange)

    expect(id).toEqual('2')
  })

  test('return id after update document', () => {
    const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'docs/1'
    )
    const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bars' },
      'docs/2'
    )

    const documentChange = firebaseMock.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const id: string = getDocumentId(documentChange)

    expect(id).toEqual('2')
  })

  test('return id after delete document', () => {
    const beforeSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      { foo: 'bar' },
      'docs/1'
    )
    const afterSnapshot = firebaseMock.firestore.makeDocumentSnapshot(
      {},
      'docs/2'
    )

    const documentChange = firebaseMock.makeChange(
      beforeSnapshot,
      afterSnapshot
    )

    const id: string = getDocumentId(documentChange)

    expect(id).toEqual('1')
  })
})

describe('getSearchableFields', () => {
  let util
  let config
  let restoreEnv
  let mockGetSearchableFields

  beforeEach(() => {
    jest.resetModules()
    restoreEnv = mockedEnv(environment)
    config = global.config
  })
  afterEach(() => restoreEnv())

  test('configuration detected from environment variables', () => {
    const mockConfig = config()
    expect(mockConfig).toMatchSnapshot({})
  })

  test('return empty list', () => {
    util = require('../src/util')
    mockGetSearchableFields = util.getSearchableFields()
    expect(mockGetSearchableFields).toMatchObject([])
  })

  test('return list with one field', () => {
    restoreEnv = mockedEnv({ ...environment, SEARCHABLE_FIELDS: 'field' })
    util = require('../src/util')
    mockGetSearchableFields = util.getSearchableFields()
    expect(mockGetSearchableFields).toMatchObject(['field'])
  })

  test('return list with multiple field', () => {
    restoreEnv = mockedEnv({
      ...environment,
      SEARCHABLE_FIELDS: 'field1,field2,field3',
    })
    util = require('../src/util')
    mockGetSearchableFields = util.getSearchableFields()
    expect(mockGetSearchableFields).toMatchObject([
      'field1',
      'field2',
      'field3',
    ])
  })

  test('return list with multiple field and space', () => {
    restoreEnv = mockedEnv({
      ...environment,
      SEARCHABLE_FIELDS: 'field1, field2,  field3',
    })
    util = require('../src/util')
    mockGetSearchableFields = util.getSearchableFields()
    expect(mockGetSearchableFields).toMatchObject([
      'field1',
      'field2',
      'field3',
    ])
  })

  test('return list with underscore', () => {
    restoreEnv = mockedEnv({
      ...environment,
      SEARCHABLE_FIELDS: 'field_1,field_2,field_3',
    })
    util = require('../src/util')
    mockGetSearchableFields = util.getSearchableFields()
    expect(mockGetSearchableFields).toMatchObject([
      'field_1',
      'field_2',
      'field_3',
    ])
  })
})
