// src/ChatComponent.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  const simulateStreaming = async (words) => {
    return new Promise((resolve) => {
      let currentIndex = 0;
  
      const intervalId = setInterval(() => {
        setChatHistory((prevHistory) => {
          const updatedHistory = [...prevHistory];
  
          if (updatedHistory.length > 0 && updatedHistory[updatedHistory.length - 1].type === 'server') {
            // Update the last system message with the new word
            updatedHistory[updatedHistory.length - 1].message = words.slice(0, currentIndex).join(' ');
          } else {
            // If there is no system message, add a new one
            updatedHistory.push({ type: 'server', message: words.slice(0, currentIndex).join(' ') });
          }
  
          return updatedHistory;
        });
  
        currentIndex += 1;
  
        if (currentIndex > words.length) {
          clearInterval(intervalId);
          resolve();
        }
      }, 40); // Adjust the duration between each word (in milliseconds)
    });
  };
  
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    const sendInput = inputMessage;
    // Clear the input field immediately after making the POST request
    setInputMessage('');
    // Display the user input immediately
    setChatHistory((prevHistory) => [...prevHistory, { type: 'user', message: sendInput }]);
  
    try {
      // Make the POST request to the relative path (/process_query)
      const response = await axios.post('https://stagpt35model.azurewebsites.net/process_query' +'/process_query', { query: sendInput }, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      // Split the server response into an array of words
      const serverMessageWords = response.data.result.split(' ');
  
      // Simulate streaming effect
      await simulateStreaming(serverMessageWords);
    } catch (error) {
      console.error('Error sending message:', error);
    }

  };
  
  
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default behavior of Enter key (e.g., new line in textarea)
      sendMessage();
    }
  };


// Scroll to the bottom of the chat container when a new message is added
useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* Black sidebar */}
      <div style={{ width: '16%', backgroundColor: '#1c1c1c', padding: '20px' }}>
        {/* Add any content or components for the sidebar here */}
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        {/* Container for two centered images */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <img
            src="https://big4accountingfirms.com/wp-content/uploads/Deloitte.svg.png"
            alt="Deloitte"
            style={{ width: '300px', marginRight: '20px' }}
          />
          <img
            src="https://seeklogo.com/images/V/visit-saudi-logo-A943496290-seeklogo.com.png"
            alt="Saudi"
            style={{ width: '200px' }}
          />
        </div>
        <div
          ref={chatContainerRef}
          style={{
            minHeight: 'calc(100vh - 60px)',
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '20px',
            overflowY: 'auto',
            paddingLeft:'100px',
            paddingRight:'100px'
          }}
        >
          {chatHistory.map((chat, index) => (
            <div key={index} style={{ marginBottom: '10px', fontSize: '20px', color: chat.type === 'user' ? 'green' : 'black' }}>
              {Array.isArray(chat.message) ? (
                chat.message.map((line, i) => (
                  <div key={i}>{line}</div>
                ))
              ) : (
                chat.message.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))
              )}
            </div>
          ))}
        </div>
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            width: '81%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '50px',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
          }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            style={{ flex: 1, marginRight: '10px', paddingTop: '15px', paddingBottom: '15px' }}
          />
          <button onClick={sendMessage} style={{ backgroundColor: '#359eeb', color: '#fff', padding: '15px 30px', border: 'none' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
