import React, { useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import TaskAssignmentModal from './TaskAssignModal';
import SubtaskModal from './SubTaskModal';

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
  const [isSubtaskModalVisible, setSubtaskModalVisible] = useState(false); // State for Subtask Modal

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

  // Handle opening the subtask modal
  const handleOpenSubtaskModal = (taskId) => {
    setSelectedTask(taskId); // Set the taskId of the selected task
    setSubtaskModalVisible(true); // Show the subtask modal
  };

  return (
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col p-4 rounded-lg shadow-lg ${columnStyles[status]} sm:w-64 w-full mb-4`}
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
                onOpenSubtaskModal={handleOpenSubtaskModal} // Pass the function to open subtask modal
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

          {/* Subtask Modal */}
          <SubtaskModal
            open={isSubtaskModalVisible}
            onClose={() => setSubtaskModalVisible(false)}
            taskId={selectedTask} // Pass the taskId for the subtask modal
            projectId={projectId} // Pass the projectId to fetch subtasks
          />
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
