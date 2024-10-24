import React from 'react';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { ProjectOutlined, UserOutlined, ContainerOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'; 

const DashboardPage = () => {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <section className="bg-blue-600 text-white text-center p-10">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-4">Overview of your tasks and projects at a glance</p>
      </section>

      {/* Dashboard Content */}
      <section className="py-10">
        <Row gutter={[16, 16]}>
          {/* Projects Overview */}
          <Col xs={24} sm={12} md={8}>
            <Link to="/projects">
              <Card className="hover:shadow-lg transition-shadow duration-300" hoverable>
                <div className="flex items-center p-4">
                  <ProjectOutlined className="text-3xl mr-4" />
                  <div>
                    <h3 className="font-bold text-lg">Projects</h3>
                    <p>Manage your projects and deadlines</p>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          

          {/* Users Overview (Admin Only) */}
          {role === 'admin' && (
            <Col xs={24} sm={12} md={8}>
              <Link to="/users">
                <Card className="hover:shadow-lg transition-shadow duration-300" hoverable>
                  <div className="flex items-center p-4">
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
      <section className="py-10">
        <h2 className="text-2xl mb-6 text-center">Recent Activity</h2>
        <div className="text-center">
          <p>No recent activity yet. Start working on your tasks!</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
