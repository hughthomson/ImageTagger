import React, { useEffect, useState } from 'react';
import Thumbnail from './Thumbnail';
import TaggedImageModal from './TaggedImageModal';
import './Images.css';

function Images() {
  const [files, setFiles] = useState([]);
  const [imageTags, setImageTags] = useState(new Map());
  const [modalActive, setModalActive] = useState(false);
  const [activeModalID, setActiveModalID] = useState(null);
  const [tagFilter, setTagFilter] = useState('');
  useEffect(() => {
    async function fetchData() {
      await getImages().then(() => {
        getImageTags();
      });
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function fetchData() {
      await getImageTags();
    }
    fetchData();
  }, [files]);

  async function getImages() {
    await fetch(process.env.REACT_APP_SERVER_BASE + '/getFilenames', {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((result) => {
        setFiles(result.files);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  async function getImageTags() {
    await files?.forEach(async (filename) => {
      if (!imageTags.has(filename)) {
        await fetch(process.env.REACT_APP_SERVER_BASE + '/getImageTags', {
          method: 'POST',
          body: JSON.stringify({ file: filename }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((result) => {
            const labels = result?.Item?.tags?.S;
            let tags = [];
            if (labels) {
              tags = JSON.parse(labels).Labels;
            }

            setImageTags(
              new Map(
                JSON.parse(
                  JSON.stringify(Array.from(imageTags.set(filename, tags)))
                )
              )
            );
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    });
  }

  return (
    <div className='images'>
      <input
        className='primary search'
        placeholder='Search by tag...'
        onChange={(e) => {
          setTagFilter(e.target.value);
        }}
      />
      {modalActive ? (
        <TaggedImageModal
          filename={activeModalID}
          tags={imageTags.get(activeModalID)}
          getImages={() => {
            getImages();
          }}
          close={() => {
            setModalActive(false);
          }}
        />
      ) : (
        <></>
      )}

      <div className='image-container'>
        {files?.map((filename, index) => {
          const tags = imageTags.get(filename);
          if (tagFilter !== '') {
            let found = false;
            for (let i = 0; i < tags.length; i++) {
              if (
                tags[i].Name.toLowerCase().includes(
                  tagFilter.toLocaleLowerCase()
                )
              ) {
                found = true;
              }
            }

            if (!found) {
              return '';
            }
          }
          return (
            <div
              className='taggedImage'
              key={index}
              onClick={() => {
                setActiveModalID(filename);
                setModalActive(true);
              }}
            >
              <Thumbnail
                src={process.env.REACT_APP_CLOUDFRONT_URL + '/' + filename}
                name={tags ? tags[0].Name : 'Defualt'}
                size={200}
                key={index + files.length + 1}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Images;
