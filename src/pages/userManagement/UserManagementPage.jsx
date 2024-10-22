// src/pages/UserManagementPage.jsx
import React, { useEffect, useState } from 'react';
import UserList from '../../components/usermanagement/UserList';
import UserForm from '../../components/usermanagement/UserForm';
import { Button, Modal, notification, Pagination } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, updateUser, deleteUser } from '../../features/users/userSlice';

const UserManagementPage = () => {
  const dispatch = useDispatch();

  // Get the users state from the Redux store
  const { users, totalUsers, currentPage, pageSize, loading, error } = useSelector((state) => state.users);

  // Local state for managing modal visibility and form data
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formErrors, setFormErrors] = useState(null); // For storing form validation errors

  // Fetch users whenever the page or page size changes
  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  // Handle errors globally and notify the user
  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: error, // Display the error message from the state
      });
      setFormErrors(null); // Clear form-specific errors when there is a global error
    }
  }, [error]);

  // Handle adding a new user
  const handleAddUser = async (newUser) => {
    try {
      await dispatch(createUser(newUser)).unwrap(); // Unwrap the promise to catch potential errors
      notification.success({
        message: 'Success',
        description: 'User added successfully.',
      });
      setModalOpen(false); // Close the modal after success
      dispatch(fetchUsers({ page: currentPage, limit: pageSize })); // Refresh user list
    } catch (err) {
      setFormErrors(err.errors); // Set form errors if there are validation issues
    }
  };

  // Handle editing an existing user
  const handleEditUser = async (updatedUser) => {
    if (!editingUser) return; // Make sure there's a user being edited
    try {
      await dispatch(updateUser({ id: editingUser.id, userData: updatedUser })).unwrap();
      notification.success({
        message: 'Success',
        description: 'User updated successfully.',
      });
      setModalOpen(false); // Close the modal after success
      setEditingUser(null); // Clear the editing state
      dispatch(fetchUsers({ page: currentPage, limit: pageSize })); // Refresh user list
    } catch (err) {
      setFormErrors(err.errors); // Set form errors if there are validation issues
    }
  };

  // Handle deleting a user with confirmation
  const handleDeleteUser = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this user?',
      onOk: () => {
        dispatch(deleteUser(id)).then(() => {
          notification.success({
            message: 'Success',
            description: 'User deleted successfully.',
          });
          dispatch(fetchUsers({ page: currentPage, limit: pageSize })); // Refresh user list
        });
      },
    });
  };

  // Handle page change for pagination
  const handlePageChange = (page) => {
    dispatch(fetchUsers({ page, limit: pageSize }));
  };

  // Open the modal for adding a new user
  const openAddUserModal = () => {
    setEditingUser(null); // Ensure there's no user being edited
    setModalOpen(true); // Open the modal
  };

  // Open the modal for editing a selected user
  const openEditUserModal = (user) => {
    setEditingUser(user); // Set the selected user for editing
    setModalOpen(true); // Open the modal
  };

  // Close the modal
  const closeModal = () => {
    setModalOpen(false); // Close the modal
    setEditingUser(null); // Reset the editing state
    setFormErrors(null); // Clear form errors
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

      {/* Display loading indicator */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <>
          {/* Display the list of users */}
          {users.length > 0 ? (
            <>
              <UserList
                users={users} // Pass the user list
                onEdit={openEditUserModal} // Open the edit modal
                onDelete={handleDeleteUser} // Handle user deletion
              />
              {/* Pagination controls */}
              <div className="flex justify-center mt-4">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalUsers}
                  onChange={handlePageChange} // Handle pagination change
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
            footer={null} // We'll handle the modal actions in the form
            onCancel={closeModal}
          >
            <UserForm
              user={editingUser} // Pass the selected user for editing
              onSubmit={editingUser ? handleEditUser : handleAddUser} // Handle form submission
              onCancel={closeModal} // Close modal on cancel
              errors={formErrors} // Pass form errors to the form
            />
          </Modal>
        </>
      )}
    </div>
  );
};

export default UserManagementPage;
