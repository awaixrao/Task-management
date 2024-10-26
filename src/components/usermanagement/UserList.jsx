import React from 'react';
import { Table, Button } from 'antd';
import { useMediaQuery } from 'react-responsive';

const UserList = ({ users, onEdit, onDelete }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 }); 

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
      key: 'actions',
      render: (_, user) => (
        <>
          <Button
            type="primary"
            onClick={() => onEdit(user)}
            style={{ marginRight: isMobile ? '4px' : '8px', padding: isMobile ? '4px 8px' : '6px 12px' }}
          >
            Edit
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => onDelete(user.id)}
            style={{ padding: isMobile ? '4px 8px' : '6px 12px' }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800 }}
      />
    </div>
  );
};

export default UserList;
