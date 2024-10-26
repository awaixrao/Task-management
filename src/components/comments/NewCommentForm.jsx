import React, { useState } from 'react';
import { Button, Input, notification } from 'antd';

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
    <div className="mt-6 bg-white p-4 rounded-lg shadow-md flex flex-col w-full"> {/* Ensure full width */}
      <Input.TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment here..."
        autoSize={{ minRows: 2, maxRows: 4 }}
        className="rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200 mb-4 w-full" // Full width on all screens
        style={{ fontSize: '14px' }} // Slightly smaller font for comment input
      />
      <Button
        type="primary"
        size="large" // Increased button size for better touch targets
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 w-full" // Full width for the button
        onClick={handleAddComment}
      >
        Add Comment
      </Button>
    </div>
  );
};

export default NewCommentForm;
