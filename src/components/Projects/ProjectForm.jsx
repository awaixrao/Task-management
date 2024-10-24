import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useDispatch } from 'react-redux'; 
import { createProject } from '../../features/projects/projectSlice'; 

const NewProjectForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch(); 

  const onFinish = async (values) => {
    try {
      await dispatch(createProject(values)).unwrap(); 
      message.success('Project created successfully!'); 
      form.resetFields(); 
    } catch (error) {
      message.error('Failed to create project.'); 
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
