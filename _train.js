const eqArr = require('shallow-equal/arrays')
const csvdata = require('csvdata')
const dialogflow = require('dialogflow')

const createIntent = (projectId, intentName, phrases) => {
  const contextsClient = new dialogflow.ContextsClient()
  const intentsClient = new dialogflow.IntentsClient()

  const agentPath = intentsClient.projectAgentPath(projectId)

  const outputContexts = [
    {
      name: contextsClient.contextPath(
        projectId,
        '*',
        intentName
      ),
      lifespanCount: 5
    }
  ]

  const result = {
    action: 'none',
    parameters: [],
    messages: [],
    outputContexts
  }
  console.log('Phrases', phrases)
  const trainingPhrases = phrases.filter(_ => _.length < 768) // -FIXME
    .map(text => {
      return {
        type: 'TYPE_EXAMPLE',
        parts: [{text}]
      }
    })

  const intent = {
    displayName: intentName,
    events: [],
    webhookState: 'WEBHOOK_STATE_DISABLED',
    trainingPhrases,
    mlEnabled: true,
    priority: 500000,
    result
  }

  const request = {
    parent: agentPath,
    intent
  }

  intentsClient
    .createIntent(request)
    .then(() => console.log(`Created intent ${intentName}`))
    .catch(err => console.error(`Error: ${err}`))
}

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

  console.log('Create Intents')
  const trainingSet = Object.values(output)
  const intents = [...new Set(trainingSet.map(_ => _.intention))].sort((a, b) => a - b)

  intents.forEach(id => {
    const phrases = trainingSet.filter(_ => _.intention === id).map(_ => _.question)
    createIntent('posos-fe257', `pipo-${id}`, phrases)
  })
})

console.log(
  accuracy([[1, 1], [2, 1], [3, 3]], [[1, 1], [2, 1], [3, 3]])
)
