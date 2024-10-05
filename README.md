# AWS Serverless Event-Driven Architecture

![Alt text for the image](https://github.com/user-attachments/assets/6c5e27ba-9d44-4467-ba5c-b8027967d304)

This repository provides an example implementation of an **event-driven serverless architecture** using AWS services like **EventBridge**, **SQS**, **Lambda**, and **DynamoDB**. This architecture is suitable for creating asynchronous processing systems, decoupling components, scaling workloads, and ensuring reliable data handling.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Use Cases](#use-cases)
- [AWS Services Used](#aws-services-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup Instructions](#setup-instructions)
- [Testing the System](#testing-the-system)
- [Related Medium Article](#related-medium-article)
- [License](#license)

## Overview

This project demonstrates how to build a serverless architecture to handle events using AWS-managed services. By leveraging **EventBridge** for triggering, **SQS** for message queuing, **Lambda** for processing, and **DynamoDB** for data storage, we create a decoupled and scalable event-driven system.

The architecture supports:

- **Asynchronous Job Execution**
- **System Monitoring and Logging**
- **Data Collection and Management**

## Architecture

The following AWS services form the core of this serverless architecture:

1. **Amazon EventBridge**: Used for event scheduling and triggering Lambda or sending messages to SQS.
2. **Amazon SQS**: Queues messages to ensure reliable and scalable communication between components.
3. **AWS Lambda**: Processes incoming events, performs transformations, and stores data in DynamoDB.
4. **Amazon DynamoDB**: Stores the processed data for easy querying and retrieval.

### High-Level Diagram

Below is a high-level flow of the architecture:

1. **EventBridge** triggers based on a schedule (e.g., every minute).
2. **SQS** buffers messages from EventBridge.
3. **Lambda** reads messages from SQS, processes them, and stores the data in **DynamoDB**.

## Use Cases

- **Asynchronous Job Execution**: Automate periodic tasks such as batch processing or data aggregation every minute.
- **System Monitoring**: Log system status data in DynamoDB for historical analysis and performance monitoring.
- **Data Collection**: Collect and temporarily store data in SQS, then process it with Lambda and store it in DynamoDB.

## AWS Services Used

- **Amazon EventBridge**: Event-based triggers.
- **Amazon SQS**: Message queuing for load balancing.
- **AWS Lambda**: Serverless compute for data processing.
- **Amazon DynamoDB**: NoSQL database for storing processed data.

## Getting Started

### Prerequisites

To deploy and run this project, you'll need:

- An **AWS Account**.
- **AWS CLI** configured with proper permissions.
- **Node.js** installed (for writing and editing Lambda functions).

### Setup Instructions

1. **Setting Up EventBridge Rule**

   - Go to the **Amazon EventBridge** console.
   - Create a new rule with a schedule, e.g., `rate(1 minute)`.
   - Set **Lambda function** as the target (Lambda will be created in a later step).

2. **Create an SQS Queue**

   - Navigate to **Amazon SQS** in the AWS console.
   - Create a new **Standard Queue** or **FIFO Queue** if message ordering is needed.

3. **Create a DynamoDB Table**

   - Go to the **DynamoDB** console.
   - Create a new table with the name **LambdaTriggeredEvents** and set **id** as the partition key.

4. **Set Up the Lambda Function**

   - Navigate to the **AWS Lambda** console.
   - Create a new Lambda function and select **Node.js** as the runtime.
   - Use the provided code to process SQS messages and store them in DynamoDB:

     ```typescript
     import { DynamoDB } from "aws-sdk";

     const dynamoDb = new DynamoDB.DocumentClient();
     import { Context } from "aws-lambda";

     export const handler = async (
       event: any,
       context: Context
     ): Promise<void> => {
       const currentTimestamp = new Date().toISOString();
       console.log(`Lambda triggered at: ${currentTimestamp}`);

       const params = {
         TableName: process.env.TABLE_NAME || "LambdaTriggeredEvents",
         Item: {
           id: context.awsRequestId,
           timestamp: currentTimestamp,
           message: "Lambda function triggered",
         },
       };

       try {
         await dynamoDb.put(params).promise();
         console.log(
           `Item inserted successfully with ID: ${context.awsRequestId}`
         );
       } catch (error) {
         console.error("Error inserting item into DynamoDB:", error);
       }
     };
     ```

   - Set the **Environment Variable** `TABLE_NAME` to `LambdaTriggeredEvents`.
   - Configure **SQS** as a trigger for the Lambda function.

5. **Deploy and Test**

   - Ensure that EventBridge triggers the Lambda function based on the schedule.
   - Verify the data in DynamoDB.
   - Use **CloudWatch Logs** to monitor Lambda execution.

## Related Medium Article

For a more detailed explanation and insights about building event-driven serverless systems with AWS, check out our Medium article: [Building a Serverless Event-Driven System with AWS EventBridge, SQS, Lambda, and DynamoDB](https://medium.com/@daiki01240/serverless-architecture-building-a-system-using-eventbridge-sqs-lambda-and-dynamodb-234f2a250d13) (replace this link with your actual Medium article URL).

The article walks through the motivations behind serverless architectures, practical use cases, and a step-by-step guide on setting up this architecture.
