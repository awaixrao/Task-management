// pages/Dashboard/DashboardPage.js
import React from 'react';
import { Layout } from 'antd';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import Footer from '../../components/common/Footer';
import Dashboard from '../../components/Dashboard'; // Import your actual Dashboard component here

const { Content } = Layout; // Destructure Content from Layout

const DashboardPage = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout>
        <Sidebar />
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ padding: '24px', margin: 0, minHeight: 280 }}>
            <Dashboard /> 
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DashboardPage;
