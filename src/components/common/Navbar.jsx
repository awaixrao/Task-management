import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import { LogoutOutlined, DashboardOutlined, UserOutlined, MenuOutlined } from '@ant-design/icons';
import { logout } from '../../features/auth/AuthSlice';

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
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    user && token
      ? {
          key: 'logout',
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

  const mobileMenu = (
    <Menu>
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          {item.label}
        </Menu.Item>
      ))}
      {user && (
        <Menu.Item key="profile" icon={<UserOutlined />}>
          <Link to="/profile">Profile</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Header className="bg-gray-800 flex justify-between items-center p-4">
      <div className="logo">
        <h1 className="text-white">Task Manager</h1>
      </div>

      {/* Large screen menu */}
      <div className="hidden md:flex items-center">
        {user && (
          <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar
                src="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
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
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          style={{ marginLeft: '20px' }}
        />
      </div>

      {/* Mobile menu */}
      <div className="md:hidden flex items-center">
        <Dropdown overlay={mobileMenu} trigger={['click']} placement="bottomRight">
          <MenuOutlined className="text-white text-2xl cursor-pointer" />
        </Dropdown>
      </div>
    </Header>
  );
};

export default Navbar;
