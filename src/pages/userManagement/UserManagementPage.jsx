import React, { useEffect, useState } from 'react';
import UserList from '../../components/usermanagement/UserList';
import UserForm from '../../components/usermanagement/UserForm';
import { Button, Modal, notification, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../features/users/userSlice';

const UserManagementPage = () => {
  const dispatch = useDispatch();

  const { users, totalUsers, currentPage, pageSize, loading, error } = useSelector((state) => state.users);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formErrors, setFormErrors] = useState(null); 

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: error, 
      });
      setFormErrors(null); 
    }
  }, [error]);

  const handleAddUser = async (newUser) => {
    try {
      await dispatch(createUser(newUser)).unwrap(); 
      notification.success({
        message: 'Success',
        description: 'User added successfully.',
      });
      setModalOpen(false); 
      dispatch(fetchUsers({ page: currentPage, limit: pageSize })); 
    } catch (err) {
      setFormErrors(err.errors); 
    }
  };

  const handleEditUser = async (updatedUser) => {
    if (!editingUser) return; 
    try {
      await dispatch(updateUser({ id: editingUser.id, userData: updatedUser })).unwrap();
      notification.success({
        message: 'Success',
        description: 'User updated successfully.',
      });
      setModalOpen(false); 
      setEditingUser(null); 
      dispatch(fetchUsers({ page: currentPage, limit: pageSize })); 
    } catch (err) {
      setFormErrors(err.errors); 
    }
  };

  const handleDeleteUser = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: () => {
        dispatch(deleteUser(id)).then(() => {
          notification.success({
            message: 'Success',
            description: 'User deleted successfully.',
          });
          dispatch(fetchUsers({ page: currentPage, limit: pageSize })); 
        });
      },
    });
  };

  const handlePageChange = (page) => {
    dispatch(fetchUsers({ page, limit: pageSize }));
  };

  const openAddUserModal = () => {
    setEditingUser(null); 
    setModalOpen(true);
  };

  const openEditUserModal = (user) => {
    setEditingUser(user); 
    setModalOpen(true); 
  };

  const closeModal = () => {
    setModalOpen(false); 
    setEditingUser(null); 
    setFormErrors(null); 
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">User Management</h1>

      {/* Add User Button */}
      <div className="flex justify-end mb-4">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 text-lg rounded transition duration-300 ease-in-out"
          onClick={openAddUserModal}
        >
          Add User
        </Button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {/* Display the list of users */}
          {users.length > 0 ? (
            <>
              <UserList
                users={users} 
                onEdit={openEditUserModal} 
                onDelete={handleDeleteUser} 
              />
              {/* Pagination controls */}
              <div className="flex justify-center mt-4 px-2 md:px-0">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalUsers}
                  onChange={handlePageChange}
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    justifyContent: 'center',
                  }}
                />
              </div>
            </>
          ) : (
            <p>No users found.</p>
          )}

          {/* Modal for adding/editing a user */}
          <Modal
            title={editingUser ? 'Edit User' : 'Add User'}
            open={modalOpen}
            footer={null} 
            onCancel={closeModal}
          >
            <UserForm
              user={editingUser} 
              onSubmit={editingUser ? handleEditUser : handleAddUser} 
              onCancel={closeModal} 
              errors={formErrors} 
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
