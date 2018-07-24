const fs = require("fs")
const awsCreds = JSON.parse(fs.readFileSync("aws.json").toString().trim())

const AWS = require('aws-sdk')

var cloudfront = new AWS.CloudFront(new AWS.Config(awsCreds));

var params = {
  DistributionId: 'E3T0251O6REGZU', /* required */
  InvalidationBatch: { /* required */
    CallerReference: ''+(new Date()), /* required */
    Paths: { /* required */
      Quantity: 1, /* required */
      Items: ["/*"]
    }
  }
};
cloudfront.createInvalidation(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
