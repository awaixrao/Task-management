import React, { useEffect, useState } from 'react';
import { Modal, Input, List, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/userSlice'; 

const TaskAssignmentModal = ({ visible, onClose, onSubmit, taskId }) => {
  const dispatch = useDispatch();
  const { users, loading, totalUsers } = useSelector((state) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [userIds, setUserIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchUsers({ search: searchTerm, page: currentPage, limit: 10 }));
    }
  }, [dispatch, searchTerm, currentPage]);

  useEffect(() => {
    if (!visible) {
      setSearchTerm('');
      setUserIds([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [visible]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // Handle scrolling for pagination
  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleUserToggle = (userId) => {
    setUserIds((prev) => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // Handle submission
  const handleSubmit = () => {
    onSubmit({ taskId, userIds }); 
    onClose(); 
  };

  return (
    <Modal
      title="Assign Users to Task"
      open={visible}
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
      <div
        style={{ height: '300px', overflowY: 'auto' }}
        onScroll={handleScroll}
      >
        {loading && currentPage === 1 && <Spin />}
        <List
          dataSource={users}
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
        {loading && currentPage > 1 && <Spin />}
      </div>
    </Modal>
  );
};

export default TaskAssignmentModal;
