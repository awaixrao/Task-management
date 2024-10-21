// src/components/usermanagement/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';

const UserForm = ({ user, onSubmit, onCancel, errors }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // Default role
    is_active: true, // Default to active
  });

  useEffect(() => {
    if (user) {
      setFormData({ ...user }); // Set form data for editing
    } else {
      setFormData({ name: '', email: '', password: '', role: 'user', is_active: true }); // Reset form data for adding
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData); // Pass the form data back to the parent
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Name" required>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter user name"
        />
        {errors?.name && <span style={{ color: 'red' }}>{errors.name.join(', ')}</span>}
      </Form.Item>
      <Form.Item label="Email" required>
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter user email"
        />
        {errors?.email && <span style={{ color: 'red' }}>{errors.email.join(', ')}</span>}
      </Form.Item>
      <Form.Item label="Password" required>
        <Input.Password
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter user password"
        />
        {errors?.password && <span style={{ color: 'red' }}>{errors.password.join(', ')}</span>}
      </Form.Item>
      <Form.Item label="Role" required>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={{ width: '100%', padding: '8px' }}
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </Form.Item>
      <Form.Item label="Is Active">
        <Checkbox
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
        >
          Active
        </Checkbox>
        {errors?.is_active && <span style={{ color: 'red' }}>{errors.is_active.join(', ')}</span>}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {user ? 'Update User' : 'Add User'}
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={onCancel}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
