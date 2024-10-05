"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const aws_sdk_1 = require("aws-sdk");
const dynamoDb = new aws_sdk_1.DynamoDB.DocumentClient();
const handler = async (event, context) => {
    // 現在の時間を取得
    const currentTimestamp = new Date().toISOString();
    console.log(`Lambda triggered at: ${currentTimestamp}`);
    // DynamoDBなどにタイムスタンプを保存する場合の例
    const tableName = process.env.TABLE_NAME || "defaultTableName"; // Ensure a default table name
    const params = {
        TableName: tableName,
        Item: {
            id: context.awsRequestId,
            timestamp: currentTimestamp,
            message: "someMessage",
        },
    };
    // DynamoDBに保存する例 (この部分にDynamoDBの操作を追加)
    // await dynamoDb.put(params).promise();
    try {
        await dynamoDb.put(params).promise();
        console.log(`Item inserted successfully with ID: ${context.awsRequestId}`);
    }
    catch (error) {
        console.error("Error inserting item into DynamoDB:", error);
    }
};
exports.handler = handler;
