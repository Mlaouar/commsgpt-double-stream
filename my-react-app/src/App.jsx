import React from 'react';
import './App.css';
import './style.css'; // Import the new CSS file
import ChatCompletion from './ChatCompletion';

const App = () => {
  return (
    <div>
      <h1>Chat Completion Streaming</h1>
      <div className="container">
        <ChatCompletion />
      </div>
    </div>
  );
};

export default App;