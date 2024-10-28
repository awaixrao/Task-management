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
    const initialCollapsed = JSON.parse(localStorage.getItem('sidebar-collapsed'));
    return initialCollapsed === null ? true : initialCollapsed;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true); 
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      collapsible={!isMobile} 
      collapsed={collapsed}
      onCollapse={isMobile ? undefined : toggleSidebar} 
    >
      <div className="logo">
        <h2 className={`text-center p-4 ${collapsed ? 'hidden' : ''}`}>Task Manager</h2>
      </div>
      {!isMobile && (
        <Button
          type="primary"
          onClick={toggleSidebar}
          style={{ marginBottom: 16, width: '100%' }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      )}
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
