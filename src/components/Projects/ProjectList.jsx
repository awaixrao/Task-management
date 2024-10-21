import React from 'react';
import ProjectCard from './ProjectCard'; // Import your ProjectCard component
import { Row, Col } from 'antd'; // For responsive layout

const ProjectList = ({ projects }) => {
  if (!projects.length) {
    return <p>No projects found.</p>;
  }

  return (
    <Row gutter={[16, 16]} justify="center"> {/* Use Ant Design's Row and Col for layout */}
      {projects.map((project) => (
        <Col key={project.id} xs={24} sm={12} md={8} lg={6}>
          <ProjectCard title={project.name} description={project.description} />
        </Col>
      ))}
    </Row>
  );
};

export default ProjectList;
