import './Subscribe.css';
import React, { useState } from 'react';
import { Oval } from 'react-loader-spinner';

function Subscribe() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  async function sendConfirmationEmail() {
    setSending(true);
    await fetch(process.env.REACT_APP_SERVER_BASE + '/subscribeEmail', {
      method: 'POST',
      body: JSON.stringify({ email: email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setSent(true);
      })
      .catch((error) => {
        console.error('Error:', error);
        setSent(false);
        setSending(false);
        alert('Error sending confirmation email');
      });
  }

  function renderSending() {
    if (sending) {
      return (
        <div className='uploading-container'>
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
          <p>
            <b>Sending confirmation email...</b>
          </p>
        </div>
      );
    } else {
      return (
        <div className='send-list'>
          <input
            className='primary'
            placeholder='email'
            type={'email'}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button
            className='primary email'
            onClick={() => {
              sendConfirmationEmail();
            }}
          >
            Sign up
          </button>
        </div>
      );
    }
  }

  return (
    <div className='subscribe'>
      <h3>Get notified when new images are uploaded!</h3>
      {sent ? (
        <p>
          Your confirmation email has been sent! Check your spam folder if you
          don't see it
        </p>
      ) : (
        renderSending()
      )}
    </div>
  );
}

export default Subscribe;
