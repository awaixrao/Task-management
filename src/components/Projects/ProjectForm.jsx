import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux'; // Import useDispatch
import { createProject } from '../../features/projects/projectSlice'; // Import your createProject action

const NewProjectForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch(); // Initialize useDispatch

  const onFinish = async (values) => {
    try {
      await dispatch(createProject(values)).unwrap(); // Dispatch the createProject action
      message.success('Project created successfully!'); // Show success message
      form.resetFields(); // Reset form fields
    } catch (error) {
      message.error('Failed to create project.'); // Show error message
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="new-project-form"
    >
      <Form.Item
        label="Project Name"
        name="name"
        rules={[{ required: true, message: 'Please enter a project title' }]}
      >
        <Input placeholder="Enter project title" />
      </Form.Item>

      <Form.Item
        label="Project Description"
        name="description"
        rules={[{ required: true, message: 'Please enter a project description' }]}
      >
        <Input.TextArea rows={4} placeholder="Enter project description" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Create Project
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NewProjectForm;
