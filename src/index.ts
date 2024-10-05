import { DynamoDB } from "aws-sdk";

const dynamoDb = new DynamoDB.DocumentClient();
import { Context } from "aws-lambda";

export const handler = async (event: any, context: Context): Promise<void> => {
  const currentTimestamp = new Date().toISOString();

  console.log(`Lambda triggered at: ${currentTimestamp}`);

  const tableName = process.env.TABLE_NAME || "defaultTableName"; // Ensure a default table name
  const params = {
    TableName: tableName,
    Item: {
      id: context.awsRequestId,
      timestamp: currentTimestamp,
      message: "someMessage",
    },
  };

  try {
    await dynamoDb.put(params).promise();
    console.log(`Item inserted successfully with ID: ${context.awsRequestId}`);
  } catch (error) {
    console.error("Error inserting item into DynamoDB:", error);
  }
};
