import React from 'react';
import { Modal, Form, Input, Switch } from 'antd';

const EditProjectModal = ({ visible, onClose, onSubmit, project }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit({
        ...values,
        is_active: values.is_active === true, // Ensure is_active is boolean
      });
    });
  };

  return (
    <Modal
      title="Edit Project"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form
        form={form}
        initialValues={{ 
          name: project?.name,
          description: project?.description,
          is_active: project?.is_active, // Ensure this is a boolean
        }}
      >
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please input the project name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please input the project description!' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="is_active"
          label="Active"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProjectModal;
