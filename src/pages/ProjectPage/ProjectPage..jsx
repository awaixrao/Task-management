import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // To access the role from Redux
import { Button } from 'antd';
import ProjectList from '../../components/Projects/ProjectList';
import NewProjectForm from '../../components/Projects/ProjectForm';

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false);

  // Fetch the user role from the Redux store
  const { role } = useSelector((state) => state.auth);

  const handleCreateProject = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1 className="text-3xl font-bold mb-4">Projects</h1>

        {/* Conditionally render the "Create New Project" button only if the user is an admin */}
        {role === 'admin' && (
          <Button type="primary" onClick={handleCreateProject}>
            {showForm ? 'Cancel' : 'Create New Project'}
          </Button>
        )}
      </div>

      {/* Conditionally show the form for creating new projects if the user is an admin */}
      {showForm && role === 'admin' && (
        <div className="new-project-form">
          <NewProjectForm />
        </div>
      )}

      {/* Display the project list for all users */}
      <div className="project-list">
        <ProjectList />
      </div>
    </div>
  );
};

export default ProjectsPage;
