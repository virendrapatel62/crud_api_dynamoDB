const express = require("express");
const { createTable, studentTableName, dynamodb } = require("./dynamodb");
const AWS = require("aws-sdk");
const { v1: uuid } = require("uuid");
// creating table students

createTable();

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server running at 3000 PORT");
  console.log("---------------------------------");
  console.log("get    - /api/users");
  console.log("post   - /api/users");
  console.log("put    - /api/users/user_id");
  console.log("delete - /api/users/user_id");
  console.log("----------------------------------");
});

// get All users
app.get("/api/users", (request, response) => {
  dynamodb
    .scan({
      TableName: studentTableName,
    })
    .promise()
    .then((data) => (data.Items ? data.Items : []))
    .then((items) =>
      items.map((userDynamoObject) =>
        AWS.DynamoDB.Converter.unmarshall(userDynamoObject)
      )
    )
    .then((users) => response.json(users))
    .catch((error) => response.status(500).json(error));
});

// create a users
app.post("/api/users", (request, response) => {
  const { email, password, name } = request.body;

  if (!email) return response.status(400).json({ message: "email required" });

  if (!password)
    return response.status(400).json({ message: "password required" });

  if (!name) return response.status(400).json({ message: "name required" });

  const body = { ...request.body, id: uuid() };
  dynamodb
    .putItem({
      TableName: studentTableName,
      ReturnConsumedCapacity: "TOTAL",
      Item: AWS.DynamoDB.Converter.marshall(body),
    })
    .promise()
    .then((data) => response.json({ ...data, user: { ...body } }))
    .catch((error) => response.status(500).json(error));
});

// update a users
app.put("/api/users/:id", (request, response) => {
  const { email, password, name } = request.body;
  const { id } = request.params;

  if (!email) return response.status(400).json({ message: "email required" });

  if (!password)
    return response.status(400).json({ message: "password required" });

  if (!name) return response.status(400).json({ message: "name required" });

  const body = { ...request.body, id: id };
  dynamodb
    .putItem({
      TableName: studentTableName,
      ReturnConsumedCapacity: "TOTAL",
      Item: AWS.DynamoDB.Converter.marshall(body),
    })
    .promise()
    .then((data) => response.json({ ...data, user: { ...body } }))
    .catch((error) => response.status(500).json(error));
});

// delete users
app.delete("/api/users/:key", (request, response) => {
  const { key } = request.params;
  dynamodb
    .deleteItem({
      TableName: studentTableName,
      Key: AWS.DynamoDB.Converter.marshall({ id: key }),
    })
    .promise()
    .then((data) => response.json(data))
    .catch((error) => response.status(500).json(error));
});
