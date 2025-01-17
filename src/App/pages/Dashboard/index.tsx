import styles from './styles.module.css';
import { Avatar, Dropdown, Flex, Form, Input, message, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, SettingOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { db, FieldType, User } from '../../../api/api.ts';

const UserMenu = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (params: { type: 'success' | 'error'; content: string }) => {
    const { type, content } = params;
    messageApi.open({ type, content, duration: 3, className: styles.message });
  };

  const handleOk = () => {
    const { password, newPassword } = form.getFieldsValue();
    if (user.password === password) {
      db.patch(`users/${user.id}`, { password: newPassword });
      setIsModalOpen(false);
      showMessage({
        type: 'success',
        content: `Пароль успешно изменён`,
      });
    } else {
      showMessage({
        type: 'error',
        content: `Старый пароль введён не верно`,
      });
    }
    form.resetFields();
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '2') {
      setIsModalOpen(true);
    }

    if (key === '3') {
      db.patch(`users/${user.id}`, { auth: false });
      navigate('/');
    }
  };

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{
          items: [
            {
              key: '1',
              label: user?.name,
              icon: <UserOutlined />,
              className: styles.userMenu,
            },
            {
              type: 'divider',
            },
            {
              key: '2',
              label: 'Сменить пароль',
              icon: <SettingOutlined />,
            },
            {
              key: '3',
              label: 'Выход',
              icon: <LoginOutlined />,
            },
          ],
          onClick: handleMenuClick,
        }}
        trigger={['click']}
        className={styles.dropdown}>
        <Avatar size="default" icon={<UserOutlined />} />
      </Dropdown>
      <Modal
        title="Изменить пароль"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}>
        <Form form={form} labelCol={{ span: 9 }} wrapperCol={{ span: 18 }} autoComplete="off">
          <Space direction="vertical" size="small">
            <Form.Item<FieldType> label="Старый пароль" name="password" rules={[{ required: true, message: '' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item<FieldType> label="Новый пароль" name="newPassword" rules={[{ required: true, message: '' }]}>
              <Input.Password />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(document.location.search);
      const userId = params.get('userId');
      try {
        const { data } = await db.get(`users/${userId}`);

        if (!data.auth) navigate('/');
        setUser(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className={styles.root}>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Профиль',
            children: (
              <Flex vertical justify="space-between" gap={4}>
                <div>Имя: {user?.name}</div>
                <div>Email: {user?.email}</div>
              </Flex>
            ),
          },
        ]}
        tabBarExtraContent={<UserMenu user={user!} />}
      />
    </div>
  );
}

export default Dashboard;
