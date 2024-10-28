import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Button, notification, Alert, Dropdown, Menu, Modal } from 'antd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { EditOutlined, DeleteOutlined, CommentOutlined, EllipsisOutlined, UnorderedListOutlined } from '@ant-design/icons';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  clearError,
} from '../../features/tasks/taskSlice';
import EditTaskModal from '../../components/Tasks/EditTaskModal';
import SubtaskModal from '../../components/Tasks/SubTaskModal';
import TaskAssignmentModal from '../../components/Tasks/TaskAssignModal';

const columnStyles = {
  'todo': 'bg-yellow-200',
  'in-progress': 'bg-blue-200',
  'testing': 'bg-orange-200',
  'hold': 'bg-red-200',
  'completed': 'bg-green-200',
};

const TasksPage = () => {
  const dispatch = useDispatch();
  const { id: projectId } = useParams();
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state) => state.tasks);
  const { role: userRole } = useSelector((state) => state.auth);

  const [modalOpen, setModalOpen] = useState(false);
  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [formErrors, setFormErrors] = useState(null);

  useEffect(() => {
    if (projectId) dispatch(fetchTasks(projectId));
  }, [dispatch, projectId]);

  useEffect(() => {
    if (tasksError) {
      notification.error({ message: 'Error', description: tasksError.message });
      dispatch(clearError());
    }
  }, [tasksError, dispatch]);

  const openAddTaskModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const openSubtaskModal = (taskId) => {
    setSelectedTaskId(taskId);
    setSubtaskModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
    setFormErrors(null);
  };

  const closeSubtaskModal = () => {
    setSubtaskModalOpen(false);
    setSelectedTaskId(null);
  };

  const handleAddTask = async (taskData) => {
    try {
      await dispatch(createTask({ projectId, taskData })).unwrap();
      notification.success({ message: 'Success', description: 'Task added successfully.' });
      closeModal();
    } catch (err) {
      setFormErrors(err.errors);
    }
  };

  const handleEditTask = async (taskData) => {
    if (!editingTask) return;
    try {
      await dispatch(updateTask({ projectId, taskId: editingTask.id, taskData })).unwrap();
      notification.success({ message: 'Success', description: 'Task updated successfully.' });
      closeModal();
    } catch (err) {
      setFormErrors(err.errors);
    }
  };

  const handleDeleteTask = (taskId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this task?',
      onOk: async () => {
        try {
          await dispatch(deleteTask({ projectId, taskId })).unwrap();
          notification.success({ message: 'Success', description: 'Task deleted successfully.' });
        } catch (error) {
          notification.error({ message: 'Error', description: 'Failed to delete task.' });
        }
      },
    });
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const movedTask = tasks.find((task) => task.id.toString() === draggableId);

    if (!movedTask) {
      console.error("Error: Task with ID", draggableId, "not found in tasks array.");
      notification.error({
        message: 'Error',
        description: `Failed to update task status: Task with ID ${draggableId} not found.`,
      });
      return;
    }

    const updatedTask = { ...movedTask, status: destination.droppableId };

    try {
      await dispatch(updateTask({ projectId, taskId: movedTask.id, taskData: updatedTask })).unwrap();
      notification.success({
        message: 'Success',
        description: 'Task status updated successfully.',
      });
    } catch (error) {
      console.error("Update Task Error:", error);
      notification.error({
        message: 'Error',
        description: `Failed to update task status: ${error.message || 'Unknown error'}`,
      });
    }
  };

  const taskStatuses = ['todo', 'in-progress', 'testing', 'hold', 'completed'];
  const columns = taskStatuses.reduce((acc, status) => {
    acc[status] = tasks.filter((task) => task.status === status);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Task Management</h1>
      {userRole === 'admin' && (
        <div className="flex justify-end mb-4">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 text-lg rounded transition duration-300 ease-in-out"
            onClick={openAddTaskModal}
          >
            Add Task
          </Button>
        </div>
      )}
      {tasksLoading ? (
        <p>Loading tasks...</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto p-4">
            {taskStatuses.map((status) => (
              <Droppable key={status} droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg p-4 shadow-md w-64 ${columnStyles[status]}`}
                  >
                    <h2 className="font-bold text-xl mb-4">{status.replace('-', ' ')}</h2>
                    {columns[status].map((task, index) => (
                      <Draggable key={task.id.toString()} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white rounded-lg shadow-md p-3 mb-2 cursor-pointer hover:shadow-lg transition relative"
                          >
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold">{task.name}</h3>
                              <Dropdown
                                overlay={
                                  <Menu>
                                    {userRole === 'admin' && (
                                      <>
                                        <Menu.Item key="edit" onClick={() => openEditTaskModal(task)} icon={<EditOutlined />}>
                                          Edit Task
                                        </Menu.Item>
                                        <Menu.Item key="delete" onClick={() => handleDeleteTask(task.id)} danger icon={<DeleteOutlined />}>
                                          Delete Task
                                        </Menu.Item>
                                      </>
                                    )}
                                    <Menu.Item key="comments" icon={<CommentOutlined />}>
                                      <Link to={`/projects/${projectId}/tasks/${task.id}/comments`}>
                                        View Comments
                                      </Link>
                                    </Menu.Item>
                                    <Menu.Item key="subtasks" icon={<UnorderedListOutlined />} onClick={() => openSubtaskModal(task.id)}>
                                      Manage Subtasks
                                    </Menu.Item>
                                  </Menu>
                                }
                                trigger={['click']}
                                placement="bottomRight"
                              >
                                <EllipsisOutlined className="text-gray-500 text-lg hover:text-gray-600 cursor-pointer rotate-90" />
                              </Dropdown>
                            </div>
                            <p className="text-gray-600">{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      )}
      {tasksError && <Alert message={tasksError.message} type="error" showIcon />}

      {/* Add/Edit Task Modal */}
      {modalOpen && userRole === 'admin' && (
        <EditTaskModal
          visible={modalOpen}
          onClose={closeModal}
          onSubmit={editingTask ? handleEditTask : handleAddTask}
          task={editingTask}
          errors={formErrors}
        />
      )}

      {/* Subtask Modal */}
      {subtaskModalOpen && (
        <SubtaskModal
          open={subtaskModalOpen}
          onClose={closeSubtaskModal}
          taskId={selectedTaskId}
        />
      )}
    </div>
  );
};

export default TasksPage;
