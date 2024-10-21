import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Alert } from 'antd';
import { fetchProjects, createProject } from '../../features/projects/projectSlice';
import ProjectList from '../../components/Projects/ProjectList';
import NewProjectForm from '../../components/Projects/ProjectForm';
import { setUserRole } from '../../features/auth/AuthSlice';

const ProjectsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const { role } = useSelector((state) => state.auth);
  const { projects, loading, error } = useSelector((state) => state.projects);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole && !role) {
      dispatch(setUserRole(storedRole));
    }
  }, [dispatch, role]);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = () => {
    setShowForm((prev) => !prev);
  };

  const handleFormSubmit = async (projectData) => {
    const resultAction = await dispatch(createProject(projectData));
  
    if (createProject.fulfilled.match(resultAction)) {
      // Successfully created project
      await dispatch(fetchProjects()); // Refetch projects after creation
      setShowForm(false); // Hide the form
      dispatch(clearError()); // Clear any existing errors after successful creation
    } else {
      // Log and handle the error here if necessary
      console.error('Failed to create project:', resultAction.error);
    }
  };
  

  const projectArray = projects?.data?.data || []; // Adjust as per your API response structure

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
          <NewProjectForm onSubmit={handleFormSubmit} />
        </div>
      )}

      {!loading && !error && (
        <div className="project-list">
          <ProjectList projects={projectArray} />
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
