// src/pages/TasksPage.jsx
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
} from '../../features/tasks/taskSlice'; // Adjust as necessary
import { fetchUsers } from '../../features/users/userSlice'; // Import fetchUsers action
import KanbanBoard from '../../components/Kanban/Kanban';
import EditTaskModal from '../../components/Kanban/EditTaskModal';
import TaskAssignmentModal from '../../components/Kanban/TaskAssignModal';

const TasksPage = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { users, loading: usersLoading, error: usersError } = useSelector((state) => state.users);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formErrors, setFormErrors] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Store selected task ID for assignment

  // Fetch tasks on component mount
  useEffect(() => {
    if (projectId) {
      dispatch(fetchTasks(projectId));
    }
  }, [dispatch, projectId]);

  // Show error notifications for tasks
  useEffect(() => {
    if (tasksError) {
      notification.error({
        message: 'Error',
        description: tasksError.message,
      });
      dispatch(clearError());
    }
  }, [tasksError, dispatch]);

  // Handle task addition
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
      return; // No change in position
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
      await dispatch(assignUsersToTask(data)).unwrap(); // data should include taskId and userIds
      notification.success({
        message: 'Success',
        description: 'User assigned to task successfully.',
      });
      dispatch(fetchTasks(projectId)); // Refresh tasks after assignment
      closeAssignModal(); // Close the assignment modal
    } catch (err) {
      notification.error({
        message: 'Error',
        description: err.message,
      });
    }
  };

  // Open user assignment modal with selected task ID
  const openAssignModal = (taskId) => {
    setSelectedTaskId(taskId); // Set selected task ID for assignment
    setAssignModalVisible(true);
    dispatch(fetchUsers({ page: 1, limit: 10 })); // Fetch users when opening the modal
  };

  // Close assignment modal
  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setSelectedTaskId(null); // Reset selected task ID
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Task Management</h1>
      <div className="flex justify-end mb-4">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 text-lg rounded transition duration-300 ease-in-out"
          onClick={openAddTaskModal}
        >
          Add Task
        </Button>
      </div>
      {(tasksLoading || usersLoading) ? (
        <p>Loading tasks...</p>
      ) : (
        <>
          <KanbanBoard
            tasks={tasks}
            onEdit={openEditTaskModal}
            onDelete={handleDeleteTask}
            onDragEnd={onDragEnd}
            onAssign={openAssignModal} // Pass task ID to openAssignModal
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
            taskId={selectedTaskId} // Pass selected task ID to the modal
          />
        </>
      )}
      {(tasksError || usersError) && <Alert message={tasksError?.message || usersError?.message} type="error" showIcon />}
    </div>
  );
};

export default TasksPage;
