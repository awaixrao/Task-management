import React from 'react';
import { Form, Input, Button } from 'antd';

const NewProjectForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className="new-project-form"
    >
      <Form.Item
        label="Project Title"
        name="title"
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
