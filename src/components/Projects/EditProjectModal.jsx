import React, { useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';

const EditProjectModal = ({ visible, onClose, onSubmit, project }) => {
  const [form] = Form.useForm();

  // Use useEffect to update form values when project prop changes
  useEffect(() => {
    if (project)
       {
      form.setFieldsValue({
        name: project.name,
        description: project.description,
        is_active: project.is_active,
      });
    }
    
  }, [project, form]); // Only run this effect when project or form changes

  const handleOk = () => {
    form.validateFields().then(values => {
      onSubmit({
        ...values,
        is_active: values.is_active === true, // Ensure is_active is a boolean
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
        // We can keep initialValues empty; it will be set on useEffect
        initialValues={{ 
          name: '', // Empty initially
          description: '',
          is_active: false, 
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
