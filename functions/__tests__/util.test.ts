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
import { ChangeType, getChangedDocumentId, getChangeType } from '../src/util'
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
  let adapter
  let restoreEnv
  let mockParseFieldsToIndex
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
    adapter = require('../src/meilisearch-adapter')
    mockParseFieldsToIndex = adapter.parseFieldsToIndex()
    expect(mockParseFieldsToIndex).toMatchObject([])
  })

  test('return list with one field', () => {
    adapter = require('../src/meilisearch-adapter')
    mockParseFieldsToIndex = adapter.parseFieldsToIndex('field')
    expect(mockParseFieldsToIndex).toMatchObject(['field'])
  })

  test('return list with multiple fields', () => {
    adapter = require('../src/meilisearch-adapter')
    mockParseFieldsToIndex = adapter.parseFieldsToIndex('field1,field2,field3')
    expect(mockParseFieldsToIndex).toMatchObject(['field1', 'field2', 'field3'])
  })

  test('return list with multiple fields and spaces', () => {
    adapter = require('../src/meilisearch-adapter')
    mockParseFieldsToIndex = adapter.parseFieldsToIndex(
      'field1, field2,  field3'
    )
    expect(mockParseFieldsToIndex).toMatchObject(['field1', 'field2', 'field3'])
  })

  test('return list of fiels with underscore', () => {
    adapter = require('../src/meilisearch-adapter')
    mockParseFieldsToIndex = adapter.parseFieldsToIndex(
      'field_1,field_2,field_3'
    )
    expect(mockParseFieldsToIndex).toMatchObject([
      'field_1',
      'field_2',
      'field_3',
    ])
  })
})
