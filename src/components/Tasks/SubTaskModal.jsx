import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Input, notification, List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { createTask, updateTask, deleteTask, fetchSubtasks } from '../../features/tasks/taskSlice'; 

const SubtaskModal = ({ open, onClose, projectId, taskId }) => {
    const dispatch = useDispatch();
    const { subtasks, loading } = useSelector((state) => state.tasks);
    const [form] = Form.useForm();
    const [editingSubtask, setEditingSubtask] = useState(null);

    // Fetch subtasks when modal is opened
    useEffect(() => {
        if (open && taskId) {
            console.log('Fetching subtasks...', { projectId, taskId });
            dispatch(fetchSubtasks({ projectId, taskId }));
        }
    }, [open, taskId, dispatch, projectId]);

    const handleCreateSubtask = async (values) => {
        try {
            await dispatch(createTask({ parent_id: taskId, project_id: projectId, ...values }));
            notification.success({ message: 'Success', description: 'Subtask created successfully.' });
            form.resetFields();
            dispatch(fetchSubtasks({ projectId, taskId }));
        } catch (err) {
            notification.error({ message: 'Error', description: err.message });
        }
    };

    const handleEditSubtask = async (values) => {
        if (!editingSubtask) return;

        try {
            await dispatch(updateTask({ taskId: editingSubtask.id, taskData: { ...values, parent_id: taskId, project_id: projectId } })).unwrap();
            notification.success({ message: 'Success', description: 'Subtask updated successfully.' });
            setEditingSubtask(null);
            form.resetFields();
            dispatch(fetchSubtasks({ projectId, taskId })); 
        } catch (err) {
            notification.error({ message: 'Error', description: err.message });
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            await dispatch(deleteTask({ projectId, taskId: subtaskId }));
            notification.success({ message: 'Success', description: 'Subtask deleted successfully.' });
            dispatch(fetchSubtasks({ projectId, taskId })); 
        } catch (err) {
            notification.error({ message: 'Error', description: err.message });
        }
    };

    const handleClose = () => {
        onClose();
        setEditingSubtask(null);
        form.resetFields(); 
    };

    return (
        <Modal title="Manage Subtasks" open={open} onCancel={onClose} footer={null}>
            <Form
                form={form}
                onFinish={editingSubtask ? handleEditSubtask : handleCreateSubtask}
            >
                <Form.Item name="name" rules={[{ required: true, message: 'Please input the subtask name!' }]}>
                    <Input placeholder="Subtask Name" />
                </Form.Item>
                <Form.Item name="description" rules={[{ required: true, message: 'Please input the subtask description!' }]}>
                    <Input.TextArea placeholder="Subtask Description" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editingSubtask ? 'Update Subtask' : 'Create Subtask'}
                    </Button>
                </Form.Item>
            </Form>
            {loading ? (
                <p>Loading subtasks...</p>
            ) : (
                <List
                    dataSource={Array.isArray(subtasks) ? subtasks : []} 
                    renderItem={(subtask) => (
                        <List.Item
                            actions={[
                                <Button onClick={() => handleDeleteSubtask(subtask.id)}>Delete</Button>,
                                <Button onClick={() => {
                                    setEditingSubtask(subtask);
                                    form.setFieldsValue(subtask);
                                }}>Edit</Button>,
                            ]}
                        >
                            {subtask.name}
                        </List.Item>
                    )}
                />
            )}
        </Modal>
    );
    
};

export default SubtaskModal;
