import React from 'react';
import { Card } from 'antd';

const ProjectCard = ({ title, description }) => {
  return (
    <Card
      title={title}
      hoverable
      style={{ width: '100%', margin: '10px 0', borderRadius: '8px' }}
    >
      <p>{description}</p>
    </Card>
  );
};

export default ProjectCard;
