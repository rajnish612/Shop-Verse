import React from "react";
import HeroSection from "../../components/HeroSection";
import Deals from "../../components/Deals";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Hero Section */}
      <HeroSection />
      <Deals />
    </div>
  );
};

export default HomePage;
