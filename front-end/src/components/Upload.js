import React, { useEffect, useState } from 'react';
import Thumbnail from './Thumbnail';
import './Upload.css';
import '../common/circle-x-filled.svg';

import { Oval } from 'react-loader-spinner';

function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [filesUploaded, setFilesUploaded] = useState(0);

  useEffect(() => {
    if (files.length > 0) {
      console.log(files);
    }

    // if (filesUploaded > 0) {
    //   console.log(filesUploaded);
    // }
  });

  function getImageBlob(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  }

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  async function uploadImage(image, filename, type, size) {
    await fetch(process.env.REACT_APP_SERVER_BASE + '/upload', {
      method: 'POST',
      body: JSON.stringify({
        blob: image,
        filename: filename,
      }),
      headers: {
        'content-type': type,
        'content-length': `${size}`,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log('Success:', result ? result : {});
        setFilesUploaded(filesUploaded + 1);
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('there was an error uploading your files');
      });
  }

  function sendEmailNotification(subject, message) {
    fetch(process.env.REACT_APP_SERVER_BASE + '/sendEmailNotification', {
      method: 'POST',
      body: JSON.stringify({ subject: subject, message: message }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className='upload'>
      <h3>Upload Images</h3>
      {files.length === 0 && !uploading ? (
        <input
          type='file'
          accept='image/jpeg, image/png'
          onChange={(e) => {
            const newFiles = e.target.files;
            setFiles(newFiles);
          }}
          multiple
        />
      ) : (
        ''
      )}
      {files.length > 0 && !uploading ? (
        <div className='image-container'>
          <div className='wrapper'>
            {Array.from(files).map((image, index) => {
              return (
                <Thumbnail
                  src={URL.createObjectURL(image)}
                  size={200}
                  key={index}
                />
              );
            })}
          </div>
          <button
            className='primary upload-btn'
            onClick={async () => {
              setUploading(true);
              setFilesUploaded(0);

              for (let i = 0; i < files.length; i++) {
                const image = await getImageBlob(files[i]);
                const filename = files[i].name;
                const type = files[i].type;
                const size = files[i].size;
                await uploadImage(image, filename, type, size);
                setFilesUploaded(i + 1);
              }

              let subject = 'New image uploaded!';
              const message =
                'Go check it out at ' + process.env.REACT_APP_PUBLIC_URL;

              if (files.length > 1) {
                subject = files.length + ' new images uploaded!';
              }
              sendEmailNotification(subject, message);

              await delay(500);
              setUploading(false);
              setFiles([]);
            }}
          >
            Upload
          </button>
          <button
            className='danger cancel-btn'
            onClick={() => {
              setFiles([]);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        ''
      )}
      {uploading ? (
        <div className='uploading-container'>
          <Oval
            height={30}
            width={30}
            color='#0052cc'
            wrapperClass=''
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor='#0065ff'
            strokeWidth={4}
            strokeWidthSecondary={4}
          />
          <p>
            <b>
              Uploading to S3... {filesUploaded}/{files.length}
            </b>
          </p>
        </div>
      ) : (
        ''
      )}
    </div>
  );
}

export default Upload;
