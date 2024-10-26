import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, TeamOutlined, FileDoneOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

const ProjectList = ({ projects, onEdit, onDelete, onAssign }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 768 }); 

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: isMobile, 
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
      key: 'actions',
      render: (_, project) => (
        <div style={{ display: 'flex', gap: isMobile ? '4px' : '8px' }}>
          <Button
            type="default"
            icon={<FileDoneOutlined />}
            onClick={() => navigate(`/tasks/${project.id}`)}
            style={{ padding: isMobile ? '4px 6px' : '6px 12px' }}
          />
          {onEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => onEdit(project)}
              style={{ padding: isMobile ? '4px 6px' : '6px 12px' }}
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
                style={{ padding: isMobile ? '4px 6px' : '6px 12px' }}
              />
            </Popconfirm>
          )}
          {onAssign && (
            <Button
              type="default"
              icon={<TeamOutlined />}
              onClick={() => onAssign(project.id)} 
              style={{ padding: isMobile ? '4px 6px' : '6px 12px' }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <Table
        dataSource={projects}
        columns={columns}
        rowKey="id"
        pagination={false}
        scroll={{ x: 600 }} 
      />
    </div>
  );
};

export default ProjectList;
