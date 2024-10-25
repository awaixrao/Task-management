import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import TaskAssignmentModal from './TaskAssignModal'; 

// Define column styles based on task status
const columnStyles = {
  todo: 'bg-blue-300',
  'in-progress': 'bg-yellow-300',
  testing: 'bg-orange-300',
  hold: 'bg-red-300',
  completed: 'bg-green-300',
};

const TaskColumn = ({ status, tasks, onEdit, onDelete, projectId, userRole }) => {
  
  
  // State to manage modal visibility and selected task
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Handle task assignment initiation
  const handleAssign = (task) => {
    setSelectedTask(task);  
    setModalVisible(true);  
  };

  // Close the assignment modal
  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedTask(null);  
  };

  // Handle submission of assignment data
  const handleAssignSubmit = (assignmentData) => {
    console.log('Assigned users:', assignmentData);
    handleModalClose();
  };

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col p-4 rounded-lg shadow-lg ${columnStyles[status]} w-64`}
        >
          <h2 className="font-bold text-lg mb-2 capitalize">{status}</h2>
          <div className="flex-1 overflow-y-auto">
            {tasks.map((task, taskIndex) => (
              <TaskCard
                key={task.id}
                task={task}
                index={taskIndex}
                onEdit={onEdit}
                onDelete={onDelete}
                onAssign={() => handleAssign(task)} 
                userRole={userRole} 
                projectId={projectId} // Ensure projectId is passed here

              />
            ))}
            {provided.placeholder}
          </div>

          {/* Task Assignment Modal */}
          {isModalVisible && selectedTask && (
            <TaskAssignmentModal
              modalopen={isModalVisible}
              onClose={handleModalClose}
              onSubmit={handleAssignSubmit}
              taskId={selectedTask.id}
              projectId={projectId} // Pass projectId to the modal
            />
          )}
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
