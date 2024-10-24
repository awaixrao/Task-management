// CommentsPage.jsx
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Button, notification, Modal, Input } from 'antd'; // Added Input here
import { fetchComments, addComment, deleteComment, updateComment } from '../../features/comments/commentSlice';
import CommentList from '../../components/comments/CommentList';
import NewCommentForm from '../../components/comments/NewCommentForm';

const CommentsPage = () => {
  const { projectId, taskId } = useParams();
  const dispatch = useDispatch();
  const { comments, loading } = useSelector((state) => state.comments);

  const [editingComment, setEditingComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (projectId && taskId) {
      dispatch(fetchComments({ projectId, taskId }))
        .unwrap()
        .catch((err) => {
          notification.error({ message: 'Error', description: err.message });
        });
    }
  }, [dispatch, projectId, taskId]);

  const refetchComments = async () => {
    try {
      await dispatch(fetchComments({ projectId, taskId })).unwrap();
    } catch (err) {
      notification.error({ message: 'Error', description: 'Failed to refresh comments.' });
    }
  };

  const handleAddComment = async (content) => {
    try {
      await dispatch(addComment({ projectId, taskId, commentData: { content, parent_id: null } })).unwrap();
      refetchComments();
      notification.success({ message: 'Success', description: 'Comment added successfully!' });
    } catch (err) {
      notification.error({ message: 'Error', description: err.message });
    }
  };

  const handleAddReply = async (parentId, content) => {
    try {
      await dispatch(addComment({ projectId, taskId, commentData: { content, parent_id: parentId } })).unwrap();
      refetchComments();
      notification.success({ message: 'Success', description: 'Reply added successfully!' });
    } catch (err) {
      notification.error({ message: 'Error', description: err.message });
    }
  };

  const handleDeleteComment = async (commentId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this comment?',
      onOk: async () => {
        try {
          await dispatch(deleteComment({ projectId, taskId, commentId })).unwrap();
          refetchComments();
          notification.success({ message: 'Success', description: 'Comment deleted successfully!' });
        } catch (err) {
          notification.error({ message: 'Error', description: err.message });
        }
      },
    });
  };

  const handleEditComment = async () => {
    if (!editingComment?.content.trim()) {
      notification.error({ message: 'Error', description: 'Comment text cannot be empty!' });
      return;
    }

    try {
      await dispatch(updateComment({ projectId, taskId, commentId: editingComment.id, commentData: { content: editingComment.content } })).unwrap();
      refetchComments();
      notification.success({ message: 'Success', description: 'Comment updated successfully!' });
      setIsModalOpen(false);
      setEditingComment(null);
    } catch (err) {
      notification.error({ message: 'Error', description: err.message });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-xl shadow-lg max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6 text-center">Comments for Task {taskId}</h1>

      {/* Back to Task Link */}
      <Link to={`/projects/${projectId}/tasks/${taskId}`}>
        <Button type="link" className="mb-4">
          Back to Task
        </Button>
      </Link>

      {/* Comments List */}
      <CommentList
        comments={comments}
        onEdit={(comment) => {
          setEditingComment(comment);
          setIsModalOpen(true);
        }}
        onDelete={handleDeleteComment}
        onReply={handleAddReply}
      />

      {/* New Comment Input */}
      <NewCommentForm onAdd={handleAddComment} />

      {/* Modal for Editing Comment */}
      <Modal
        title="Edit Comment"
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleEditComment}
      >
        <Input.TextArea
          value={editingComment?.content}
          onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default CommentsPage;
