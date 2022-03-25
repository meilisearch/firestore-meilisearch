import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import mockedEnv from 'mocked-env'
import { getChangeType, ChangeType, getChangedDocumentId } from '../src/util'
import defaultEnvironment from './data/environment'

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

describe('getChangedDocumentId', () => {
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

    const id: string = getChangedDocumentId(documentChange)

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

    const id: string = getChangedDocumentId(documentChange)

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

    const id: string = getChangedDocumentId(documentChange)

    expect(id).toEqual('1')
  })
})

describe('getFieldsToIndex', () => {
  let util
  let restoreEnv
  let mockGetFieldsToIndex
  const config = global.config

  beforeEach(() => {
    jest.resetModules()
    restoreEnv = mockedEnv(defaultEnvironment)
  })
  afterEach(() => restoreEnv())

  test('configuration detected from environment variables', () => {
    const mockConfig = config()
    expect(mockConfig).toMatchSnapshot()
  })

  test('return empty list', () => {
    util = require('../src/util')
    mockGetFieldsToIndex = util.getFieldsToIndex()
    expect(mockGetFieldsToIndex).toMatchObject([])
  })

  test('return list with one field', () => {
    restoreEnv = mockedEnv({
      ...defaultEnvironment,
      MEILISEARCH_FIELDS_TO_INDEX: 'field',
    })
    util = require('../src/util')
    mockGetFieldsToIndex = util.getFieldsToIndex()
    expect(mockGetFieldsToIndex).toMatchObject(['field'])
  })

  test('return list with multiple fields', () => {
    restoreEnv = mockedEnv({
      ...defaultEnvironment,
      MEILISEARCH_FIELDS_TO_INDEX: 'field1,field2,field3',
    })
    util = require('../src/util')
    mockGetFieldsToIndex = util.getFieldsToIndex()
    expect(mockGetFieldsToIndex).toMatchObject(['field1', 'field2', 'field3'])
  })

  test('return list with multiple fields and spaces', () => {
    restoreEnv = mockedEnv({
      ...defaultEnvironment,
      MEILISEARCH_FIELDS_TO_INDEX: 'field1, field2,  field3',
    })
    util = require('../src/util')
    mockGetFieldsToIndex = util.getFieldsToIndex()
    expect(mockGetFieldsToIndex).toMatchObject(['field1', 'field2', 'field3'])
  })

  test('return list of fiels with underscore', () => {
    restoreEnv = mockedEnv({
      ...defaultEnvironment,
      MEILISEARCH_FIELDS_TO_INDEX: 'field_1,field_2,field_3',
    })
    util = require('../src/util')
    mockGetFieldsToIndex = util.getFieldsToIndex()
    expect(mockGetFieldsToIndex).toMatchObject([
      'field_1',
      'field_2',
      'field_3',
    ])
  })
})
