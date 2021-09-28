import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import { getChangeType, ChangeType, getDocumentId } from '../src/util'

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

    expect(changeType === ChangeType.CREATE).toBeTruthy()
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

    expect(changeType === ChangeType.UPDATE).toBeTruthy()
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

    expect(changeType === ChangeType.DELETE).toBeTruthy()
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

    expect(id === '2').toBeTruthy()
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

    expect(id === '2').toBeTruthy()
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

    expect(id === '1').toBeTruthy()
  })
})
