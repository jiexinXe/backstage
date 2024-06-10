import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Typography, Avatar, Dropdown, message } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  LockOutlined,
  MenuOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { SubMenu } = Menu;

const iconMap = {
  HomeOutlined: <HomeOutlined />,
  ShoppingOutlined: <ShoppingOutlined />,
  OrderedListOutlined: <OrderedListOutlined />,
  TeamOutlined: <TeamOutlined />,
  UserOutlined: <UserOutlined />,
  SettingOutlined: <SettingOutlined />,
  LogoutOutlined: <LogoutOutlined />,
  LockOutlined: <LockOutlined />,
  MenuOutlined: <MenuOutlined />,
  DatabaseOutlined: <DatabaseOutlined />,
};

const AdminPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedMenuData = JSON.parse(localStorage.getItem('menuList')) || [];
    setMenuData(storedMenuData);
  }, []);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      message.success('您已退出登录');
      navigate('/login');
    } else {
      navigate(`/adminPage${key}`);
    }
  };

  const renderMenuItems = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <SubMenu key={item.key} icon={iconMap[item.frontIcon]} title={item.name}>
            {renderMenuItems(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item key={`/${item.frontName}`} icon={iconMap[item.frontIcon]}>
          {item.name}
        </Menu.Item>
      );
    });
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
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" onClick={handleMenuClick}>
          {renderMenuItems(menuData)}
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={styles.header}>
          <Title level={3} style={styles.title}>Admin Dashboard</Title>
          <Dropdown overlay={menu} placement="bottomRight">
            <Avatar style={styles.avatar} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Admin</Breadcrumb.Item>
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

export default AdminPage;
