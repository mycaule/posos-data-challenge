const dialogflow = require('dialogflow')
const csvdata = require('csvdata')

const structjson = require('./structjson.js')

const detectIntent = (projectId, sessionId, queries = []) => {
  const detectOne = () => {
    const sessionClient = new dialogflow.SessionsClient()
    const sessionPath = sessionClient.sessionPath(projectId, sessionId)

    let promise

    for (const query of queries) {
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: query.question,
            languageCode: 'fr-FR'
          }
        }
      }

      if (promise) {
        promise = promise.then(responses => {
          const response = (responses && responses.length > 0) ? responses[0] : undefined

          if (response) {
            const result = response.queryResult
            if (result.intent) {
              console.log(`${query.ID};${parseInt(result.intent.displayName.replace('pipo-', ''), 10)}`)
            } else {
              console.log(`${query.ID};${1}`)
            }

            response.queryResult.outputContexts.forEach(context => {
              context.parameters = structjson.jsonToStructProto(
                structjson.structProtoToJson(context.parameters)
              )
            })
            request.queryParams = {
              contexts: response.queryResult.outputContexts
            }
          } else {
            console.log(`${query.ID};${1}`)
          }

          return sessionClient.detectIntent(request)
        }).catch(err => console.log(`Error ${err}`))
      } else {
        promise = sessionClient.detectIntent(request)
      }
    }
  }
  detectOne()
}

csvdata.load('./dataset/input_test.csv', {
  delimiter: ';'
}).then(input => {
  const throttledQueue = require('throttled-queue')
  const throttle = throttledQueue(1, 60 * 1000)

  const inputs = input.reduce((ar, it, i) => {
    const ix = Math.floor(i / 180)

    if (!ar[ix]) {
      ar[ix] = []
    }

    ar[ix].push(it)

    return ar
  }, [])

  inputs.forEach(ipt => {
    throttle(() => {
      detectIntent('posos-fe257', '123', ipt)
    })
  })
})
