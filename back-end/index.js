const express = require('express');
const app = express();
var cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const {
  S3Client,
  PutObjectCommand,
  ListBucketsCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} = require('@aws-sdk/client-s3');

const { DynamoDBClient, GetItemCommand } = require('@aws-sdk/client-dynamodb');

const {
  SubscribeCommand,
  PublishCommand,
  SNSClient,
} = require('@aws-sdk/client-sns');
require('dotenv').config();
const port = process.env.PORT || 8080;

const awsCreds = {
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'ASIA4G4JGMPNK7GUJXST',
    secretAccessKey: 'lYPRT1qzR4WcxpgzhaO8Q33fv/gCHCk4Qrl39p6m',
    sessionToken:
      'FwoGZXIvYXdzEIz//////////wEaDHw85aTsSjpSNp/OrSLAAYEzBg/nAQ2G+GACHw9H5UQz9cjSVXF8jzwbngUImV9TqDLomTC/AaJltEOGPtVazr8sj173g+WlcDmxjM+WBZ1IxdSEKA9iMaxzVsKWZSrvfokW3sR6mkPAtw89uxq9sxSZRkQyxgwE+BXynn3XW1hDRrVu5kS1kZXTp720DtV4hKb2wNgZ1Z+e2rICucDwqcrA55plF3ZUx5kstkhbP9HVSMcDb2hO2wJbovRp4lEeLXmvgY0ApOimbfRCUZJ6NCiE6MahBjIt3ckLrIqIQGpXLOk3S2DVDJ9WBcyRS/vSD0AXP0ZPJxJnwR8DZ5fX5W0SWkj9',
  },
};

const s3 = new S3Client(awsCreds);
const dynamo = new DynamoDBClient(awsCreds);
const sns = new SNSClient(awsCreds);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
bodyParser.json({ limit: '50mb' });

app.get('/', (req, res) => {
  res.json({ message: process.env.S3_BUCKET });
});

app.get('/getBuckets', async (req, res) => {
  try {
    const data = await s3.send(new ListBucketsCommand({}));
    res.json({ data: data });
  } catch (err) {
    // console.log(err);
  }
});

app.get('/getFilenames', async (req, res) => {
  const command = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET,
    MaxKeys: 1000,
  });

  try {
    let isTruncated = true;
    let contents = { files: [] };
    while (isTruncated) {
      const { Contents, IsTruncated, NextContinuationToken } = await s3.send(
        command
      );
      for (i in Contents) {
        // console.log(Contents[i]);
        contents.files.push(Contents[i].Key);
      }
      isTruncated = IsTruncated;
      command.input.ContinuationToken = NextContinuationToken;
    }
    res.json(contents);
  } catch (err) {
    res.json(err);
  }
});

app.post('/deleteImage', async (req, res) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: req.body.key,
  };

  try {
    const data = await s3.send(new DeleteObjectCommand(params));
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json('Internal server error');
  }
});

app.post('/getImageTags', async (req, res) => {
  const params = {
    TableName: 'ImageTags',
    Key: {
      fileName: { S: req.body.file },
    },
    ProjectionExpression: 'tags',
  };

  try {
    const response = await dynamo.send(new GetItemCommand(params));
    // console.log('Success', response.Item);
    res.json(response);
  } catch (e) {
    console.log(e);
    res.json({ error: 'Not found' });
  }
});

app.post(
  '/upload',
  bodyParser.raw({ type: ['image/jpeg', 'image/png'], limit: '5mb' }),
  async (req, res) => {
    const data = JSON.parse(req.body);
    const imageBlob = data.blob;
    const filename = data.filename;
    console.log(imageBlob.split(',')[0]);
    const image = Buffer.from(imageBlob.split(',')[1], 'base64');
    const isJpeg =
      filename.slice(filename.length - 4, filename.length) === '.jpg';
    if (!image) {
      res.json('No image provided');
    } else {
      const uploadParams = {
        Bucket: process.env.S3_BUCKET,
        Key: uuidv4() + filename.slice(filename.length - 4, filename.length),
        Body: image,
        ContentType: isJpeg ? 'image/jpeg' : 'image/png',
      };
      try {
        const data = await s3.send(new PutObjectCommand(uploadParams));
        res.json(data);
      } catch (err) {
        res.json('Internal server error');
      }
    }
  }
);

app.post('/sendEmailNotification', async (req, res) => {
  const params = {
    Subject: req.body.subject,
    Message: req.body.message,
    TopicArn: 'arn:aws:sns:us-east-1:839416964058:ImageLinkShare',
  };

  try {
    const data = await sns.send(new PublishCommand(params));
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json('internal server error');
  }
});

app.post('/subscribeEmail', async (req, res) => {
  const params = {
    Protocol: 'email',
    TopicArn: 'arn:aws:sns:us-east-1:839416964058:ImageLinkShare',
    Endpoint: req.body.email,
  };

  try {
    const data = await sns.send(new SubscribeCommand(params));
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json('internal server error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
