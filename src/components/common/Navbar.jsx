// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {  UserOutlined,  DashboardOutlined, 
} from '@ant-design/icons';

const { Header } = Layout;

const Navbar = () => {
  const menuItems = [
    {
        key: '1',
        icon: <DashboardOutlined />, // Icon for Dashboard
        label: <Link to="/dashboard">Dashboard</Link>,
      },
    {
      key: '2',
      icon: <UserOutlined />,
      label: <Link to="/login">Login</Link>,
    },
  
  ];

  return (
    <Header className="bg-gray-800">
      <div className="logo">
        <h1 className="text-white flex justify-start">Task Manager</h1>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['1']}
        items={menuItems}
        style={{ float: 'right' }} // Align menu items to the right
      />
    </Header>
  );
};

export default Navbar;
