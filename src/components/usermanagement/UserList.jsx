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
      dataIndex: 'role', 
      key: 'role',
    },
    {
      title: 'Actions',
      render: (_, user) => (
        <>
          <Button
            type="primary" 
            onClick={() => onEdit(user)}
            style={{ marginRight: '8px' }}
          >
            Edit
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
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
      pagination={false} 
    />
  );
};

export default UserList;
