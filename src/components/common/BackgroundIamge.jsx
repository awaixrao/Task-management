import React from 'react';

const BackgroundImage = () => {
  return (
    <div
      className="hidden md:block w-1/2 h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(/task.jpg)`, 
      }}
    ></div>
  );
};

export default BackgroundImage;
