import React from 'react';
import { Row, Col } from 'antd';
import ProjectCard from './ProjectCard';

const projectsData = [
  { id: 1, title: 'Project 1', description: 'This is project 1' },
  { id: 2, title: 'Project 2', description: 'This is project 2' },
  { id: 3, title: 'Project 3', description: 'This is project 3' },
  // Add more sample projects here
];

const ProjectList = () => {
  return (
    <Row gutter={[16, 16]}>
      {projectsData.map((project) => (
        <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
          <ProjectCard title={project.title} description={project.description} />
        </Col>
      ))}
    </Row>
  );
};

export default ProjectList;
