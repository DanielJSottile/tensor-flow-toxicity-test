const toxicity = require('@tensorflow-models/toxicity');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.json('OK');
});

app.get('/send', (req, res) => {

  const {sentence} = req.query;
  const threshold = 0.85;

  if(!sentence){
    return res.status(400).json({error: 'sentence must exist'});
  }

  if(sentence && sentence.length > 1){

    toxicity.load(threshold).then(model => {
    

      model.classify(sentence).then(predictions => {

        let tox = false;
        let rep = false;
        let i = 0;
        while (!tox && i < predictions.length -1){
          if ([null, true].includes(predictions[i].results[0].match)){
            tox = true;
          } 
          if (predictions[i].results[0].probabilities['1'] > .02){
            rep = true;
          }
          i++;
        }

        res.json({toxic: tox, report: rep, prediction: predictions});
      });
    });
  }
});

module.exports = app;

// current problems: it's been fed it's data poorly
// we can either 1: feed some new data to it to help it 
// or 2: we can have users report out of place and send it back
// to the model.  I think a combination of 1 & 2 will work best

