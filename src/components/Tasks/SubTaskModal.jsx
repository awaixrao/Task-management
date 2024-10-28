import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, DatePicker, Select, notification, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createTask, updateTask, deleteTask, fetchSubtasks } from '../../features/tasks/taskSlice';
import moment from 'moment';

const { Option } = Select;

const SubtaskModal = ({ open, onClose, taskId }) => {
    const dispatch = useDispatch();
    const { id: projectId } = useParams();
    const userRole = useSelector((state) => state.auth.user.role);

    const subtasksData = useSelector((state) => state.tasks.subtasks.subtasks);
    const loading = useSelector((state) => state.tasks.loading);
    const [form] = Form.useForm();
    const [editingSubtask, setEditingSubtask] = useState(null);

    useEffect(() => {
        if (open && taskId && projectId) {
            dispatch(fetchSubtasks({ projectId, taskId })).catch((error) => {
                notification.error({ message: "Failed to fetch subtasks", description: error.message });
            });
        }
    }, [open, taskId, projectId, dispatch]);

    const handleFormSubmit = async (values) => {
        try {
            const formattedData = {
                name: values.name,
                description: values.description,
                due_date: values.due_date.format("YYYY-MM-DD"),
                status: values.status,
                parent_id: taskId,
            };

            if (editingSubtask) {
                await dispatch(updateTask({ taskId: editingSubtask.id, taskData: formattedData })).unwrap();
                notification.success({ message: 'Subtask updated successfully.' });
            } else {
                await dispatch(createTask({ projectId, taskData: formattedData }));
                notification.success({ message: 'Subtask created successfully.' });
            }

            form.resetFields();
            setEditingSubtask(null);
            dispatch(fetchSubtasks({ projectId, taskId }));
        } catch (err) {
            handleError(err);
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            await dispatch(deleteTask({ projectId, taskId: subtaskId }));
            notification.success({ message: 'Subtask deleted successfully.' });
            dispatch(fetchSubtasks({ projectId, taskId }));
        } catch (err) {
            handleError(err);
        }
    };

    const handleError = (error) => {
        const errorMessage = error.response?.data?.message || "Failed to perform the operation.";
        notification.error({ message: errorMessage });
    };

    const handleClose = () => {
        onClose();
        setEditingSubtask(null);
        form.resetFields();
    };

    const handleEditClick = (subtask) => {
        setEditingSubtask(subtask);
        form.setFieldsValue({
            ...subtask,
            due_date: moment(subtask.due_date),
        });
    };

    return (
        <Modal title="Manage Subtasks" open={open} onCancel={handleClose} footer={null}>
            {userRole === "admin" && (
                <div className="mb-4 flex justify-end">
                    <Button
                        type="primary"
                        onClick={() => {
                            setEditingSubtask(null);
                            form.resetFields();
                        }}
                    >
                        Add Subtask
                    </Button>
                </div>
            )}

            {userRole === "admin" && (
                <Form form={form} onFinish={handleFormSubmit}>
                    <Form.Item name="name" rules={[{ required: true, message: 'Please input the subtask name!' }]}>
                        <Input placeholder="Subtask Name" />
                    </Form.Item>
                    <Form.Item name="description" rules={[{ required: true, message: 'Please input the subtask description!' }]}>
                        <Input.TextArea placeholder="Subtask Description" />
                    </Form.Item>
                    <Form.Item name="due_date" rules={[{ required: true, message: 'Please select the due date!' }]}>
                        <DatePicker placeholder="Select Due Date" format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item name="status" rules={[{ required: true, message: 'Please select the status!' }]}>
                        <Select placeholder="Select Status">
                            <Option value="todo">To Do</Option>
                            <Option value="in-progress">In Progress</Option>
                            <Option value="testing">Testing</Option>
                            <Option value="hold">On Hold</Option>
                            <Option value="completed">Completed</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingSubtask ? 'Update Subtask' : 'Create Subtask'}
                        </Button>
                        {editingSubtask && (
                            <Button
                                type="default"
                                onClick={() => {
                                    setEditingSubtask(null);
                                    form.resetFields();
                                }}
                                style={{ marginLeft: '10px' }}
                            >
                                Cancel Edit
                            </Button>
                        )}
                    </Form.Item>
                </Form>
            )}
            {loading ? (
                <p>Loading subtasks...</p>
            ) : (
                <List
                    dataSource={Array.isArray(subtasksData) ? subtasksData : []}
                    renderItem={(subtask) => (
                        <List.Item
                            actions={
                                userRole === "admin"
                                    ? [
                                        <Button onClick={() => handleDeleteSubtask(subtask.id)}>Delete</Button>,
                                        <Button onClick={() => handleEditClick(subtask)}>Edit</Button>,
                                    ]
                                    : []
                            }
                        >
                            <List.Item.Meta
                                title={subtask.name}
                                description={
                                    <>
                                        <p>{subtask.description}</p>
                                        <p>Status: {subtask.status}</p>
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
};

export default SubtaskModal;
