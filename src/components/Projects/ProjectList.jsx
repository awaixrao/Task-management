// src/components/Projects/ProjectList.jsx
import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProjectList = ({ projects, onEdit, onDelete, onAssign }) => {
  const navigate = useNavigate(); // Initialize useNavigate

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      render: (_, project) => (
        <div>
          {/* Always show the detail button and navigate to /tasks */}
          <Button
            type="default"
            icon={<FileDoneOutlined />}
            onClick={() => navigate(`/tasks/${project.id}`)} // Navigate to /tasks/:id
            style={{ marginRight: '8px' }}
          />
          {onEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(project)}
              style={{ marginRight: '8px' }}
            />
          )}
          {onDelete && (
            <Popconfirm
              title="Are you sure to delete this project?"
              onConfirm={() => onDelete(project.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="danger"
                icon={<DeleteOutlined />}
                style={{ marginRight: '8px' }}
              />
            </Popconfirm>
          )}
          {onAssign && (
            <Button
              type="default"
              icon={<TeamOutlined />}
              onClick={() => onAssign(project.id)}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      dataSource={projects}
      columns={columns}
      rowKey="id"
      pagination={false}
    />
  );
};

export default ProjectList;
