import React from 'react';
import { Form, Input, Button } from 'antd';
import { Link } from 'react-router-dom';

const SignUpForm = ({ onSignUp, loading }) => {
  const onFinish = (values) => {
    if (!loading) { // Prevent submitting if already loading
      onSignUp(values); // Call the onSignUp function passed from SignupPage
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <Form name="signup" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input your name!' }]}
        >
          <Input placeholder="Enter your name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} disabled={loading}>
            Sign Up
          </Button>
        </Form.Item>
        <p className="text-center mt-4">
          Already have an account? <Link to="/login" className="text-blue-500">Log In</Link>
        </p>
      </Form>
    </div>
  );
};

export default SignUpForm;
