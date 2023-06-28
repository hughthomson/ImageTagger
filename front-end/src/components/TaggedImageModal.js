import React, { useState } from 'react';
import './TaggedImageModal.css';
import { Oval } from 'react-loader-spinner';

function TaggedImageModal(props) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      className='modal-background'
      onClick={(e) => {
        if (e.target.classList.contains('modal-background')) {
          props.close();
        }
      }}
    >
      <div className='tagged-image-modal'>
        <div className='content-container'>
          <div className='image-container'>
            <img
              src={process.env.REACT_APP_CLOUDFRONT_URL + '/' + props.filename}
              alt=''
            />
          </div>
          <div className='properties-container'>
            <p className='property-title'>Tags</p>
            <div className='tag-list'>
              {props.tags.map((tag, index) => {
                return (
                  <div className='tag-item' key={index}>
                    {tag.Name}
                  </div>
                );
              })}
            </div>
            <p className='property-title'>Options</p>
            <div className='option-list'>
              {isDeleting ? (
                <Oval
                  height={30}
                  width={30}
                  color='#0052cc'
                  wrapperStyle={{}}
                  wrapperClass=''
                  visible={true}
                  ariaLabel='oval-loading'
                  secondaryColor='#0065ff'
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />
              ) : (
                <button
                  className='danger delete'
                  onClick={() => {
                    setIsDeleting(true);
                    fetch(process.env.REACT_APP_SERVER_BASE + '/deleteImage', {
                      method: 'POST',
                      body: JSON.stringify({ key: props.filename }),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    })
                      .then((response) => response.json())
                      .then((result) => {
                        setIsDeleting(false);
                        props.close();
                        props.getImages();
                      })
                      .catch((error) => {
                        console.error('Error:', error);
                      });
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          className='danger close'
          onClick={() => {
            props.close();
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default TaggedImageModal;
