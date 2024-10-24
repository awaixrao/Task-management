import React from 'react';
import { List } from 'antd';
import CommentCard from './CommentCard';

const CommentList = ({ comments, onEdit, onDelete, onReply }) => {
  const renderComment = (comment, depth = 0) => (
    <CommentCard
      key={comment.id}
      comment={comment}
      onEdit={onEdit}
      onDelete={onDelete}
      onReply={onReply}
      depth={depth}
    />
  );

  return (
    <List
      dataSource={comments.filter((comment) => comment.parent_id === null)}
      renderItem={(comment) => (
        <div>
          {renderComment(comment)}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 ml-6 border-l-2 border-gray-200 pl-4">
              <h4 className="text-gray-500 text-xs mb-2">Replies</h4>
              {comment.replies.map((reply) => renderComment(reply, 1))}
            </div>
          )}
        </div>
      )}
    />
  );
};

export default CommentList;
