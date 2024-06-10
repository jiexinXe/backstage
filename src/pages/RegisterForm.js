import React from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const { Title } = Typography;

const RegisterForm = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { username, email, password, name } = values;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some((user) => user.username === username)) {
      message.error('用户名已存在');
      return;
    }

    const newUser = {
      key: (users.length + 1).toString(),
      username,
      name,
      email,
      password,
      addedTime: new Date().toLocaleString(),
      lastLogin: null,
      isEnabled: true,
      roles: ['用户'],
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    message.success('注册成功');
    navigate('/login');
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div className="loader" style={styles.loader}></div> {}
      <Card style={styles.card}>
        <div style={styles.iconContainer}>
          <MailOutlined style={styles.icon} />
        </div>
        <Title level={2} style={styles.systemTitle}>信息管理系统</Title>
        <Title level={3} style={styles.title}>注册</Title>
        <Form name="register" onFinish={onFinish} style={styles.form}>
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名!' }]}>
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 8, message: '密码至少8个字符!' },
              { max: 16, message: '密码最多16个字符!' },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/, message: '密码必须包含大小写字母和数字!' }
            ]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={12}>
                <Button type="primary" htmlType="submit" style={styles.button}>注册</Button>
              </Col>
              <Col span={12}>
                <Button type="default" onClick={goToLogin} style={styles.button}>返回登录</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
      <div className="loop cubes" style={styles.cubes}>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
        <div className="item cubes"></div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: 'url("")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    gap: '50px',
  },
  loader: {
    flex: '0 0 auto',
  },
  card: {
    width: '400px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    textAlign: 'center',
    flex: '0 0 auto',
  },
  cubes: {
    flex: '0 0 auto',
  },
  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  icon: {
    fontSize: '48px',
    color: '#1890ff',
  },
  systemTitle: {
    marginBottom: '24px',
  },
  title: {
    marginBottom: '24px',
  },
  form: {
    width: '100%',
  },
  button: {
    width: '100%',
  },
};

export default RegisterForm;
