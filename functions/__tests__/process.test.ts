import * as firebaseFunctionsTestInit from 'firebase-functions-test'
import { mocked } from 'ts-jest/utils'
import { mockConsoleInfo } from './__mocks__/console'
import { firestore } from 'firebase-admin/lib/firestore'
import GeoPoint = firestore.GeoPoint

import { processDocument, processValue } from '../src/process'
import { getFieldsToIndex } from '../src/util'
import defaultDocument from './data/document'

jest.mock('../src/util')

// Mocking of Firebase functions
const firebaseMock = firebaseFunctionsTestInit()

describe('extensions process', () => {
  describe('processDocument', () => {
    const mockedGetFieldsToIndex = mocked(getFieldsToIndex, true)

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
