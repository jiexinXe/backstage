import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, TreeSelect, message, Switch } from 'antd';
import {
  HomeOutlined,
  ShoppingOutlined,
  OrderedListOutlined,
  TeamOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  MenuOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

const { confirm } = Modal;

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

const initialData = [
  {
    key: '1',
    name: '首页',
    level: '一级',
    frontName: 'home',
    frontIcon: 'HomeOutlined',
    isShow: true,
  },
  {
    key: '2',
    name: '商品',
    level: '一级',
    frontName: 'items',
    frontIcon: 'ShoppingOutlined',
    isShow: true,
  },
  {
    key: '3',
    name: '订单',
    level: '一级',
    frontName: 'orders',
    frontIcon: 'OrderedListOutlined',
    isShow: true,
  },
  {
    key: '4',
    name: '权限',
    level: '一级',
    frontName: '/',
    frontIcon: 'LockOutlined',
    isShow: true,
    children: [
      {
        key: '5',
        name: '用户列表',
        level: '二级',
        frontName: 'userlist',
        frontIcon: 'UserOutlined',
        isShow: true,
      },
      {
        key: '6',
        name: '角色列表',
        level: '二级',
        frontName: 'rolelist',
        frontIcon: 'TeamOutlined',
        isShow: true,
      },
      {
        key: '7',
        name: '菜单列表',
        level: '二级',
        frontName: 'menulist',
        frontIcon: 'MenuOutlined',
        isShow: true,
      },
      {
        key: '8',
        name: '资源列表',
        level: '二级',
        frontName: 'resourcelist',
        frontIcon: 'DatabaseOutlined',
        isShow: true,
      },
    ],
  },
];

const MenuList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('menuList')) || initialData;
    setData(storedData);
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const cancel = () => {
    setEditingKey('');
    setIsModalVisible(false);
    form.resetFields();
  };

  const save = async () => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => editingKey === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        localStorage.setItem('menuList', JSON.stringify(newData));
        setEditingKey('');
        setIsModalVisible(false);
        message.success('编辑成功');
      } else {
        row.key = (newData.length + 1).toString();
        newData.push(row);
        setData(newData);
        localStorage.setItem('menuList', JSON.stringify(newData));
        setEditingKey('');
        setIsModalVisible(false);
        message.success('新增成功');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (key) => {
    confirm({
      title: '确定要删除这条记录吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const newData = data.filter((item) => item.key !== key);
        setData(newData);
        localStorage.setItem('menuList', JSON.stringify(newData));
        message.success('删除成功');
      },
      onCancel() {},
    });
  };

  const add = () => {
    setEditingKey('');
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      key: 'name',
      editable: true,
    },
    {
      title: '菜单级数',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '前端名称',
      dataIndex: 'frontName',
      key: 'frontName',
    },
    {
      title: '前端图标',
      dataIndex: 'frontIcon',
      key: 'frontIcon',
      render: (icon) => iconMap[icon],
    },
    {
      title: '是否显示',
      dataIndex: 'isShow',
      key: 'isShow',
      render: (isShow) => (isShow ? '是' : '否'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              编辑
            </Button>
            <Button
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.key)}
              type="danger"
            >
              删除
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={add}
        style={{ marginBottom: 16 }}
      >
        添加菜单
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        expandable={{
          defaultExpandAllRows: true,
        }}
      />
      <Modal
        title={editingKey ? '编辑菜单' : '新增菜单'}
        visible={isModalVisible}
        onOk={save}
        onCancel={cancel}
      >
        <Form form={form} layout="vertical" name="menuForm">
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[{ required: true, message: '请输入菜单名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="level"
            label="菜单级数"
            rules={[{ required: true, message: '请输入菜单级数!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="frontName"
            label="前端名称"
            rules={[{ required: true, message: '请输入前端名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="frontIcon"
            label="前端图标"
            rules={[{ required: true, message: '请选择前端图标!' }]}
          >
            <TreeSelect
              treeData={[
                { title: 'Home', value: 'HomeOutlined', icon: <HomeOutlined /> },
                { title: 'Shopping', value: 'ShoppingOutlined', icon: <ShoppingOutlined /> },
                { title: 'OrderedList', value: 'OrderedListOutlined', icon: <OrderedListOutlined /> },
                { title: 'Team', value: 'TeamOutlined', icon: <TeamOutlined /> },
                { title: 'User', value: 'UserOutlined', icon: <UserOutlined /> },
                { title: 'Setting', value: 'SettingOutlined', icon: <SettingOutlined /> },
                { title: 'Lock', value: 'LockOutlined', icon: <LockOutlined /> },
                { title: 'Menu', value: 'MenuOutlined', icon: <MenuOutlined /> },
                { title: 'Database', value: 'DatabaseOutlined', icon: <DatabaseOutlined /> },
              ]}
              fieldNames={{ label: 'title', value: 'value' }}
              placeholder="请选择图标"
              treeDefaultExpandAll
              showIcon
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            name="isShow"
            label="是否显示"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuList;
