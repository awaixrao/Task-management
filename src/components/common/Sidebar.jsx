import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { 
  ProjectOutlined, 
  UserOutlined, 
  MenuFoldOutlined, 
  MenuUnfoldOutlined, 
  ProfileOutlined,
  DashboardOutlined 
} from '@ant-design/icons';
import { useSelector } from 'react-redux';

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    return JSON.parse(localStorage.getItem('sidebar-collapsed')) || true;
  });
  
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: <Link to="/projects">Manage Projects</Link>,
    },
    user && user.role === 'admin' ? {
      key: 'users',
      icon: <UserOutlined />,
      label: <Link to="/users">Manage Users</Link>,
    } : null,
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: <Link to="/profile">Manage Profile</Link>,
    },
  ].filter(Boolean);

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
        selectedKeys={[location.pathname.split('/')[1] || 'dashboard']}
        items={menuItems.map(item => ({
          ...item,
          key: item.key === 'dashboard' ? 'dashboard' : item.key
        }))}
      />
    </Sider>
  );
};

export default Sidebar;
