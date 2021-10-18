import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import { mocked } from 'ts-jest/utils'
import { mockConsoleInfo } from './__mocks__/console'
import { firestore } from 'firebase-admin/lib/firestore'
import GeoPoint = firestore.GeoPoint

import { processDocument, processValue } from '../src/process'
import { getFieldsToIndex } from '../src/util'

const defaultDocument = {
  id: '0jKUH3XUNXFyujm3rZAa',
  title: 'The Lord of the Rings: The Fellowship of the Ring',
  genre: ['Adventure', 'Fantasy', 'Action'],
  overview:
    'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
  poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
  release_date: 1008633600,
}

jest.mock('../src/util')
const firebaseMock = firebaseFunctionsTestInit()

describe('extensions process', () => {
  describe('processDocument', () => {
    const mockedGetFieldsToIndex = mocked(getFieldsToIndex, true)

    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('processDocument with fields not set', () => {
      mockedGetFieldsToIndex.mockReturnValueOnce([])
      const snapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument,
        'docs/1'
      )
      expect(processDocument(defaultDocument.id, snapshot)).toStrictEqual(
        defaultDocument
      )
    })

    test('processDocument with fields set', () => {
      mockedGetFieldsToIndex.mockReturnValueOnce([
        'title',
        'overview',
        'release_date',
      ])
      const snapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument,
        'docs/1'
      )
      expect(processDocument(defaultDocument.id, snapshot)).toStrictEqual({
        id: defaultDocument.id,
        title: defaultDocument.title,
        overview: defaultDocument.overview,
        release_date: defaultDocument.release_date,
      })
    })
  })

  describe('processValue', () => {
    test('processValue an id value', () => {
      expect(processValue('id', defaultDocument.id as any)).toStrictEqual([
        'id',
        defaultDocument.id,
      ])
    })
    test('processValue a geo point value', () => {
      const geoPoint = new GeoPoint(48.866667, 2.333333)
      expect(processValue('_geo', geoPoint)).toStrictEqual([
        '_geo',
        {
          lat: 48.866667,
          lng: 2.333333,
        },
      ])
      expect(mockConsoleInfo).toBeCalledWith(
        `A GeoPoint was found with the field name '_geo' for compatibility with MeiliSearch the field 'latitude' was renamed to 'lat' and the field 'longitude' to 'lng'`
      )
    })
    test('processValue a wrong geo point value', () => {
      const geoPoint = new GeoPoint(48.866667, 2.333333)
      expect(processValue('wrong_geo', geoPoint)).toStrictEqual([
        'wrong_geo',
        geoPoint,
      ])
      expect(mockConsoleInfo).toBeCalledWith(
        `A GeoPoint was found without the field name '_geo' if you want to use the geoSearch with MeiliSearch rename it to '_geo'`
      )
    })
  })
})
