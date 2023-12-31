// src/ChatComponent.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ChatComponent = () => {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const [matchedCity, setMatchedCity] = useState(null);
  const [recommendedQuestions, setRecommendedQuestions] = useState([
    "Tell me about Saudi?",
    "What should I do in Saudi?",
    "What are some must-see places in Saudi?",
    // Add more recommended questions as needed
  ]);
  // New state for images
  const [displayImages, setDisplayImages] = useState([]);
  // New state to track if streaming is done
  const [isStreamingDone, setIsStreamingDone] = useState(false);
  const cities = [
    "riyadh", "diriyah", "dammam", "al-ahsa", "jeddah", "taif", "tabuk", "jazan", "abha",
    "al-namas", "yanbu", "kaec", "al-baha", "alula", "hail", "al-jouf", "makkah", "medina",
    "qassim", "riyadh-province", "eastern-province", "makkah-province", "aseer", "jubail", "najran"
  ];
  const imgs = [
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_653fab6c47e0c.&w=1920&q=85',
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_656476ad492b5.&w=1920&q=85', 
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_652e70cacf293.&w=1920&q=85', 
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_653fac9873198.&w=1920&q=85']; // Add your image URLs here

const handleInputChange = (e) => {
  setInputMessage(e.target.value);
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const simulateStreaming = async (words) => {
  for (let currentIndex = 0; currentIndex < words.length; currentIndex++) {
    setChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];

      if (updatedHistory.length > 0 && updatedHistory[updatedHistory.length - 1].type === 'server') {
        const currentWord = words[currentIndex];

        if (currentWord) {
          const lowerCaseWord = currentWord.toLowerCase();
          if (cities.includes(lowerCaseWord)) {
            setMatchedCity(capitalizeFirstLetter(lowerCaseWord));
          }

          updatedHistory[updatedHistory.length - 1].message = words.slice(0, currentIndex + 1).join(' ');
        }
      } else {
        updatedHistory.push({
          type: 'server',
          message: words.slice(0, currentIndex + 1).join(' '),
          images: [...imgs],
        });
      }

      return updatedHistory;
    });

    // Pause for 40 milliseconds before the next word
    await new Promise(resolve => setTimeout(resolve, 40));
  }

  setIsStreamingDone(true);
};
useEffect(() => {
  // Check if there is a matched city and update recommended questions accordingly
  if (matchedCity) {
    setRecommendedQuestions([
      `Shopping in ${matchedCity}`,
      `Restaurants in ${matchedCity}`,
      `Experiences in ${matchedCity}`,
    ]);
  } else {
    // If there was no city match, restore the default recommended questions
    setRecommendedQuestions([
      "Tell me about Saudi?",
      "What should I do in Saudi?",
      "What are some must-see places in Saudi?",
      // Add more recommended questions as needed
    ]);
  }
}, [matchedCity]);

  
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    const sendInput = message;
    // Clear the input field immediately after making the POST request
    setInputMessage('');
    // Display the user input immediately
    setChatHistory((prevHistory) => [...prevHistory, { type: 'user', message: sendInput }]);
  
    try {
      // Make the POST request to the relative path (/process_query)
      const response = await axios.post('https://stagpt35model.azurewebsites.net' +'/process_query', { query: sendInput }, {
        headers: { 'Content-Type': 'application/json' },
      });
  
      setDisplayImages(response.data[1]);
      // Split the server response into an array of words
 
      const serverMessageWords = response.data[0].result.split(' ');
  
      // Simulate streaming effect
      await simulateStreaming(serverMessageWords);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  useEffect(() => {
    // Scroll to the bottom of the page when chatHistory changes
    window.scrollTo(0, document.body.scrollHeight);
  }, [chatHistory]);


  const handleRecommendedQuestionClick = (question) => {
    // Directly send the clicked question without updating inputMessage
    sendMessage(question);
  };
  

  
  
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.type !== 'textarea') {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };
  
  


  return (
    <div style={{ display: 'flex', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* Black sidebar */}
      <div style={{ width: '16%', backgroundColor: '#1c1c1c', padding: '20px' }}>
        {/* Add any content or components for the sidebar here */}
      </div>
  
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {/* Container for two centered images */}
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <img
            src="https://big4accountingfirms.com/wp-content/uploads/Deloitte.svg.png"
            alt="Image 1"
            style={{ width: '300px', marginRight: '20px' }}
          />
          <img
            src="https://seeklogo.com/images/V/visit-saudi-logo-A943496290-seeklogo.com.png"
            alt="Image 2"
            style={{ width: '200px' }}
          />
        </div>
  
        <div
          ref={chatContainerRef}
          style={{
            minHeight: 'calc(60vh)',
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '20vh',
            overflowY: 'auto',
            paddingLeft: '100px',
            paddingRight: '100px',
          }}
        >
          {chatHistory.map((chat, index) => (
            <div
              key={index}
              style={{ marginBottom: '10px', fontSize: '20px', color: chat.type === 'user' ? 'green' : 'black' }}
            >
              {Array.isArray(chat.message) ? (
                chat.message.map((line, i) => <div key={i}>{line}</div>)
              ) : (
                chat.message.split('\n').map((line, i) => <div key={i}>{line}</div>)
              )}
  
              {/* Display images only if it's a server message */}
              {/* {isStreamingDone && chat.type === 'server' && (
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {chat.images.map((image, imgIndex) => (
                    <img key={imgIndex} src={image} alt={`Image ${imgIndex + 1}`} style={{ width: '100px', height: 'auto', margin: '5px' }} />
                  ))}
                </div>
              )} */}
            </div>
          ))}
        </div>
  
        {/* Recommended Questions */}
        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '90px', position: 'fixed', bottom: '0', zIndex: '4', marginLeft: '25px', marginTop: '50px' }}>
          {recommendedQuestions.map((question, index) => (
            <div
              key={index}
              onClick={() => handleRecommendedQuestionClick(question)}
              style={{
                cursor: 'pointer',
                marginRight: '10px',
                padding: '10px',
                backgroundColor: 'lightgrey',
                borderRadius: '5px',
              }}
            >
              {question}
            </div>
          ))}
        </div>
  
        {/* Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            boxSizing: 'border-box',
            backgroundColor: '#fff',
            width: '81%',
            bottom: '0',
            position: 'fixed'
          }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            style={{ flex: 1, marginRight: '10px', paddingTop: '15px', paddingBottom: '15px', marginTop: '50px' }}
          />
          <button
            onClick={() => sendMessage(inputMessage)}
            style={{ backgroundColor: '#359eeb', color: '#fff', padding: '15px 30px', border: 'none', marginTop: '50px' }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
  
  
  
  

};

export default ChatComponent;
