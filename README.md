# ImageTagger
This application allows users to upload, store, search for and tag images automatically using AI powered by Amazon Rekognition. To do this I built an API using Node.js and Express that utilized many AWS cloud services (EC2, Lambda, S3, Rekognition, CloudFront) and created the front-end using React.

## Architecture
![Architecture Image](https://github.com/hughthomson/ImageTagger/assets/34608707/475678d5-4171-432e-a474-b487107694e3)

As you can see in the diagram, the uploaded images are stored in an S3 bucket and retrieved through CloudFront. When an image is uploaded to the S3 bucket a Lambda function is triggered to tag the images using Amazon Rekognition. I coded this lambda function using JavaScript because that's what my back-end was already created in. These tags are then stored in a DynamoDB table. I deployed my front-end and back-end on the same EC2 instance and set these up manually. To create my front-end and back-end I used React and Node.js with Express.

