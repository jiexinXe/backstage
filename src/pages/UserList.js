import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Option } = Select;

const rolesOptions = ['用户', '管理员', '商品管理员', '订单管理员'];

const UserList = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setData(users);
  }, []);

  // const isEditing = (record) => record.key === editingKey;

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
        localStorage.setItem('users', JSON.stringify(newData));
        setEditingKey('');
        setIsModalVisible(false);
        message.success('编辑成功');
      } else {
        const newUser = {
          ...row,
          key: (newData.length + 1).toString(),
          password: 'User123456',
          addedTime: new Date().toLocaleString(),
          lastLogin: 'N/A',
          isEnabled: true,
        };
        newData.push(newUser);
        setData(newData);
        localStorage.setItem('users', JSON.stringify(newData));
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
        localStorage.setItem('users', JSON.stringify(newData));
        message.success('删除成功');
      },
      onCancel() {},
    });
  };

  const handleSwitchChange = (key, checked) => {
    const newData = data.map((item) => {
      if (item.key === key) {
        return { ...item, isEnabled: checked };
      }
      return item;
    });
    setData(newData);
    localStorage.setItem('users', JSON.stringify(newData));
  };

  const add = () => {
    setEditingKey('');
    form.resetFields();
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: '账号',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '添加时间',
      dataIndex: 'addedTime',
      key: 'addedTime',
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
    },
    {
      title: '是否启用',
      dataIndex: 'isEnabled',
      key: 'isEnabled',
      render: (isEnabled, record) => (
        <Switch checked={isEnabled} onChange={(checked) => handleSwitchChange(record.key, checked)} />
      ),
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => roles.join(', '),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => {
        return (
          <>
            <Button icon={<EditOutlined />} onClick={() => edit(record)} style={{ marginRight: 8 }}>
              编辑
            </Button>
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} type="danger">
              删除
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={add} style={{ marginBottom: 16 }}>
        添加用户
      </Button>
      <Table columns={columns} dataSource={data} pagination={false} rowKey="key" />
      <Modal
        title={editingKey ? '编辑用户' : '新增用户'}
        visible={isModalVisible}
        onOk={save}
        onCancel={cancel}
      >
        <Form form={form} layout="vertical" name="userForm">
          <Form.Item
            name="username"
            label="账号"
            rules={[{ required: true, message: '请输入账号!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱!' }, { type: 'email', message: '请输入有效的邮箱!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="roles"
            label="角色"
            rules={[{ required: true, message: '请选择角色!' }]}
          >
            <Select mode="multiple" placeholder="请选择角色">
              {rolesOptions.map((role) => (
                <Option key={role} value={role}>
                  {role}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="isEnabled"
            label="是否启用"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
