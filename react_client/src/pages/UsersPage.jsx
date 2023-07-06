import { Avatar, List, Skeleton, Col, Row, Typography } from 'antd';
import React, { useEffect } from 'react';
import { getUsers } from '../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Users = () => {
  
  const dispatch = useDispatch();
  const { loading, users } = useSelector(state => state.user);

  useEffect(() => {
      dispatch(getUsers());
  }, []);

  return (
    <>
      <Row justify="space-between">
        <Col lg={16}><Typography.Title level={3}>Пользователи</Typography.Title></Col>
      </Row>
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        dataSource={users}
        renderItem={(item) => (
          <List.Item
            actions={[<a key="list-loadmore-edit">Редактировать</a>, <a key="list-loadmore-more">Деактивировать</a>]}
          >
            <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                avatar={<Avatar src={'/'} />}
                title={<Link to={`profile`}>{item.name} {item.middleName} {item.lastName} - {item.published ? 'Активен' : 'Деактивирован'}</Link>}
                description={`${item.city}, ${item.post}: ${item.profession}, ${item.phone}`}
              />
              <div>{item.group?.name}</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  )
}

export default Users;