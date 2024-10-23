// src/components/Tasks/TaskColumn.jsx
import React, { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Button } from 'antd'; // Ensure Button is imported from antd
import TaskAssignmentModal from './TaskAssignModal'; // Ensure the correct path to your TaskAssignmentModal component

const TaskColumn = ({ status, tasks, onEdit, onDelete, users = [], onAssign }) => {
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const openAssignModal = (taskId) => {
    console.log("Opening assign modal for task ID:", taskId); // Debugging log
    setSelectedTaskId(taskId); // Set the selected task ID
    setAssignModalVisible(true); // Open the modal
  };

  const closeAssignModal = () => {
    setAssignModalVisible(false); // Close the modal
    setSelectedTaskId(null); // Reset selected task ID
  };

  const handleAssignUser = async (userIds) => {
    const data = {
      taskId: selectedTaskId,
      userIds: userIds,
    };
    await onAssign(data); // Call the function passed down from TasksPage to assign users
    closeAssignModal(); // Close modal after assignment
  };

  return (
    <Droppable droppableId={status} type="TASK">
      {(provided) => (
        <div
          className="bg-gray-100 p-4 rounded-lg w-64"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h2 className="font-bold text-lg mb-2 capitalize">{status}</h2>
          {tasks.length > 0 ? (
            tasks.map((task, taskIndex) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={taskIndex}>
                {(provided) => (
                  <div
                    className="p-2 mb-2 bg-white rounded shadow-md"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <h3 className="font-semibold">{task.name}</h3>
                    <p>{task.description}</p>
                    <div className="flex justify-between mt-2">
                      <Button onClick={() => onEdit(task)} type="default" className="text-blue-500">
                        Edit
                      </Button>
                      <Button onClick={() => onDelete(task.id)} type="danger" className="text-red-500">
                        Delete
                      </Button>
                      {/* Assign button */}
                      <Button onClick={() => openAssignModal(task.id)} type="default" className="text-green-500">
                        Assign
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))
          ) : (
            <p>No tasks in this column.</p>
          )}
          {provided.placeholder}

          {/* User Assignment Modal */}
          <TaskAssignmentModal
            visible={assignModalVisible} // Ensure correct prop name here
            onClose={closeAssignModal}
            onSubmit={handleAssignUser}
            taskId={selectedTaskId}
          />
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
