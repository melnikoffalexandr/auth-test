import styles from './styles.module.css';
import { Button, Card, Form, Input, Space, message, Flex } from 'antd';
import type { FormProps } from 'antd';
import { useState } from 'react';
import { db, FieldType } from '../../../api/api.ts';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [formType, setFormType] = useState<'registration' | 'login'>('login');
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (params: { type: 'success' | 'error'; content: string }) => {
    const { type, content } = params;
    messageApi.open({ type, content, duration: 3, className: styles.message });
  };

  const onSubmit: FormProps<FieldType>['onFinish'] = async ({ name, email, password }) => {
    if (formType === 'registration') {
      try {
        const { status } = await db.post('/users', { name, email, password });

        if (status === 201) {
          setFormType('login');
          showMessage({
            type: 'success',
            content: `${name} регистрация прошла успешно, теперь вы можете авторизоваться`,
          });
          form.resetFields();
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (formType === 'login') {
      try {
        const { status, data } = await db.get(`/users?email=${email}`);
        const user = data[0];

        if (status === 200 && user?.password === password) {
          db.patch(`users/${user.id}`, { auth: true });
          navigate(`dashboard?userId=${user.id}`);
        }

        showMessage({
          type: 'error',
          content: `E-mail или пароль указаны не верно, попробуйте ещё раз`,
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onError: FormProps<FieldType>['onFinishFailed'] = ({ values }) => {
    const { name, email, password } = values;
    if (!name && formType === 'registration') {
      showMessage({
        type: 'error',
        content: 'Введите имя для регистрации',
      });
    }
    if (!email) {
      showMessage({
        type: 'error',
        content: `Введите адрес электронной почты для ${formType === 'registration' ? 'регистрации' : 'авторизации'}`,
      });
    }
    if (!password) {
      showMessage({
        type: 'error',
        content: `Введите пароль для ${formType === 'registration' ? 'регистрации' : 'авторизации'}`,
      });
    }
  };

  return (
    <Space className={styles.root} direction="vertical" size="middle">
      {contextHolder}
      <Card title={formType === 'registration' ? 'Регистрация' : 'Вход'}>
        <Form
          form={form}
          labelCol={{ span: 6 }}
          labelAlign="left"
          wrapperCol={{ span: 20 }}
          onFinish={onSubmit}
          onFinishFailed={onError}
          autoComplete="off">
          <Space direction="vertical">
            <Form.Item<FieldType>
              label="Имя"
              name="name"
              rules={[{ required: formType === 'registration', message: '' }]}
              hidden={formType === 'login'}>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="E-mail" name="email" rules={[{ required: true, message: '' }]}>
              <Input />
            </Form.Item>
            <Form.Item<FieldType> label="Пароль" name="password" rules={[{ required: true, message: '' }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item label={null}>
              <Button type="primary" htmlType="submit">
                {formType === 'registration' ? 'Зарегистрироваться' : 'Войти'}
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </Card>
      <Flex justify="flex-start">
        <Button
          color="primary"
          variant="text"
          onClick={() => {
            setFormType('registration');
          }}>
          Регистрация
        </Button>
        <Button
          color="primary"
          variant="text"
          onClick={() => {
            setFormType('login');
          }}>
          Вход
        </Button>
      </Flex>
    </Space>
  );
}

export default Auth;
