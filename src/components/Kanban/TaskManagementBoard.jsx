import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Modal, Button, Input, Select, Form, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;

// Team members for assignment
const teamMembers = ['John', 'Sarah', 'Mike', 'Alice', 'Bob'];

// Allowed task statuses according to the schema
const taskStates = ['todo', 'in-progress', 'testing', 'hold', 'completed'];

const Tasks = ({ tasks, onAddTask, onUpdateTasks }) => {
  console.log("Tasks received in Tasks component:", tasks); // Log tasks for debugging

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignees: [],
    dueDate: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const openModal = () => setIsModalOpen(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewTask({ title: '', description: '', assignees: [], dueDate: null });
    setSelectedMembers([]);
  };

  const handleAddTask = () => {
    // Validate the task input
    if (!newTask.title || !selectedMembers.length || !newTask.dueDate) {
      console.error('Please fill in all fields');
      return; // Early exit if validation fails
    }

    // Create new task object adhering to the schema
    const newTaskObj = {
      id: Date.now(), // Unique ID for the task, using current timestamp
      title: newTask.title,
      description: newTask.description,
      assignees: selectedMembers,
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString().split('T')[0] : null,
      status: 'todo', // Default status as per schema
    };

    onAddTask(newTaskObj);
    handleModalClose();
  };

  const handleDueDateChange = (date) => setNewTask((prev) => ({ ...prev, dueDate: date }));

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    
    // Update task status to the new droppableId (make sure to map droppableId to valid task states)
    movedTask.status = result.destination.droppableId; // droppableId needs to match the schema values
    updatedTasks.splice(result.destination.index, 0, movedTask);

    onUpdateTasks(updatedTasks);
  };

  return (
    <div className="p-6 rounded-md shadow-md bg-gray-100">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {taskStates.map((state) => (
            <Droppable key={state} droppableId={state}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded-md shadow-md"
                >
                  <h2 className="text-lg font-semibold mb-4">{state.charAt(0).toUpperCase() + state.slice(1)}</h2>
                  {/* Check if tasks is an array before filtering */}
                  {(Array.isArray(tasks) ? tasks : []).filter((task) => task.status === state).map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
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
                          <p className="text-sm font-light">
                            Due date: {task.dueDate ? moment(task.dueDate).format('LL') : 'No due date'}
                          </p>
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

      <div className="mt-4">
        <Button type="primary" onClick={openModal}>
          + Add Task
        </Button>
      </div>

      <Modal
        title="Add New Task"
        open={isModalOpen}
        onOk={handleAddTask}
        onCancel={handleModalClose}
        okText="Add Task"
        cancelText="Cancel"
      >
        <Form layout="vertical">
          <Form.Item label="Task Title" required>
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
          <Form.Item label="Assign to" required>
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

Tasks.propTypes = {
  tasks: PropTypes.array.isRequired,
  onAddTask: PropTypes.func.isRequired,
  onUpdateTasks: PropTypes.func.isRequired,
};

// Default prop values
Tasks.defaultProps = {
  tasks: [], // Ensure tasks defaults to an empty array
};

export default Tasks;
``