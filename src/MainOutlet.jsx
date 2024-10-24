// src/layouts/MainOutlet.jsx
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom'; 
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

const { Content } = Layout;

const MainOutlet = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
    <Navbar />
    <Layout>
      <Sidebar />
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content style={{ padding: '24px', margin: 0, minHeight: 280 }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  </Layout>
  );
};

export default MainOutlet;
