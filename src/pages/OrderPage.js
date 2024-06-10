import React, { useState, useEffect } from 'react';
import { ContainerOutlined } from "@ant-design/icons";
import { Button, Table, Modal, message } from "antd";
import axios from 'axios';

const boxStyle = {
  margin: '0 10px',
  padding: 15,
  display: 'flex',
  alignItems: 'center',
  border: '1px solid rgba(128, 128, 128, 0.3)',
  borderRadius: 4,
  fontSize: '16px'
}

const statusMap = {
  0: '未付款',
  1: '未付款',
  2: '未发货',
  3: '已发货',
  4: '已完成',
  5: '已关闭',
  6: '已完成'
}

const OrderPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8081/api/order/all')
      .then(response => {
        if (response.data) {
          setData(response.data);
        } else {
          throw new Error('Failed to fetch orders');
        }
      })
      .catch(err => {
        setError(err.message || 'Error fetching orders');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleViewOrder = (record) => {
    setSelectedOrder(record);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const handleShipOrder = (orderId) => {
    axios.put(`http://localhost:8081/api/order/ship`, null, {
        params: { id: orderId }
      })
      .then(response => {
        if (response.data === "Order shipped successfully.") {
          message.success('订单已发货');
          // 更新订单状态为已发货
          setData(prevData => prevData.map(order =>
            order.id === orderId ? { ...order, status: 3 } : order
          ));
        } else {
          message.error('发货失败');
        }
      })
      .catch(error => {
        message.error('发货失败: ' + (error.message || '未知错误'));
        console.error(error);
      });
  };

  const handleDeleteOrder = (orderId) => {
    axios.delete(`http://localhost:8081/api/order/delete`, {
        params: { id: orderId }
      })
      .then(response => {
        if (response.data.code === 200) {
          message.success('订单已删除');
          // 从订单列表中删除订单
          setData(prevData => prevData.filter(order => order.id !== orderId));
        } else {
          message.error('删除订单失败');
        }
      })
      .catch(error => {
        message.error('删除订单失败: ' + (error.message || '未知错误'));
        console.error(error);
      });
  };

  const columns = [
    {
      title: '编号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: '订单金额',
      dataIndex: 'total_fee',
      key: 'total_fee',
      render: (text) => `¥${(text / 100).toFixed(2)}`,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => statusMap[text] || '未知状态',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => {
        const { status } = record;
        return (
          <span>
            <Button style={{ marginRight: 10 }} onClick={() => handleViewOrder(record)} >查看订单</Button>
            {status === 2 && <Button style={{ marginRight: 10 }} onClick={() => handleShipOrder(record.id)} >订单发货</Button>}
            {(status === 4 || status === 5 || status === 6) && <Button danger onClick={() => handleDeleteOrder(record.id)}>删除订单</Button>}
          </span>
        )
      },
    },
  ];

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='orderPage'>
      <div style={boxStyle}>
        <ContainerOutlined />
        <span style={{ marginLeft: '5px' }}>订单列表</span>
      </div>
      <Table style={{ margin: '20px 10px' }} columns={columns} dataSource={data} />
      <Modal
        title="订单详情"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>关闭</Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <p><strong>订单编号:</strong> {selectedOrder.id}</p>
            <p><strong>创建时间:</strong> {selectedOrder.create_time}</p>
            <p><strong>用户ID:</strong> {selectedOrder.user_id}</p>
            <p><strong>订单金额:</strong> ¥{(selectedOrder.total_fee / 100).toFixed(2)}</p>
            <p><strong>订单状态:</strong> {statusMap[selectedOrder.status]}</p>
            {/* 你可以在这里添加更多的订单详情 */}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default OrderPage;
