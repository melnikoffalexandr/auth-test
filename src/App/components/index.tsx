import { db, FieldType, User } from '../../api/api.ts';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, Dropdown, Form, Input, type MenuProps, message, Modal, Space } from 'antd';
import styles from '../pages/Dashboard/styles.module.css';
import { LoginOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';

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

export default UserMenu;
