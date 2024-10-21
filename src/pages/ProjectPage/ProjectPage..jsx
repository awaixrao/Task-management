import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert } from 'antd';
import { fetchProjects } from '../../features/projects/projectSlice';
import ProjectList from '../../components/Projects/ProjectList';
import NewProjectForm from '../../components/Projects/ProjectForm';

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false); // Toggle form visibility
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth); // Get the user role from Redux state
  const { projects, loading, error } = useSelector((state) => state.projects); // Fetch projects state

  const handleCreateProject = () => {
    setShowForm((prev) => !prev); // Toggle the project form display
  };

  useEffect(() => {
    dispatch(fetchProjects()); // Fetch projects when component mounts
  }, [dispatch]);

  const handleFormSubmit = async () => {
    await dispatch(fetchProjects()); // Re-fetch projects after a new one is created
  };

  // Safely access the project array if the data structure exists
  const projectArray = projects?.data?.data || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Projects</h1>

        {role === 'admin' && (
          <Button
            type="primary"
            onClick={handleCreateProject}
            className="mt-4"
          >
            {showForm ? 'Cancel' : 'Create New Project'}
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <p className="text-lg font-semibold">Loading projects...</p>
        </div>
      )}

      {error && <Alert message={error.message} type="error" showIcon />}

      {showForm && role === 'admin' && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg shadow-md">
          <NewProjectForm onSubmit={handleFormSubmit} /> {/* Pass handleFormSubmit to NewProjectForm */}
        </div>
      )}

      {/* Only show the ProjectList if not loading and there's no error */}
      {!loading && !error && (
        <div className="project-list">
          <ProjectList projects={projectArray} /> {/* Pass the correct array */}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
