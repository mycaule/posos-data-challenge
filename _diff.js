const csvdata = require('csvdata')

Promise.all([
  csvdata.load('./output_test.csv', {
    delimiter: ';'
  }).then(input => input.map(_ => _.ID)),
  csvdata.load('./dataset/input_test.csv', {
    delimiter: ';'
  }).then(input => input.map(_ => _.ID))
]).then(values => {
  const output = values[0]
  const input = values[1]

  console.log(
    input.filter(_ => !output.find($ => _ === $))
  )
})
