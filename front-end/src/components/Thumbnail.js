import React, { useRef, useEffect } from 'react';
import './Thumbnail.css';

function Thumbnail(props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;
    const image = new Image();
    image.src = props.src;

    image.onload = () => {
      if (image.width > image.height) {
        context.drawImage(
          image,
          (image.width - image.height) / 2,
          0,
          image.height,
          image.height,
          0,
          0,
          props.size,
          props.size
        );
      } else {
        context.drawImage(
          image,
          0,
          (image.height - image.width) / 2,
          image.width,
          image.width,
          0,
          0,
          props.size,
          props.size
        );
      }
    };
  });

  return (
    <div className='thumb-container'>
      <div className='thumb-title'>
        <p>{props.name}</p>
      </div>
      <canvas
        ref={canvasRef}
        className='thumbnail'
        height={props.size}
        width={props.size}
        draggable
      />
    </div>
  );
}

export default Thumbnail;
