class DataMock {
  isObject() {
    return [
      ['null', { arrayData: null, output: false }],
      ['undefined', { arrayData: undefined, output: false }],
      ['empty string', { arrayData: '', output: false }],
      ['object', { arrayData: { name: 'Poor Things' }, output: true }],
      ['array', { arrayData: ['Steven', 'Universe'], output: false }],
    ];
  }

  createJson() {
    return [
      ['null', {arrayData: null, output: []}],
      ['undefined', {arrayData: undefined, output: []}],
      ['empty array', {arrayData: [], output: []}],
      ['values', {
        arrayData: [
          ['NOME', 'IDADE', 'COR'], 
          ['Joana', 20, 'verde'], 
          ['Pedro', 30, 'azul']
        ], 
        output: [
          {'NOME': 'Joana', 'IDADE': 20, 'COR': 'verde'}, 
          {'NOME': 'Pedro', 'IDADE': 30, 'COR': 'azul'}
        ]
      }]
    ]
  }

  createMap() {
    return [
      ['null', {arrayData: null, output: new Map()}],
      ['undefined', {arrayData: undefined, output: new Map()}],
      ['empty array', {arrayData: [], output: new Map()}],
      ['values', {
        arrayData: [
          ['NOME', 'IDADE', 'COR'], 
          ['Joana', 20, 'verde'], 
          ['Pedro', 30, 'azul']
        ], 
        primaryKey: 'NOME',
        output: new Map( [
          ['Joana', {'IDADE': 20, 'COR': 'verde'}], 
          ['Pedro', {'IDADE': 30, 'COR': 'azul'}]
        ])
      }]
    ]
  }

  createMatrix() {
    return [
      ['null', {data: null, output: [[]]}],
      ['undefined', {data: undefined, output: [[]]}],
      ['empty array', {data: [], output: [[]]}],
      ['values from json', {
        data: [
          {'NOME': 'Joana', 'IDADE': 20, 'COR': 'verde'}, 
          {'NOME': 'Pedro', 'IDADE': 30, 'COR': 'azul'}
        ], 
        output: [
          ['NOME', 'IDADE', 'COR'], 
          ['Joana', 20, 'verde'], 
          ['Pedro', 30, 'azul']
        ]
      }
    ]
    ]
  }
}

module.exports = DataMock