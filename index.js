const toxicity = require('@tensorflow-models/toxicity');
const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {

  const {sentence} = req.query;
  const threshold = 0.90;

  if(sentence){

    toxicity.load(threshold).then(model => {
    

      model.classify(sentence).then(predictions => {

        // let toxic = false;
        // let i = 0;
        // while (!toxic && i < predictions.length -1){
        //   if ([null, true].includes(predictions[i].results[0].match)){
        //     toxic = true;
        //   }
        //   i++;
        // }

        res.json(predictions);
      });
    });
  }
});

module.exports = app;

// current problems: it's been fed it's data poorly
// we can either 1: feed some new data to it to help it 
// or 2: we can have users report out of place and send it back
// to the model.  I think a combination of 1 & 2 will work best

