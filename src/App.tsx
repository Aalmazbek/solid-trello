import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header/Header';
import DndWrapper from './components/DnDWrapper/DnDWrapper';

function App() {
  return (
    <div className="App">
      <Header />

      <DndWrapper />
    </div>
  );
}

export default App;
