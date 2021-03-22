require("dotenv").config();

console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.AWS_REGION);

// some constatcns
const TOPIC_ARN = "arn:aws:sns:ap-south-1:316932939765:CreatedFromNodeJs";

var AWS = require("aws-sdk");

var sns = new AWS.SNS();
// console.table(sns.endpoint);

// creating topic
function createTopic(name) {
  sns.createTopic({ Name: name }, (err, data) => {
    console.log({ err });
    console.table(data);
  });
}

function createSubscription() {
  sns.subscribe(
    {
      TopicArn: TOPIC_ARN,
      Protocol: "sms",
      //   Endpoint: "patelvirendra62@gmail.com",
      Endpoint: "+91 8839765802",
    },
    (error, value) => {
      console.log(error);
      console.table(value);
    }
  );
}

function publishMessage() {
  sns.publish(
    {
      Message:
        "lorem ipsum - genered message from node js" + new Date().toUTCString(),
      Subject: new Date().toUTCString(),
      TopicArn: TOPIC_ARN,
    },
    (err, data) => {
      console.log({ err });
      console.table(data);
    }
  );
}

// createTopic("CreatedFromNodeJs");
// publishMessage();
// createSubscription();
