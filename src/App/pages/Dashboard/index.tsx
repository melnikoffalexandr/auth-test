import styles from './styles.module.css';
import { Flex } from 'antd';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { db, User } from '../../../api/api.ts';
import UserMenu from '../../components';

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
