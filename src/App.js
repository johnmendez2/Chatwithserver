import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ChatComponent from './components/chat';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ChatComponent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
