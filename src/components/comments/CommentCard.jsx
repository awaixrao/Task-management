import React, { useState } from 'react';
import { Button, Card, Avatar, Space, Tooltip, Input, List } from 'antd'; // Added List here
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const CommentCard = ({ comment, onEdit, onDelete, onReply, depth }) => {
  const [replyContent, setReplyContent] = useState('');

  const handleAddReply = () => {
    if (!replyContent.trim()) {
      return;
    }
    onReply(comment.id, replyContent);
    setReplyContent('');
  };

  return (
    <Card
      className={`mb-4 ${depth > 0 ? 'ml-6' : ''} rounded-lg bg-white shadow-sm`}
      style={{
        padding: '10px',
        fontSize: depth > 0 ? '12px' : '14px',
        backgroundColor: depth > 0 ? '#f7f7f7' : '#fff',
      }}
    >
      <Tooltip title="Edit">
        <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(comment)} className="text-blue-500 hover:text-blue-700" />
      </Tooltip>
      <Tooltip title="Delete">
        <Button type="link" icon={<DeleteOutlined />} danger onClick={() => onDelete(comment.id)} className="text-red-500 hover:text-red-700" />
      </Tooltip>
      <span className="text-green-500 hover:text-green-700" onClick={() => onReply(comment.id)}>
        Reply
      </span>

      <List.Item.Meta
        avatar={<Avatar src="https://www.w3schools.com/howto/img_avatar.png" size={depth > 0 ? 'small' : 'default'} />}
        title={<span className="font-semibold">{comment.user?.username || 'Unknown User'}</span>}
        description={
          <Space direction="vertical" className="mt-2">
            <span className="text-gray-700">{comment.content}</span>
            <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
          </Space>
        }
      />

      {/* Reply Input */}
      {depth === 0 && (
        <div className="flex items-center mt-4 bg-gray-50 p-2 rounded-lg shadow-sm">
          <Input.TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply here..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="flex-1 rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200"
            style={{ fontSize: '12px' }} // Smaller font for reply input
          />
          <Button
            type="primary"
            size="small"
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200"
            onClick={handleAddReply}
          >
            Add Reply
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CommentCard;
