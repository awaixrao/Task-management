// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined } from '@ant-design/icons';
import { logout } from '../../features/auth/AuthSlice'; // Adjust the path to your auth slice

const { Header } = Layout;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); 
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    user && token
      ? {
          key: '2',
          icon: <LogoutOutlined />,
          label: <span onClick={handleLogout}>Logout</span>,
        }
      : null,
  ].filter(Boolean);

  const userMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">
          <UserOutlined /> Profile
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined /> Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="bg-gray-800 flex justify-between items-center p-4">
      <div className="logo">
        <h1 className="text-white">Task Manager</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user && (
          <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Avatar
                src="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg" // Dummy photo URL
                alt="User Avatar"
                style={{ marginRight: '8px' }}
              />
              <span className="text-white">{user.name}</span>
            </div>
          </Dropdown>
        )}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          items={menuItems}
          style={{ marginLeft: '20px' }}
        />
      </div>
    </Header>
  );
};

export default Navbar;
