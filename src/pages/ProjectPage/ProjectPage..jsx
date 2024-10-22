// src/pages/ProjectsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Modal, notification, Pagination, Alert } from 'antd';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  clearError,
  assignUsersToProject,
} from '../../features/projects/projectSlice';
import { fetchUserProjects } from '../../features/projects/userProjectSlice';

import ProjectList from '../../components/Projects/ProjectList';
import EditProjectModal from '../../components/Projects/EditProjectModal';
import UserAssignmentModal from '../../components/Projects/AssignUserModal';

const ProjectsPage = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth.user);
  
  const {
    projects: adminProjects,
    totalProjects,
    currentPage,
    pageSize,
    loading: adminLoading,
    error: adminError,
  } = useSelector((state) => state.projects);

  const {
    projects: userProjects,
    loading: userLoading,
    error: userError,
  } = useSelector((state) => state.userProjects);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [userIdsToAssign, setUserIdsToAssign] = useState([]);

  // Fetch projects based on user role
  useEffect(() => {
    if (role === 'admin') {
      dispatch(fetchProjects({ page: currentPage, limit: pageSize }));
    } else if (role === 'user') {
      dispatch(fetchUserProjects());
    }
  }, [dispatch, role, currentPage, pageSize]);

  // Log the fetched projects for debugging
  useEffect(() => {
    console.log('Admin Projects:', adminProjects);
    console.log('User Projects:', userProjects);
  }, [adminProjects, userProjects]);

  // Handle errors
  useEffect(() => {
    if (adminError) {
      notification.error({
        message: 'Error',
        description: adminError.message,
      });
      dispatch(clearError());
    }
    if (userError) {
      notification.error({
        message: 'Error',
        description: userError.message,
      });
      dispatch(clearError());
    }
  }, [adminError, userError, dispatch]);

  // Add Project
  const handleAddProject = async (newProject) => {
    if (role !== 'admin') return;
    try {
      await dispatch(createProject(newProject)).unwrap();
      notification.success({
        message: 'Success',
        description: 'Project added successfully.',
      });
      setModalOpen(false);
      dispatch(fetchProjects({ page: currentPage, limit: pageSize }));
    } catch (err) {
      setFormErrors(err.errors);
    }
  };

  // Edit Project
  const handleEditProject = async (updatedProject) => {
    if (!editingProject || role !== 'admin') return;
    try {
      await dispatch(updateProject({ id: editingProject.id, projectData: updatedProject })).unwrap();
      notification.success({
        message: 'Success',
        description: 'Project updated successfully.',
      });
      setModalOpen(false);
      setEditingProject(null);
      dispatch(fetchProjects({ page: currentPage, limit: pageSize }));
    } catch (err) {
      setFormErrors(err.errors);
    }
  };

  // Delete Project
  const handleDeleteProject = (id) => {
    if (role !== 'admin') return;
    Modal.confirm({
      title: 'Are you sure you want to delete this project?',
      onOk: () => {
        dispatch(deleteProject(id)).then(() => {
          notification.success({
            message: 'Success',
            description: 'Project deleted successfully.',
          });
          dispatch(fetchProjects({ page: currentPage, limit: pageSize }));
        });
      },
    });
  };

  // Assign Users
  const handleAssignUsers = async () => {
    if (role !== 'admin') return;
    try {
      await dispatch(assignUsersToProject({ projectId: selectedProjectId, userIds: userIdsToAssign })).unwrap();
      notification.success({
        message: 'Success',
        description: 'Users assigned successfully.',
      });
      setAssignModalOpen(false);
      setUserIdsToAssign([]);
      dispatch(fetchProjects({ page: currentPage, limit: pageSize }));
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message || 'Failed to assign users.',
      });
    }
  };

  // Handle Page Change
  const handlePageChange = (page) => {
    if (role === 'admin') {
      dispatch(fetchProjects({ page, limit: pageSize }));
    } else if (role === 'user') {
      dispatch(fetchUserProjects({ page }));
    }
  };

  // Modal Handlers
  const openAddProjectModal = () => {
    if (role === 'admin') {
      setEditingProject(null);
      setModalOpen(true);
    }
  };

  const openEditProjectModal = (project) => {
    if (role === 'admin') {
      setEditingProject(project);
      setModalOpen(true);
    }
  };

  const openAssignUsersModal = (projectId) => {
    if (role === 'admin') {
      setSelectedProjectId(projectId);
      setAssignModalOpen(true);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedProjectId(null);
    setUserIdsToAssign([]);
  };

  const isLoading = role === 'admin' ? adminLoading : userLoading;
  const projectList = role === 'admin' ? adminProjects : userProjects;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Projects Management</h1>

      {role === 'admin' && (
        <div className="flex justify-end mb-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 text-lg rounded transition duration-300 ease-in-out"
            onClick={openAddProjectModal}
          >
            Add Project
          </Button>
        </div>
      )}

      {isLoading ? (
        <p>Loading projects...</p>
      ) : (
        <>
          {projectList.length > 0 ? (
            <>
              <ProjectList
                projects={projectList}
                onEdit={role === 'admin' ? openEditProjectModal : null}
                onDelete={role === 'admin' ? handleDeleteProject : null}
                onAssign={role === 'admin' ? openAssignUsersModal : null}
              />
              <div className="flex justify-center mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalProjects}
                  onChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <p>No projects found.</p>
          )}

          <EditProjectModal
            visible={modalOpen}
            onClose={closeModal}
            onSubmit={editingProject ? handleEditProject : handleAddProject}
            project={editingProject}
            errors={formErrors}
          />

          <UserAssignmentModal
            visible={assignModalOpen}
            onClose={closeAssignModal}
            onSubmit={handleAssignUsers}
          />
        </>
      )}

      {(adminError || userError) && (
        <Alert message={(adminError || userError).message} type="error" showIcon />
      )}
    </div>
  );
};

export default ProjectsPage;
