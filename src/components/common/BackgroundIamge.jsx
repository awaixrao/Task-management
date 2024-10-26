import React from 'react';

const BackgroundImage = () => {
  return (
    <div
      className="hidden md:block w-1/2 h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(https://img.freepik.com/free-vector/task-distribution-concept-interaction-departments-business-teamwork-management-business-profit-financial-growth-isolated-flat-vector-illustration_613284-3399.jpg?t=st=1729937474~exp=1729941074~hmac=ea349730815c66ba06c92ea7b4ab070dc4bd09d7e538c21c2acd12a465ff7275&w=740)`, 
      }}
    ></div>
  );
};

export default BackgroundImage;
