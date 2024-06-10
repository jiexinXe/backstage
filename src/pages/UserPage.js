import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Typography, Avatar, Dropdown, message } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;

const iconMap = {
  HomeOutlined: <HomeOutlined />,
  ShoppingOutlined: <ShoppingOutlined />,
  OrderedListOutlined: <OrderedListOutlined />,
};

const UserPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const roleList = JSON.parse(localStorage.getItem('roleList')) || [];
    if (currentUser) {
      const userRoles = currentUser.roles;
      const userPermissions = roleList
        .filter(role => userRoles.includes(role.name))
        .flatMap(role => role.menu)
        .filter((value, index, self) => self.indexOf(value) === index); // 去重
      const allMenuItems = [
        { key: '1', name: '首页', icon: 'HomeOutlined' },
        { key: '2', name: '商品', icon: 'ShoppingOutlined' },
        { key: '3', name: '订单', icon: 'OrderedListOutlined' },
      ];
      const userMenuItems = allMenuItems.filter(item => userPermissions.includes(parseInt(item.key)));
      setMenuItems(userMenuItems);
    }
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      message.success('您已退出登录');
      navigate('/login');
    } else {
      const pathMap = {
        '1': 'home',
        '2': 'items',
        '3': 'orders',
      };
      navigate(`/userPage/${pathMap[key] || key}`);
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="setting" icon={<SettingOutlined />}>
        设置
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        退出
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" style={styles.logo} />
        <Menu theme="dark" selectedKeys={[location.pathname.split('/').pop()]} mode="inline" onClick={handleMenuClick}>
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={iconMap[item.icon]}>
              {item.name}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={styles.header}>
          <Title level={3} style={styles.title}>User Dashboard</Title>
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar style={styles.avatar} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>{location.pathname.split('/').pop()}</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>JiexinXe ©2024 Created by 21301027</Footer>
      </Layout>
    </Layout>
  );
};

const styles = {
  logo: {
    height: '32px',
    margin: '16px',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
    background: '#001529',
  },
  title: {
    color: '#fff',
    margin: '0',
  },
  avatar: {
    cursor: 'pointer',
  },
};

export default UserPage;
