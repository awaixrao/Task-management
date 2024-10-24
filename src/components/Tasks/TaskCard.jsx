import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, CommentOutlined } from '@ant-design/icons';

const TaskCard = ({ task, index, onEdit, onDelete, projectId, userRole }) => {
  console.log("TaskCard projectId:", projectId); // Debugging line to check the projectId

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-md p-3 mb-2 cursor-pointer hover:shadow-lg transition"
        >
          <h3 className="font-semibold">{task.name}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex justify-between mt-2">
            {userRole === 'admin' && (
              <>
                <EditOutlined
                  className="text-blue-500 text-lg hover:text-blue-600 cursor-pointer"
                  onClick={() => onEdit(task)}
                  title="Edit Task"
                />
                <DeleteOutlined
                  className="text-red-500 text-lg hover:text-red-600 cursor-pointer"
                  onClick={() => onDelete(task.id)}
                  title="Delete Task"
                />
              </>
            )}
            <Link to={`/projects/${projectId}/tasks/${task.id}/comments`}>
              <CommentOutlined className="text-purple-500 text-lg hover:text-purple-600 cursor-pointer" title="View Comments" />
            </Link>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
