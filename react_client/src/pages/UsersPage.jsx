import { Avatar, Button, List, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat,picture&noinfo`;

const Users = () => {


    const [initLoading, setInitLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);
    useEffect(() => {
        fetch(fakeDataUrl)
            .then((res) => res.json())
            .then((res) => {
                setInitLoading(false);
                setData(res.results);
                setList(res.results);
            });
    }, []);

    return (
        <>
            <h1>Пользователи</h1>
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
                                avatar={<Avatar src={item.picture.large} />}
                                title={<a href="https://ant.design">{item.name?.last}</a>}
                                description={`ООО Молочный завод, Директор: ${item.name?.last}, телефон: +7 495 001 657 15`}
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