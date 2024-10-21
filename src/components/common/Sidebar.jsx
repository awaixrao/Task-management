import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  ProjectOutlined, 
  ContainerOutlined, 
  UserOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  ProfileOutlined,
  DashboardOutlined // Import Dashboard icon
} from '@ant-design/icons';
import { useSelector } from 'react-redux'; // Import useSelector for accessing auth state

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem('sidebar-collapsed')) || true;
  });
  
  const location = useLocation();
  const { user } = useSelector((state) => state.auth); // Access user state from Redux

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    // Store the collapsed state in local storage whenever it changes
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  // Define the menu items including the Dashboard
  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />, // Dashboard icon
      label: <Link to="/dashboard">Dashboard</Link>, // Link to Dashboard
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: <Link to="/projects">Projects</Link>,
    },
    {
      key: 'tasks',
      icon: <ContainerOutlined />,
      label: <Link to="/tasks">Tasks</Link>,
    },
    // Conditionally render Users menu item based on role
    user && user.role === 'admin' ? {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    } : null,
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Profile</Link>,
    },
  ].filter(Boolean); // Filter out any null values

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
        selectedKeys={[location.pathname.split('/')[1] || 'dashboard']} // Default to dashboard if path is empty
        items={menuItems.map(item => ({
          ...item,
          key: item.key === 'dashboard' ? 'dashboard' : item.key // Ensure dashboard key is set correctly
        }))} // Use items instead of mapping manually
      />
    </Sider>
  );
};

export default Sidebar;
