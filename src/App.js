import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
