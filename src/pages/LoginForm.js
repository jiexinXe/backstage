import React from 'react';
import { Form, Input, Button, Card, Typography, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const { Title } = Typography;

const LoginForm = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    const { username, password } = values;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
      user.lastLogin = new Date().toLocaleString();
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(user));

      message.success('登录成功');
      if (user.roles.includes('管理员')) {
        navigate('/adminPage');
      } else {
        navigate('/userPage');
      }
    } else {
      message.error('用户名或密码错误');
    }
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const exportLocalStorage = () => {
    const localStorageData = JSON.stringify(localStorage);
    navigator.clipboard.writeText(localStorageData).then(() => {
      message.success('localStorage 信息已复制到剪贴板');
    });
  };

  const importLocalStorage = () => {
    const importedData = prompt('请粘贴导入的数据:');
    if (importedData) {
      try {
        const parsedData = JSON.parse(importedData);
        for (const key in parsedData) {
          localStorage.setItem(key, parsedData[key]);
        }
        message.success('localStorage 信息已成功导入!');
      } catch (error) {
        message.error('导入的数据格式有误');
      }
    } else {
      message.warning('请粘贴有效的数据');
    }
  };

  return (
    <div style={styles.container}>
      <div className="loader" style={styles.loader}></div>
      <Card style={styles.card}>
        <div style={styles.iconContainer}>
          <UserOutlined style={styles.icon} />
        </div>
        <Title level={2} style={styles.systemTitle}>信息管理系统</Title>
        <Title level={3} style={styles.title}>登录</Title>
        <Form name="login" onFinish={onFinish} style={styles.form}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
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
                <Button type="primary" htmlType="submit" style={styles.button}>登录</Button>
              </Col>
              <Col span={12}>
                <Button type="default" onClick={goToRegister} style={styles.button}>注册</Button>
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
    backgroundImage: 'url("https://via.placeholder.com/1920x1080")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    gap: '50px', // 增加间隔
  },
  loader: {
    flex: '0 0 auto', // 确保左侧动画占据固定空间
  },
  card: {
    width: '400px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    textAlign: 'center',
    flex: '0 0 auto', // 确保表单占据固定空间
  },
  cubes: {
    flex: '0 0 auto', // 确保右侧动画占据固定空间
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

export default LoginForm;
