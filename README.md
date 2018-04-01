<p align="center">
  <a href="https://challengedata.ens.fr/en/challenge/33/predict_the_expected_answer.html">Posos Data Challenge</a>
</p>

<p align="center">
  <a href="http://travis-ci.org/mycaule/posos-data-challenge"><img src="https://api.travis-ci.org/mycaule/posos-data-challenge.svg?branch=master" alt="Build Status"></a>
  <br>
  <br>
  Accuracy : 6.96 % :-(
</p>

### Usage

```bash
export GOOGLE_APPLICATION_CREDENIALS=/path/to/service-account.json
npm run _train
npm run _test
```

### Methodology

I retrained Google's Dialogflow model to automatically label the intents for the [testing dataset](/dataset/input_test.csv).

Problems :
Error "User says text length is greater than 768" for intent Œ28, 31, 44, 37, 23, 48, 38, 33, 27, 26, 0, 11, 12, 14, 13, 42

### References

- [Fixing credentials with Dialogflow API and GCP](https://stackoverflow.com/questions/42043611/could-not-load-the-default-credentials-node-js-google-compute-engine-tutorial)
- [Dialogflow sample usecases in Node.js](https://github.com/dialogflow/dialogflow-nodejs-client-v2/blob/master/samples/detect.js)
