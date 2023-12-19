// src/ChatComponent.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import CustomCard from '../../components/customCard/customCard.component';
import CustomButton from '../../components/customButton/customButton.component';
import logo from '../../assets/images/saudiLogo.png';
import './chat.style.css';

export default function ChatComponent(params) {
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);
  const [matchedCity, setMatchedCity] = useState(null);
  const [recommendedQuestions, setRecommendedQuestions] = useState([
    'Tell me about Saudi?',
    'What should I do in Saudi?',
    'What are some must-see places in Saudi?',
    // Add more recommended questions as needed
  ]);
  const [active, setActive] = useState();
  // New state for images
  const [displayImages, setDisplayImages] = useState();

  // New state to track if streaming is done
  const [isStreamingDone, setIsStreamingDone] = useState(false);
  const cities = [
    'riyadh',
    'diriyah',
    'dammam',
    'al-ahsa',
    'jeddah',
    'taif',
    'tabuk',
    'jazan',
    'abha',
    'al-namas',
    'yanbu',
    'kaec',
    'al-baha',
    'alula',
    'hail',
    'al-jouf',
    'makkah',
    'medina',
    'qassim',
    'riyadh-province',
    'eastern-province',
    'makkah-province',
    'aseer',
    'jubail',
    'najran',
  ];
  const imgs = [
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_653fab6c47e0c.&w=1920&q=85',
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_656476ad492b5.&w=1920&q=85',
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_652e70cacf293.&w=1920&q=85',
    'https://book.visitsaudi.com/_next/image?url=%2Fapi%2Fimage-proxy%3Furl%3Dhttps%253A%252F%252Fhalayallaimages-new.s3.me-south-1.amazonaws.com%252Fimages%252Fvenues%252Fprovider_venue_653fac9873198.&w=1920&q=85',
  ]; // Add your image URLs here

  const renderImages = () =>
    displayImages.map((item) => {
      return (
        <CustomCard image={item.Image} url={item.URL} title={item.Title} />
      );
    });

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

        if (
          updatedHistory.length > 0 &&
          updatedHistory[updatedHistory.length - 1].type === 'server'
        ) {
          const currentWord = words[currentIndex];

          if (currentWord) {
            const lowerCaseWord = currentWord.toLowerCase();
            if (cities.includes(lowerCaseWord)) {
              setMatchedCity(capitalizeFirstLetter(lowerCaseWord));
            }

            updatedHistory[updatedHistory.length - 1].message = words
              .slice(0, currentIndex + 1)
              .join(' ');
          }
        } else {
          if (updatedHistory.length >= 6) {
            updatedHistory.shift();
            updatedHistory.shift();
          }
          updatedHistory.push({
            type: 'server',
            message: words.slice(0, currentIndex + 1).join(' '),
            images: [...imgs],
          });
        }

        return updatedHistory;
      });

      // Pause for 40 milliseconds before the next word
      await new Promise((resolve) => setTimeout(resolve, 40));
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
        'Tell me about Saudi?',
        'What should I do in Saudi?',
        'What are some must-see places in Saudi?',
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

    setChatHistory((prevHistory) => [{ type: 'user', message: sendInput }]);

    try {
      // Make the POST request to the relative path (/process_query)

      const response = await axios.post(
        'https://staproxyserver.azurewebsites.net' +'/process_query',
        { query: sendInput },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setDisplayImages(response.data[1]);
      // Split the server response into an array of words

      const serverMessageWords = response.data[0].result
        .replaceAll('\n-', '<p style="margin-left:20px;display: list-item"/>')
        .split(' ');

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
    setActive(question);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && e.target.type !== 'textarea') {
      e.preventDefault();
      sendMessage(inputMessage);
    }
  };

  return (
    <div className="mainContainer">
      {/* Black sidebar */}
      <div className="sideBar">
        {/* Add any content or components for the sidebar here */}
      </div>

      <div className="chatContainer">
        {/* Container for two centered images */}
        <div className="logoContainer">
          <img src={logo} alt="Image 2" className="logoStyle" />
          <img
            src="https://big4accountingfirms.com/wp-content/uploads/Deloitte.svg.png"
            alt="Image 1"
            className="deloitteLogoStyle"
          />
        </div>

        <div ref={chatContainerRef} className="chatTextContainer">
          <div className="responseContainer">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '10px',
                  fontSize: 'calc(1*(1vh + 1vw))',
                  color: chat.type === 'user' ? '#be018d' : 'black',
                }}
              >
                {Array.isArray(chat.message)
                  ? chat.message.map((line, i) => (
                      <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
                    ))
                  : chat.message
                      .split('\n')
                      .map((line, i) => (
                        <div
                          key={i}
                          dangerouslySetInnerHTML={{ __html: line }}
                        />
                      ))}

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
          <div>
            {displayImages ? (
              <>
                <div
                  style={{
                    marginBottom: '15px',
                    marginLeft: '10px',
                    fontSize: 'calc(1*(1vh + 1vw))',
                    color: '#be018d',
                  }}
                >
                  Related links:
                </div>
                <div className="imagesContainer">{renderImages()}</div>
              </>
            ) : null}
          </div>
        </div>

        {/* Recommended Questions */}
        <div className="userInputContainer">
          <div className="quickResponseContainer">
            {recommendedQuestions.map((question, index) => (
              <div
                key={index}
                onClick={() => handleRecommendedQuestionClick(question)}
              >
                <CustomButton
                  title={question}
                  active={active === question ? true : false}
                />
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="chatInputContainer">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="inputContainer"
            />
            <button
              onClick={() => sendMessage(inputMessage)}
              className="sendButtonStyle"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
