import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';

const KanbanBoard = ({ tasks, onEdit, onDelete, onDragEnd }) => {
  // Define the task statuses that will be displayed as columns
  const taskStatuses = ['todo', 'in-progress', 'testing', 'hold', 'completed'];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4">
        {/* Map through each task status and render its corresponding column */}
        {taskStatuses.map((status, index) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)} // Filter tasks by status
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
