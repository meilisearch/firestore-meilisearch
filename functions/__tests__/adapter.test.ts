import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import { mockConsoleInfo } from './__mocks__/console'
import { firestore } from 'firebase-admin/lib/firestore'
import { adaptDocument, adaptValues } from '../src/adapter'
import defaultDocument from './data/document'

// Mocking of Firebase functions
const firebaseMock = firebaseFunctionsTestInit()

describe('extensions process', () => {
  describe('adaptDocument', () => {
    test('adaptDocument with fields not set', () => {
      const snapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument.document,
        `docs/${defaultDocument.id}`
      )

      expect(adaptDocument(defaultDocument.id, snapshot, '')).toStrictEqual({
        _firestore_id: defaultDocument.id,
        ...defaultDocument.document,
      })
    })

    test('adaptDocument with fields not set and with id field in document', () => {
      const snapshot = firebaseMock.firestore.makeDocumentSnapshot(
        { id: '12345', ...defaultDocument.document },
        `docs/${defaultDocument.id}`
      )

      expect(adaptDocument(defaultDocument.id, snapshot, '')).toStrictEqual({
        _firestore_id: defaultDocument.id,
        id: '12345',
        ...defaultDocument.document,
      })
    })

    test('adaptDocument with fields set', () => {
      const snapshot = firebaseMock.firestore.makeDocumentSnapshot(
        defaultDocument.document,
        `docs/${defaultDocument.id}`
      )

      expect(
        adaptDocument(
          defaultDocument.id,
          snapshot,
          'title,overview,release_date'
        )
      ).toStrictEqual({
        _firestore_id: defaultDocument.id,
        title: defaultDocument.document.title,
        overview: defaultDocument.document.overview,
        release_date: defaultDocument.document.release_date,
      })
    })
  })

  describe('adaptValues', () => {
    test('adaptValues an id value', () => {
      expect(adaptValues('id', defaultDocument.id as any)).toStrictEqual([
        'id',
        defaultDocument.id,
      ])
    })
    test('adaptValues a geo point value', () => {
      const geoPoint = new firestore.GeoPoint(48.866667, 2.333333)

      expect(adaptValues('_geo', geoPoint)).toStrictEqual([
        '_geo',
        {
          lat: 48.866667,
          lng: 2.333333,
        },
      ])
      expect(mockConsoleInfo).toBeCalledWith(
        `A GeoPoint was found with the field name '_geo' for compatibility with Meilisearch the field 'latitude' was renamed to 'lat' and the field 'longitude' to 'lng'`
      )
    })
    test('adaptValues a wrong geo point value', () => {
      const geoPoint = new firestore.GeoPoint(48.866667, 2.333333)

      expect(adaptValues('wrong_geo', geoPoint)).toStrictEqual([
        'wrong_geo',
        geoPoint,
      ])
      expect(mockConsoleInfo).toBeCalledWith(
        `A GeoPoint was found without the field name '_geo' if you want to use the geoSearch with Meilisearch rename it to '_geo'`
      )
    })
  })
})
