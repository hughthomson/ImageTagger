import './CredentialFormatter.css';
import React, { useState } from 'react';

function CredentialFormatter() {
  const [credentials, setCredentials] = useState('');
  const [formattedCred, setFormattedCred] = useState({
    awsAccessKey: '',
    awsSecretAccessKey: '',
    awsSecretToken: '',
  });

  function formatForPlatform(platform) {
    if (platform === 'node') {
      return (
        "accessKeyId: '" +
        formattedCred.awsAccessKey +
        "',\n" +
        "secretAccessKey: '" +
        formattedCred.awsSecretAccessKey +
        "',\n" +
        "sessionToken: '" +
        formattedCred.awsSecretToken +
        "',\n" +
        "region: 'us-east-1'"
      );
    } else if ('flask') {
      return (
        "aws_access_key_id='" +
        formattedCred.awsAccessKey +
        "',\n" +
        "aws_secret_access_key='" +
        formattedCred.awsSecretAccessKey +
        "',\n" +
        "aws_session_token='" +
        formattedCred.awsSecretToken +
        "',\n" +
        "region_name='us-east-1'"
      );
    }
  }

  return (
    <div className='credentialFormatter'>
      <h3>Format Credentials</h3>
      <div className='formatter'>
        <textarea
          name='credentialsInput'
          id='credentialsInputID'
          className='primary'
          cols='30'
          rows='10'
          placeholder='Paste AWS Academy credentials here'
          value={credentials}
          onChange={(e) => {
            setCredentials(e.target.value);
          }}
        ></textarea>
        <br />
        <button
          className='primary'
          id='formatBtn'
          onClick={() => {
            let tempCreds = JSON.parse(JSON.stringify(formattedCred));
            let splitCredentials = credentials.split('\n');

            splitCredentials.forEach((cred) => {
              let credToken = cred.split('=');

              if (credToken[0] === 'aws_access_key_id') {
                tempCreds.awsAccessKey = credToken[1];
              } else if (credToken[0] === 'aws_secret_access_key') {
                tempCreds.awsSecretAccessKey = credToken[1];
              } else if (credToken[0] === 'aws_session_token') {
                tempCreds.awsSecretToken = credToken[1];
              }
            });
            console.log(tempCreds);
            setFormattedCred(tempCreds);
          }}
        >
          Format
        </button>
        <br />
        <div className='outputs'>
          <div className='outputContianer'>
            <p>Node</p>
            <div
              className='credentialsOutput'
              onClick={() => {
                navigator.clipboard.writeText(formatForPlatform('node'));
              }}
            >
              {"accessKeyId: '" + formattedCred.awsAccessKey + "',"}
              <br></br>
              {"secretAccessKey: '" + formattedCred.awsSecretAccessKey + "',"}
              <br></br>
              {"sessionToken: '" + formattedCred.awsSecretToken + "',"}
              <br></br>
              {"region: 'us-east-1'"}
            </div>
          </div>
          <div className='outputContianer'>
            <p>Flask (boto3)</p>
            <div
              className='credentialsOutput'
              onClick={() => {
                navigator.clipboard.writeText(formatForPlatform('flask'));
              }}
            >
              {"aws_access_key_id='" + formattedCred.awsAccessKey + "',"}
              <br></br>
              {"aws_secret_access_key='" +
                formattedCred.awsSecretAccessKey +
                "',"}
              <br></br>
              {"aws_session_token='" + formattedCred.awsSecretToken + "',"}
              <br></br>
              {"region_name='us-east-1'"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CredentialFormatter;
