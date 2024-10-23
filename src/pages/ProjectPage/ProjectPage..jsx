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
import { fetchUserProjects } from '../../features/projects/userProjectSlice'; // Import the action for user projects

import ProjectList from '../../components/Projects/ProjectList';
import EditProjectModal from '../../components/Projects/EditProjectModal';
import UserAssignmentModal from '../../components/Projects/AssignUserModal'; // New component for user assignment

const ProjectsPage = () => {
  const dispatch = useDispatch();

  // Fetching user role from auth state
  const { role } = useSelector((state) => state.auth.user); // Assuming role is stored in auth state after login
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
      dispatch(fetchUserProjects()); // Fetch only user-assigned projects
    }
  }, [dispatch, role, currentPage, pageSize]);

  // Log the fetched projects for debugging purposes
  useEffect(() => {
  }, [adminProjects, userProjects]);

  // Handle errors for admin and user separately
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

  // Handle actions (add, edit, delete, assign) only for admin role
  const handleAddProject = async (newProject) => {
    if (role !== 'admin') return; // Restrict adding project for non-admin users
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

  const handleEditProject = async (updatedProject) => {
    if (!editingProject || role !== 'admin') return; // Restrict editing for non-admin users
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

  const handleDeleteProject = (id) => {
    if (role !== 'admin') return; // Restrict deleting project for non-admin users
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

  const handleAssignUsers = async () => {
    if (role !== 'admin') return; // Restrict assigning users for non-admin users
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

  const handlePageChange = (page) => {
    if (role === 'admin') {
      dispatch(fetchProjects({ page, limit: pageSize }));
    } else if (role === 'user') {
      dispatch(fetchUserProjects()); // Fetch user-specific projects
    }
  };

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

      {/* Show "Add Project" button only if the role is admin */}
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
          {projectList && projectList.length > 0 ? (
            <>
              <ProjectList
                projects={projectList}
                onEdit={role === 'admin' ? openEditProjectModal : null} // Allow edit only for admin
                onDelete={role === 'admin' ? handleDeleteProject : null} // Allow delete only for admin
                onAssign={role === 'admin' ? openAssignUsersModal : null} // Allow assign only for admin
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

          {/* Modal for adding or editing project */}
          <EditProjectModal
            visible={modalOpen}
            onClose={closeModal}
            onSubmit={editingProject ? handleEditProject : handleAddProject}
            project={editingProject}
            errors={formErrors}
          />

          {/* Modal for assigning users */}
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
