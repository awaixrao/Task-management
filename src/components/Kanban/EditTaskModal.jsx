// src/components/Kanban/EditTaskModal.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select } from 'antd';
import moment from 'moment';

const { Option } = Select;

const EditTaskModal = ({ visible, onClose, onSubmit, task, errors }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (task) {
      form.setFieldsValue({
        name: task.name,
        description: task.description,
        due_date: task.due_date ? moment(task.due_date) : null, // Ensure date is in the correct format
        status: task.status,
      });
    }
  }, [task, form]);

  const handleFinish = (values) => {
    onSubmit(values); // Submit the form values
  };

  return (
    <Modal
      title={task ? "Edit Task" : "Add Task"}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: 'todo' }} // Default value for status
      >
        <Form.Item
          label="Task Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the task name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: 'The due date field is required.' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'The status field is required.' }]}
        >
          <Select>
            <Option value="todo">To Do</Option>
            <Option value="in-progress">In Progress</Option>
            <Option value="testing">Testing</Option>
            <Option value="hold">Hold</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <button type="submit" className="ant-btn ant-btn-primary">
            {task ? 'Update Task' : 'Add Task'}
          </button>
        </Form.Item>
        {errors && (
          <div className="text-red-500">
            {Object.entries(errors).map(([key, value]) => (
              <p key={key}>{value.join(', ')}</p>
            ))}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default EditTaskModal;
