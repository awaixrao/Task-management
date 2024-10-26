import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, CommentOutlined, PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';

const TaskCard = ({ task, index, onEdit, onDelete, onOpenSubtaskModal, projectId, userRole }) => {
  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={() => onEdit(task)} icon={<EditOutlined />}>
        Edit Task
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => onDelete(task.id)} danger icon={<DeleteOutlined />}>
        Delete Task
      </Menu.Item>
      <Menu.Item key="subtask" onClick={() => onOpenSubtaskModal(task.id)} icon={<PlusOutlined />}>
        Add Subtask
      </Menu.Item>
      <Menu.Item key="comments">
        <Link to={`/projects/${projectId}/tasks/${task.id}/comments`}>
          <CommentOutlined /> View Comments
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-md p-3 mb-2 cursor-pointer hover:shadow-lg transition"
          style={{ width: '100%' }} 
        >
          <h3 className="font-semibold">{task.name}</h3>
          <p className="text-gray-600">{task.description}</p>
          <div className="flex justify-between items-center mt-2">
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <EllipsisOutlined className="text-gray-500 text-lg hover:text-gray-600 cursor-pointer" title="More Options" />
            </Dropdown>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
