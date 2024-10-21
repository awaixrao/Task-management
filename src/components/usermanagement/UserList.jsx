// src/components/usermanagement/UserList.jsx
import React from 'react';
import { Table, Button } from 'antd';

const UserList = ({ users, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role', // Assuming the role is stored under the 'role' key
      key: 'role',
    },
    {
      title: 'Actions',
      render: (_, user) => (
        <>
          <Button
            type="primary" // Use Ant Design primary type for a blue background
            onClick={() => onEdit(user)}
            style={{ marginRight: '8px' }} // Add space between buttons
          >
            Edit
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700" // Tailwind styles for danger button
            onClick={() => onDelete(user.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      dataSource={users}
      columns={columns}
      rowKey="id"
      pagination={false} // Disable internal pagination
    />
  );
};

export default UserList;
