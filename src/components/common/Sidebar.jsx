import React, { useState } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  ProjectOutlined, 
  ContainerOutlined, 
  UserOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  ProfileOutlined 
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Define the menu items
  const menuItems = [
    {
      key: '1',
      icon: <ProjectOutlined />,
      label: <Link to="/projects">Projects</Link>,
    },
    {
      key: '2',
      icon: <ContainerOutlined />,
      label: <Link to="/tasks">Tasks</Link>,
    },
    {
      key: '3',
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: '5',
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
  ];

  return (
    <Sider
      width={collapsed ? 80 : 250}
      className="bg-gray-200"
      collapsible
      collapsed={collapsed}
      onCollapse={toggleSidebar}
    >
      <div className="logo">
        <h2 className={`text-center p-4 ${collapsed ? 'hidden' : ''}`}>Task Manager</h2>
      </div>
      <Button
        type="primary"
        onClick={toggleSidebar}
        style={{ marginBottom: 16, width: '100%' }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        mode="inline"
        selectedKeys={[menuItems.find(item => item.label.props.to === location.pathname)?.key]} // Highlight the active link
        items={menuItems}  // Use items instead of mapping manually
      />
    </Sider>
  );
};

export default Sidebar;
