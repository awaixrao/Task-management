// src/pages/Dashboard/DashboardPage.jsx
import React from 'react';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { ProjectOutlined, UserOutlined, ContainerOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

const DashboardPage = () => {
  const { role } = useSelector((state) => state.auth); // Get the role from Redux state

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <section className="hero bg-blue-600 text-white text-center p-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-4">Overview of your tasks and projects at a glance</p>
      </section>

      {/* Dashboard Content */}
      <section className="dashboard-content py-10">
        <Row gutter={[16, 16]}>
          {/* Projects Overview */}
          <Col xs={24} md={8}>
            <Link to="/projects">
              <Card className="dashboard-card" hoverable>
                <div className="card-content flex items-center">
                  <ProjectOutlined className="text-3xl mr-4" />
                  <div>
                    <h3 className="font-bold text-lg">Projects</h3>
                    <p>Manage your projects and deadlines</p>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          {/* Tasks Overview */}
          <Col xs={24} md={8}>
            <Link to="/tasks">
              <Card className="dashboard-card" hoverable>
                <div className="card-content flex items-center">
                  <ContainerOutlined className="text-3xl mr-4" />
                  <div>
                    <h3 className="font-bold text-lg">Tasks</h3>
                    <p>View and manage your tasks</p>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          {/* Users Overview (Admin Only) */}
          {role === 'admin' && ( // Conditionally render this section based on role
            <Col xs={24} md={8}>
              <Link to="/users">
                <Card className="dashboard-card" hoverable>
                  <div className="card-content flex items-center">
                    <UserOutlined className="text-3xl mr-4" />
                    <div>
                      <h3 className="font-bold text-lg">Users</h3>
                      <p>Manage users and roles (Admin Only)</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          )}
        </Row>
      </section>

      {/* Recent Activity */}
      <section className="recent-activity py-10">
        <h2 className="text-2xl mb-6 text-center">Recent Activity</h2>
        {/* This can be a list of recent tasks, comments, or project updates */}
        <div className="activity-list">
          <p>No recent activity yet. Start working on your tasks!</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
