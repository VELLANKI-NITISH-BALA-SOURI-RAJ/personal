import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrailerSection from './components/TrailerSection';

const App: React.FC = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <TrailerSection />
    </main>
  );
};

export default App;
