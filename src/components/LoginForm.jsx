import React from 'react';
import { Button, Form, Input } from 'antd';
import { Link } from 'react-router-dom';

const LoginForm = ({ onFinish, loading }) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Form
        name="login"
        className="w-96"
        onFinish={onFinish} // Call onFinish passed from the parent
      >
        <h2 className="text-center mb-6 text-xl font-semibold">Login</h2>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
            Log In
          </Button>
        </Form.Item>

        <p className="mt-4 text-center">
          New here? <Link to="/signup" className="text-blue-500">Sign Up</Link>
        </p>
      </Form>
    </div>
  );
};

export default LoginForm;
