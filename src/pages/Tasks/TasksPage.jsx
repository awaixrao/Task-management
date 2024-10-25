import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Modal, notification, Alert } from 'antd';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearError,
  assignUsersToTask,
} from '../../features/tasks/taskSlice'; 
import { fetchUsers } from '../../features/users/userSlice'; 
import KanbanBoard from '../../components/Tasks/Kanban';
import EditTaskModal from '../../components/Tasks/EditTaskModal';
import TaskAssignmentModal from '../../components/Tasks/TaskAssignModal';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);
  const { role: userRole } = useSelector((state) => state.auth); // Get user role from auth slice

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null); 

  // Fetch tasks on component mount
  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks(projectId));
    }
  }, [dispatch, projectId]);

  useEffect(() => {
    if (tasksError) {
      notification.error({
        message: 'Error',
        description: tasksError.message,
      });
      dispatch(clearError());
    }
  }, [tasksError, dispatch]);

  // Handle task add
  const handleAddTask = async (newTask) => {
    try {
      await dispatch(createTask({ projectId, taskData: newTask })).unwrap();
      notification.success({
        message: 'Success',
        description: 'Task added successfully.',
      });
      setModalOpen(false);
      dispatch(fetchTasks(projectId));
    } catch (err) {
      setFormErrors(err.errors);
    }
  };

  // Handle task editing
  const handleEditTask = async (updatedTask) => {
    if (!editingTask) return;
    try {
      await dispatch(updateTask({ projectId, taskId: editingTask.id, taskData: updatedTask })).unwrap();
      notification.success({
        message: 'Success',
        description: 'Task updated successfully.',
      });
      setModalOpen(false);
      setEditingTask(null);
      dispatch(fetchTasks(projectId));
    } catch (err) {
      setFormErrors(err.errors);
    }
  };

  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      onOk: async () => {
        try {
          await dispatch(deleteTask({ projectId, taskId })).unwrap();
          notification.success({
            message: 'Success',
            description: 'Task deleted successfully.',
          });
          dispatch(fetchTasks(projectId));
        } catch (error) {
          notification.error({
            message: 'Error',
            description: 'Failed to delete task.',
          });
        }
      },
    });
  };

  // Handle drag and drop
  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return; 
    }

    const movedTask = tasks.find((task) => task.id.toString() === source.draggableId);
    const updatedTask = { ...movedTask, status: destination.droppableId };

    await dispatch(updateTask({ projectId, taskId: movedTask.id, taskData: updatedTask })).unwrap();
    dispatch(fetchTasks(projectId));
  };

  // Open the add task modal
  const openAddTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // Open the edit task modal
  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  // Handle user assignment to a task
  const handleAssignUser = async (data) => {
    try {
      await dispatch(assignUsersToTask(data)).unwrap(); 
      notification.success({
        message: 'Success',
        description: 'User assigned to task successfully.',
      });
      dispatch(fetchTasks(projectId)); 
      closeAssignModal(); 
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
    }
  };

  // Open user assignment modal with selected task ID
  const openAssignModal = (taskId) => {
    setSelectedTaskId(taskId); 
    setAssignModalVisible(true);
    dispatch(fetchUsers({ page: 1, limit: 10 })); 
  };

  // Close assignment modal
  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setSelectedTaskId(null); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Task Management</h1>
      <div className="flex justify-end mb-4">
        {userRole === 'admin' && ( // Only show button for admin role
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 text-lg rounded transition duration-300 ease-in-out"
            onClick={openAddTaskModal}
          >
            Add Task
          </Button>
        )}
      </div>
      {(tasksLoading || usersLoading) ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <KanbanBoard
            tasks={tasks}
            onEdit={userRole === 'admin' ? openEditTaskModal : null} // Disable edit for non-admin
            onDelete={userRole === 'admin' ? handleDeleteTask : null} // Disable delete for non-admin
            onDragEnd={onDragEnd}
            onAssign={openAssignModal} 
            userRole={userRole} // Pass user role to KanbanBoard
            projectId={projectId} // Ensure projectId is passed here

          />
          <EditTaskModal
            visible={modalOpen}
            onClose={closeModal}
            onSubmit={editingTask ? handleEditTask : handleAddTask}
            task={editingTask}
            errors={formErrors}
          />
          <TaskAssignmentModal
            visible={assignModalVisible}
            onClose={closeAssignModal}
            onSubmit={handleAssignUser}
            taskId={selectedTaskId} 
          />
        </>
      )}
      {(tasksError || usersError) && <Alert message={tasksError?.message || usersError?.message} type="error" showIcon />}
    </div>
  );
};

export default TasksPage;
