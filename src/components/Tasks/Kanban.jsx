import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';

const KanbanBoard = ({ tasks, onEdit, onDelete, onDragEnd, projectId, userRole }) => {  console.log(projectId);
// Added userRole here
  const taskStatuses = ['todo', 'in-progress', 'testing', 'hold', 'completed'];

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto p-4">
        {taskStatuses.map((status, index) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            index={index}
            onEdit={onEdit}
            onDelete={onDelete}
            projectId={projectId} // Pass projectId to TaskColumn
            userRole={userRole} // Pass userRole to TaskColumn
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
