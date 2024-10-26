import React from 'react';
import { Card, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { ProjectOutlined, UserOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';

const DashboardPage = () => {
  const { role } = useSelector((state) => state.auth);

  return (
    <div className="dashboard-page">
      {/* Dashboard Header */}
      <section className="bg-blue-600 text-white text-center p-6 md:p-10">
        <h1 className="text-2xl md:text-4xl font-bold">Dashboard</h1>
        <p className="mt-2 md:mt-4 text-sm md:text-base">
          Overview of your tasks and projects at a glance
        </p>
      </section>

      {/* Dashboard Content */}
      <section className="py-6 md:py-10 px-4 md:px-0">
        <Row gutter={[16, 16]} justify="center">
          {/* Projects Overview */}
          <Col xs={24} sm={12} md={8}>
            <Link to="/projects">
              <Card
                className="hover:shadow-lg transition-shadow duration-300"
                hoverable
                bodyStyle={{ padding: '16px' }}
              >
                <div className="flex items-center p-2 md:p-4">
                  <ProjectOutlined className="text-2xl md:text-3xl mr-4" />
                  <div>
                    <h3 className="font-bold text-lg md:text-xl">Projects</h3>
                    <p className="text-sm md:text-base">Manage your projects and deadlines</p>
                  </div>
                </div>
              </Card>
            </Link>
          </Col>

          {/* Users Overview (Admin Only) */}
          {role === 'admin' && (
            <Col xs={24} sm={12} md={8}>
              <Link to="/users">
                <Card
                  className="hover:shadow-lg transition-shadow duration-300"
                  hoverable
                  bodyStyle={{ padding: '16px' }}
                >
                  <div className="flex items-center p-2 md:p-4">
                    <UserOutlined className="text-2xl md:text-3xl mr-4" />
                    <div>
                      <h3 className="font-bold text-lg md:text-xl">Users</h3>
                      <p className="text-sm md:text-base">Manage users and roles (Admin Only)</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          )}
        </Row>
      </section>

      {/* Recent Activity */}
      <section className="py-6 md:py-10 px-4 md:px-0">
        <h2 className="text-xl md:text-2xl mb-4 md:mb-6 text-center">Recent Activity</h2>
        <div className="text-center">
          <p className="text-sm md:text-base">No recent activity yet. Start working on your tasks!</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
