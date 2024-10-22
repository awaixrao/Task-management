import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal, Button, Input, Select, Form, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const teamMembers = ['John', 'Sarah', 'Mike', 'Alice', 'Bob'];
const taskStates = ['To Do', 'In Progress', 'Completed'];

const initialTasks = {
  todo: [
    { id: 'task-1', title: 'Design Wireframes', description: 'Create basic wireframes for the project.', assignees: ['John'], dueDate: '2023-10-30' },
    { id: 'task-2', title: 'Setup Backend', description: 'Initialize the backend environment.', assignees: ['Sarah'], dueDate: '2023-11-02' },
  ],
  inProgress: [
    { id: 'task-3', title: 'Develop Frontend', description: 'Create the frontend UI for the project.', assignees: ['Mike'], dueDate: '2023-11-05' },
  ],
  completed: [
    { id: 'task-4', title: 'Client Meeting', description: 'Discuss project requirements with the client.', assignees: ['Alice', 'Bob'], dueDate: '2023-10-20' },
  ],
};

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignees: [], dueDate: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Handle drag and drop event
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Check if the item was dropped outside a droppable area
    if (!destination) return;

    const sourceCol = source.droppableId;
    const destinationCol = destination.droppableId;

    // If the item was dropped in the same column
    if (sourceCol === destinationCol) {
        const updatedTasks = Array.from(tasks[sourceCol]);
        const [removed] = updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, removed);
        
        setTasks((prev) => ({
            ...prev,
            [sourceCol]: updatedTasks,
        }));
    } else {
        // Moving to a different column
        const sourceTasks = Array.from(tasks[sourceCol]);
        const destinationTasks = Array.from(tasks[destinationCol]);
        
        const [removed] = sourceTasks.splice(source.index, 1);
        destinationTasks.splice(destination.index, 0, removed);
        
        setTasks((prev) => ({
            ...prev,
            [sourceCol]: sourceTasks,
            [destinationCol]: destinationTasks,
        }));
    }
};


  // Open modal for new task
  const openModal = () => setIsModalOpen(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', assignees: [], dueDate: null });
    setSelectedMembers([]);
  };

  // Add new task to "To Do"
  const handleAddTask = () => {
    if (!newTask.title || !selectedMembers.length) return;

    const newTaskObj = {
      id: `task-${Date.now()}`, // Ensure unique task ID
      title: newTask.title,
      description: newTask.description,
      assignees: selectedMembers,
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString().split('T')[0] : null,
    };

    setTasks((prev) => ({
      ...prev,
      todo: [...prev.todo, newTaskObj], // Add new task to "To Do"
    }));

    handleModalClose();
  };

  const handleDueDateChange = (date) => setNewTask((prev) => ({ ...prev, dueDate: date }));

  return (
    <div className="p-6 rounded-md shadow-md bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Static Tasks</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskStates.map((state) => {
            const key = state.toLowerCase().replace(/\s/g, '');

            return (
              <Droppable key={key} droppableId={key}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white p-4 rounded-md shadow-md"
                  >
                    <h2 className="text-lg font-semibold mb-4">{state}</h2>
                    {tasks[key] && tasks[key].map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 mb-4 rounded-md shadow-md"
                          >
                            <div className="mb-2 text-sm font-medium">{task.title}</div>
                            <p className="text-gray-600">{task.description}</p>
                            <p className="text-sm font-light">Assigned to: {task.assignees.join(', ')}</p>
                            <p className="text-sm font-light">Due date: {moment(task.dueDate).format('LL')}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      <div className="mt-4">
        <Button type="primary" onClick={openModal}>
          + Add Task
        </Button>
      </div>

      {/* Modal for adding new tasks */}
      <Modal
        title="Add New Task"
        open={isModalOpen}
        onOk={handleAddTask}
        onCancel={handleModalClose}
        okText="Add Task"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Task Title">
            <Input
              value={newTask.title}
              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
            />
          </Form.Item>
          <Form.Item label="Task Description">
            <Input.TextArea
              value={newTask.description}
              onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description"
              rows={4}
            />
          </Form.Item>
          <Form.Item label="Assign to">
            <Select
              mode="multiple"
              value={selectedMembers}
              onChange={setSelectedMembers}
              placeholder="Select team members"
              className="w-full"
              showSearch
            >
              {teamMembers.map((member) => (
                <Option key={member} value={member}>
                  {member}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Due Date">
            <DatePicker
              value={newTask.dueDate ? moment(newTask.dueDate) : null}
              onChange={handleDueDateChange}
              format="YYYY-MM-DD"
              className="w-full"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
