// src/components/Tasks/TaskAssignmentModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Input, List, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/userSlice'; // Adjust based on your file structure

const TaskAssignmentModal = ({ visible, onClose, onSubmit, taskId }) => {
  const dispatch = useDispatch();
  const { users, loading, totalUsers } = useSelector((state) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [userIds, setUserIds] = useState([]);

  useEffect(() => {
    if (visible) {
      dispatch(fetchUsers({ page: 1, limit: 10 })); // Fetch users when the modal opens
    }
  }, [dispatch, visible]);

  useEffect(() => {
    if (!visible) {
      setSearchTerm('');
      setUserIds([]);
    }
  }, [visible]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleUserToggle = (userId) => {
    setUserIds((prev) => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    onSubmit({ taskId, userIds });
    onClose(); // Close the modal after submitting
  };

  return (
    <Modal
      title="Assign Users to Task"
      visible={visible} // Ensure this is 'visible'
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Assign"
      cancelText="Cancel"
    >
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div style={{ height: '300px', overflowY: 'auto' }}>
        {loading && <Spin />}
        <List
          dataSource={users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))}
          renderItem={(user) => (
            <List.Item
              onClick={() => handleUserToggle(user.id)}
              style={{ cursor: 'pointer', backgroundColor: userIds.includes(user.id) ? '#e6f7ff' : 'transparent' }}
            >
              {user.name}
            </List.Item>
          )}
        />
        {!loading && totalUsers === 0 && <p>No users found.</p>}
      </div>
    </Modal>
  );
};

export default TaskAssignmentModal;
