import { DetectLabelsCommand } from '@aws-sdk/client-rekognition';
import { RekognitionClient } from '@aws-sdk/client-rekognition';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';

const REGION = 'us-east-1';

export const handler = async (event) => {
  // TODO implement
  const rekognition = new RekognitionClient({ region: REGION });
  const dynamo = new DynamoDBClient({ region: REGION });

  const params = {
    Image: {
      S3Object: {
        Bucket: 'image-tagger-term-project',
        Name: event.Records[0].s3.object.key,
      },
    },
    MaxLabels: 10,
    MinConfidnce: 70,
  };

  const command = new DetectLabelsCommand(params);
  const data = await rekognition.send(command);

  const dynamoParams = {
    TableName: 'ImageTags',
    Item: {
      fileName: { S: event.Records[0].s3.object.key },
      tags: { S: JSON.stringify(data) },
    },
  };

  const response = {
    statusCode: 200,
    body: data,
  };

  try {
    const dynamoData = await dynamo.send(new PutItemCommand(dynamoParams));
    response.body = dynamoData;
  } catch (err) {
    response.body = err;
  }

  return response;
};
