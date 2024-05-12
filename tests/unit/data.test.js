/* eslint-disable no-undef */
const DataMock = require('./data.mock')
const DataManager = require('../../managers/dataManager')

describe('Spread', () => {
  const dataMock = new DataMock();
  test.each(dataMock.isObject())('Check isObject: %s', (testName, item) => {
    const result = DataManager.isObject(item.arrayData);
    expect(result).toStrictEqual(item.output);
  });

  test.each(dataMock.createJson())('Check createJson: %s', (testName, item) => {
    const result = DataManager.createJson(item.arrayData);
    expect(result).toStrictEqual(item.output);
  });

  test.each(dataMock.createMap())('Check createMap: %s', (testName, item) => {
    const result = DataManager.createMap(item.arrayData, item.primaryKey);
    expect(result).toStrictEqual(item.output);
  });

  test.each(dataMock.createMatrix())('Check createMatrix: %s', (testName, item) => {
    const result = DataManager.createMatrix(item.data);
    expect(result).toStrictEqual(item.output);
  });
})