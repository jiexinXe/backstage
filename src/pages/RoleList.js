import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message, Tree } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const initialData = [
  {
    id: 1,
    name: '用户',
    desc: '普通用户，可以浏览商品和下单',
    menu: [1],
    enable: true,
  },
  {
    id: 2,
    name: '管理员',
    desc: '系统管理员，拥有所有管理权限',
    menu: [1, 2, 3, 4],
    enable: true,
  },
  {
    id: 3,
    name: '商品管理员',
    desc: '只能查看及操作商品',
    menu: [2],
    enable: true,
  },
  {
    id: 4,
    name: '订单管理员',
    desc: '只能查看及操作订单',
    menu: [3],
    enable: true,
  },
];

const permissionsOptions = [
  {
    title: '首页',
    key: 1,
  },
  {
    title: '商品',
    key: 2,
  },
  {
    title: '订单',
    key: 3,
  },
  {
    title: '权限',
    key: 4,
    children: [
      { title: '用户列表', key: 41 },
      { title: '角色列表', key: 42 },
      { title: '菜单列表', key: 43 },
      { title: '资源列表', key: 44 },
    ],
  },
];

const RoleList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedRoleData = JSON.parse(localStorage.getItem('roleList')) || initialData;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedData = storedRoleData.map(role => {
      const userCount = users.filter(user => user.roles.includes(role.name)).length;
      return { ...role, userCount };
    });
    setData(updatedData);
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [checkedKeys, setCheckedKeys] = useState([]);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setCheckedKeys(record.menu);
    setEditingKey(record.id);
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
      const index = newData.findIndex((item) => editingKey === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row, menu: checkedKeys });
        setData(newData);
        localStorage.setItem('roleList', JSON.stringify(newData));
        setEditingKey('');
        setIsModalVisible(false);
        message.success('编辑成功');
      } else {
        row.id = (newData.length + 1).toString();
        newData.push({ ...row, menu: checkedKeys });
        setData(newData);
        localStorage.setItem('roleList', JSON.stringify(newData));
        setEditingKey('');
        setIsModalVisible(false);
        message.success('新增成功');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (id) => {
    confirm({
      title: '确定要删除这条记录吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        localStorage.setItem('roleList', JSON.stringify(newData));
        message.success('删除成功');
      },
      onCancel() {},
    });
  };

  const handleSwitchChange = (id, checked) => {
    const newData = data.map((item) => {
      if (item.id === id) {
        return { ...item, enable: checked };
      }
      return item;
    });
    setData(newData);
    localStorage.setItem('roleList', JSON.stringify(newData));
  };

  const add = () => {
    setEditingKey('');
    form.resetFields();
    setCheckedKeys([]);
    setIsModalVisible(true);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: '是否启用',
      dataIndex: 'enable',
      key: 'enable',
      render: (enable, record) => (
        <Switch checked={enable} onChange={(checked) => handleSwitchChange(record.id, checked)} />
      ),
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
            <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} type="danger">
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
        添加角色
      </Button>
      <Table columns={columns} dataSource={data} pagination={false} rowKey="id" />
      <Modal
        title={editingKey ? '编辑角色' : '新增角色'}
        visible={isModalVisible}
        onOk={save}
        onCancel={cancel}
        width={800}
      >
        <Form form={form} layout="vertical" name="roleForm">
          <Form.Item
            name="name"
            label="角色名称"
            rules={[{ required: true, message: '请输入角色名称!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="desc"
            label="描述"
            rules={[{ required: true, message: '请输入描述!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="enable"
            label="是否启用"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="menu"
            label="菜单权限"
          >
            <Tree
              checkable
              checkedKeys={checkedKeys}
              onCheck={onCheck}
              treeData={permissionsOptions}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleList;
