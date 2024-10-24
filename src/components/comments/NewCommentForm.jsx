import React, { useState } from 'react';
import { Button, Input } from 'antd';
import { notification } from 'antd';

const NewCommentForm = ({ onAdd }) => {
  const [content, setContent] = useState('');

  const handleAddComment = () => {
    if (!content.trim()) {
      notification.error({ message: 'Error', description: 'Comment cannot be empty!' });
      return;
    }
    onAdd(content);
    setContent('');
  };

  return (
    <div className="flex items-center mt-6 bg-white p-4 rounded-lg shadow-md">
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
        autoSize={{ minRows: 2, maxRows: 4 }}
        className="flex-1 rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
        style={{ fontSize: '14px' }} // Slightly smaller font for comment input
      />
      <Button
        type="primary"
        size="small"
        className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
        onClick={handleAddComment}
      >
        Add Comment
      </Button>
    </div>
  );
};

export default NewCommentForm;
