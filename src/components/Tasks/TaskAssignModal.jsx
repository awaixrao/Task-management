import React, { useEffect, useState } from 'react';
import { Modal, Input, List, Spin, notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../features/users/userSlice';
import { assignUsersToTask } from '../../features/tasks/taskSlice';
import { useParams } from 'react-router-dom';

const TaskAssignmentModal = ({ visible, onClose, taskId }) => {
  const dispatch = useDispatch();
  const { users, loading, totalUsers } = useSelector((state) => state.users);
  const { id: projectId } = useParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (searchTerm) {
      dispatch(fetchUsers({ search: searchTerm, page: currentPage, limit: 10 }));
    }
  }, [dispatch, searchTerm, currentPage]);

  useEffect(() => {
    if (!visible) {
      resetState();
    }
  }, [visible]);

  const resetState = () => {
    setSearchTerm('');
    setSelectedUserId(null);
    setCurrentPage(1);
    setHasMore(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      notification.warning({ message: 'Please select a user to assign.' });
      return;
    }
    
    try {
      console.log("Assigning User to Task:", { projectId, taskId, assignee_id: selectedUserId });
      await dispatch(assignUsersToTask({ projectId, taskId, assignee_id: selectedUserId })).unwrap();
      notification.success({ message: 'User assigned successfully.' });
      onClose();
    } catch (error) {
      notification.error({ message: 'Failed to assign user', description: error.message });
    }
  };

  return (
    <Modal
      title="Assign User to Task"
      open={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Assign"
      cancelText="Cancel"
    >
      <Input
        placeholder="Search users"
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
              onClick={() => handleUserSelect(user.id)}
              style={{ 
                cursor: 'pointer', 
                backgroundColor: selectedUserId === user.id ? '#e6f7ff' : 'transparent' 
              }}
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
