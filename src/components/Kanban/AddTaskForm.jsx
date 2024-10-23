import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTask } from '../../features/tasks/taskSlice';

const AddTaskForm = ({ projectId }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('todo'); // Default status

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = { name, description, due_date: dueDate, status };
    dispatch(createTask({ projectId, taskData })); // Dispatch createTask with projectId
    // Reset the form after submission
    setName('');
    setDescription('');
    setDueDate('');
    setStatus('todo');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
      <input
        type="text"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-md p-2 mb-4 w-full"
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-md p-2 mb-4 w-full"
        required
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border rounded-md p-2 mb-4 w-full"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded-md p-2 mb-4 w-full"
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="testing">Testing</option>
        <option value="hold">Hold</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Add Task</button>
    </form>
  );
};

export default AddTaskForm;
