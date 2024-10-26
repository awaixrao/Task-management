import React, { useState } from 'react';
import { Button, Card, Avatar, Space, Tooltip, Input, List, Dropdown, Menu } from 'antd'; 
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';

const CommentCard = ({ comment, onEdit, onDelete, onReply, depth }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  
  const handleAddReply = () => {
    if (!replyContent.trim()) {
      return;
    }
    onReply(comment.id, replyContent);
    setReplyContent('');
    setShowReplyInput(false); 
  };

  // Menu for edit, delete, and reply actions
  const menu = (
    <Menu>
      <Menu.Item key="reply" onClick={() => setShowReplyInput(true)}>
        Reply
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => onEdit(comment)}>
        Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => onDelete(comment.id)} danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Card
      className={`mb-4 ${depth > 0 ? 'ml-6' : ''} rounded-lg bg-white shadow-sm`}
      style={{
        padding: '10px',
        fontSize: depth > 0 ? '12px' : '14px',
        backgroundColor: depth > 0 ? '#f7f7f7' : '#fff',
      }}
    >
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

      {/* Three dots menu for actions */}
      <div className="flex justify-between items-center mt-2">
        <Tooltip title="More Options">
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="link" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Tooltip>
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="flex flex-col mt-4 bg-gray-50 p-2 rounded-lg shadow-sm">
          <Input.TextArea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write your reply here..."
            autoSize={{ minRows: 1, maxRows: 4 }}
            className="rounded-md border border-gray-300 focus:border-blue-400 focus:ring focus:ring-blue-100 transition duration-200 mb-2"
            style={{ fontSize: '12px' }} 
          />
          <Button
            type="primary"
            size="small"
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md transition duration-200 w-full" // Full width button on small screens
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
