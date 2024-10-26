import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, notification, Pagination, Alert } from "antd";
import {
  fetchProjects,
  updateProject,
  deleteProject,
  clearError,
  assignUsersToProject,
} from "../../features/projects/projectSlice";
import { fetchUserProjects } from "../../features/projects/userProjectSlice";
import ProjectList from "../../components/Projects/ProjectList";
import EditProjectModal from "../../components/Projects/EditProjectModal";
import UserAssignmentModal from "../../components/Projects/AssignUserModal";
import NewProjectForm from "../../components/Projects/ProjectForm";

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

  useEffect(() => {
    if (role === "admin") {
      dispatch(fetchProjects({ page: currentPage, limit: pageSize }));
    } else if (role === "user") {
      dispatch(fetchUserProjects());
    }
  }, [dispatch, role, currentPage, pageSize]);

  useEffect(() => {
    if (adminError) {
      notification.error({
        message: "Error",
        description: adminError.message,
      });
      dispatch(clearError());
    }
    if (userError) {
      notification.error({
        message: "Error",
        description: userError.message,
      });
      dispatch(clearError());
    }
  }, [adminError, userError, dispatch]);

  const refetchProjects = () => {
    if (role === "admin") {
      dispatch(fetchProjects({ page: currentPage, limit: pageSize }));
    } else if (role === "user") {
      dispatch(fetchUserProjects());
    }
  };

  const handleEditProject = async (updatedProject) => {
    if (!editingProject || role !== "admin") return;
    try {
      await dispatch(
        updateProject({ id: editingProject.id, projectData: updatedProject })
      ).unwrap();
      notification.success({
        message: "Success",
        description: "Project updated successfully.",
      });
      setModalOpen(false);
      setEditingProject(null);
      refetchProjects();
    } catch (err) {
      setFormErrors(err.errors);
    }
  };

  const handleDeleteProject = (id) => {
    if (role !== "admin") return;

    dispatch(deleteProject(id)).then(() => {
      notification.success({
        message: "Success",
        description: "Project deleted successfully.",
      });
      refetchProjects();
    }).catch((err) => {
      notification.error({
        message: "Error",
        description: err.message || "Failed to delete project.",
      });
    });
  };

  const handleAssignUsers = async (userIds) => {
    if (role !== "admin") return;
    try {
      await dispatch(
        assignUsersToProject({
          projectId: selectedProjectId,
          userIds,
        })
      ).unwrap();
      notification.success({
        message: "Success",
        description: "Users assigned successfully.",
      });
      setAssignModalOpen(false);
      setUserIdsToAssign([]);
      refetchProjects();
    } catch (err) {
      notification.error({
        message: "Error",
        description: err.message || "Failed to assign users.",
      });
    }
  };

  const handlePageChange = (page) => {
    if (role === "admin") {
      dispatch(fetchProjects({ page, limit: pageSize }));
    } else if (role === "user") {
      dispatch(fetchUserProjects());
    }
  };

  const openAddProjectModal = () => {
    if (role === "admin") {
      setEditingProject(null);
      setModalOpen(true);
    }
  };

  const openEditProjectModal = (project) => {
    if (role === "admin") {
      setEditingProject(project);
      setModalOpen(true);
    }
  };

  const openAssignUsersModal = (projectId) => { 
    if (role === "admin") {
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

  const isLoading = role === "admin" ? adminLoading : userLoading;
  const projectList = role === "admin" ? adminProjects : userProjects;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Projects Management</h1>

      {role === "admin" && (
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
                onEdit={role === "admin" ? openEditProjectModal : null}
                onDelete={role === "admin" ? handleDeleteProject : null}
                onAssign={role === "admin" ? openAssignUsersModal : null}
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

          <Modal
            title="Add New Project"
            visible={modalOpen && editingProject === null}
            onCancel={closeModal}
            footer={null}
          >
            <NewProjectForm
              onSuccess={() => {
                notification.success({
                  message: "Success",
                  description: "Project created successfully.",
                });
                setModalOpen(false);
                refetchProjects();
              }}
            />
          </Modal>

          <EditProjectModal
            visible={modalOpen && !!editingProject}
            onClose={closeModal}
            onSubmit={handleEditProject}
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
        <Alert
          message={(adminError || userError).message}
          type="error"
          showIcon
        />
      )}
    </div>
  );
};

export default ProjectsPage;
