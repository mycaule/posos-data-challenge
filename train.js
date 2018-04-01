const eqArr = require('shallow-equal/arrays')
const csvdata = require('csvdata')

const accuracy = (yTrue, yPred) => {
  const score = yTrue.reduce((acc, cur, i) => eqArr(cur, yPred[i]) ? acc + 1 : acc, 0)
  return score / yTrue.length
}

Promise.all([
  csvdata.load('./dataset/input_train.csv', {
    delimiter: ';',
    objName: 'ID'
  }),
  csvdata.load('./dataset/output_train.csv', {
    delimiter: ';',
    objName: 'ID'
  })
]).then(values => {
  const input = values[0]
  const output = values[1]

  for (let i = 0; i <= 8027; i++) {
    Object.assign(output[i], input[i])
  }
  console.log(Object.values(output))
})

console.log(
  accuracy([[1, 1], [2, 1], [3, 3]], [[1, 1], [2, 1], [3, 3]])
)
