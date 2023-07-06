import { Avatar, List, Skeleton, Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

const count = 10;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const Users = () => {
<<<<<<< Updated upstream
=======

  const dispatch = useDispatch();
  const { loading, users } = useSelector(state => state.user);
>>>>>>> Stashed changes


  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [list, setList] = useState([]);
  useEffect(() => {
<<<<<<< Updated upstream
    fetch(fakeDataUrl)
      .then((res) => res.json())
      .then((res) => {
        setInitLoading(false);
        setData(res.results);
        setList(res.results);
      });
=======
    dispatch(getUsers());
>>>>>>> Stashed changes
  }, []);

  return (
    <>
      <Row justify="space-between">
        <Col lg={16}><Typography.Title level={3}>Пользователи</Typography.Title></Col>
      </Row>
      <List
        className="demo-loadmore-list"
        loading={initLoading}
        itemLayout="horizontal"

        dataSource={list}
        renderItem={(item) => (
          <List.Item
            actions={[<a key="list-loadmore-edit">Редактировать</a>, <a key="list-loadmore-more">Деактивировать</a>]}
          >
            <Skeleton avatar title={false} loading={item.loading} active>
              <List.Item.Meta
<<<<<<< Updated upstream
                avatar={<Avatar src={item.picture.large} />}
                title={<a href="https://ant.design">{item.name?.last}</a>}
                description={`ООО Молочный завод, Директор: ${item.name?.last}, телефон: +7 495 001 657 15`}
=======
                avatar={<Avatar src={'/'} />}
                title={<Link to={`profile\\${item.id}`}>{item.name} {item.middleName} {item.lastName} - {item.published ? 'Активен' : 'Деактивирован'}</Link>}
                description={`${item.city}, ${item.post}: ${item.profession}, ${item.phone}`}
>>>>>>> Stashed changes
              />
              <div>Клиент по договору</div>
            </Skeleton>
          </List.Item>
        )}
      />
    </>
  )
}

export default Users;