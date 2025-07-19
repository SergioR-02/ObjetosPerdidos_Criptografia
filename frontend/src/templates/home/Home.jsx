import React from 'react';
import Header from '../../organisms/header/Header';
import LostObjectsSection from '../../organisms/lostObjectsSection/LostObjectsSection';
import { Footer } from '../../organisms/footer/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <LostObjectsSection />
      <Footer />
    </>
  );
};

export default Home;
