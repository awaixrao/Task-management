import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';

const ProjectList = ({ projects, onDetail, onEdit, onDelete, onAssign, role }) => {
  // Define the columns for the project table
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
      ellipsis: true, // Truncate long text
    },
    {
      title: 'Created At',
      dataIndex: 'created_at', // Adjust this to match your actual API response
      key: 'created_at',
      render: (text) => new Date(text).toLocaleDateString(), // Format date as needed
    },
    {
      title: 'Actions',
      render: (_, project) => (
        <div>
          {/* Show edit button only for admin role */}
          {role === 'admin' && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(project)} // Pass the entire project object
              style={{ marginRight: '8px' }}
            />
          )}
          {/* Show delete button only for admin role */}
          {role === 'admin' && (
            <Popconfirm
              title="Are you sure to delete this project?"
              onConfirm={() => onDelete(project.id)} // Handle project deletion
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
          {/* Show detail button for all roles */}
          <Button
            type="default"
            icon={<FileDoneOutlined />}
            onClick={() => onDetail(project.id)} // Handle project detail view
            style={{ marginRight: '8px' }}
          />
          {/* Show assign button only for admin role */}
          {role === 'admin' && (
            <Button
              type="default"
              icon={<TeamOutlined />}
              onClick={() => onAssign(project.id)} // Pass the project ID to the onAssign function
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
      pagination={false} // Disable internal pagination for now
    />
  );
};

export default ProjectList;
