require("dotenv").config();
const AWS = require("aws-sdk");

console.log(process.env.AWS_ACCESS_KEY_ID);
console.log(process.env.AWS_SECRET_ACCESS_KEY);
console.log(process.env.AWS_REGION);

const dynamodb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
const studentTablename = "users";
console.table(dynamodb.endpoint);

function response(error, data) {
  console.log("at dynamo db.js");
  console.error({ error: "Table Exists" });
  console.table(data);
}

function createTable() {
  dynamodb.createTable(
    {
      TableName: studentTablename,

      Tags: [],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      BillingMode: "PROVISIONED",
      ProvisionedThroughput: {
        ReadCapacityUnits: 1000,
        WriteCapacityUnits: 1000,
      },
    },
    response
  );
}

exports.createTable = createTable;
exports.dynamodb = dynamodb;
exports.studentTableName = studentTablename;
