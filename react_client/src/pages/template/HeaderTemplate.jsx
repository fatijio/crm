import React, { useState, useEffect } from 'react';
import { Alert, Layout, Avatar, Badge, Drawer, Row, Col, Dropdown, Menu, Space } from 'antd';
import { UserOutlined, ImportOutlined, BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogout } from '../../store/slices/authSlice';
import { getNotifications, deleteNotification } from '../../store/slices/notifySlice';

const { Header } = Layout;

const HeaderTemplate = () => {

    const [visible, setVisible] = useState(false);
    const login = useSelector(state => state.auth.login);
    const notifies = useSelector(state => state.notify.messages);
    const dispatch = useDispatch();

    const handleLogout = (event) => {
        event.preventDefault();
        dispatch(fetchLogout());
    }

    useEffect(() => {
        dispatch(getNotifications());
    }, [])

    const topMenu = [

        {
            key: '1',
            label: login,
            icon: <UserOutlined />
        },
        {
            key: '2',
            label: (
                <a target="_blank" rel="noopener noreferrer" href="!#" onClick={handleLogout}>
                    Выйти
                </a>
            ),
            icon: <ImportOutlined />
        }

    ]

    const menu = (
        <Menu
            items={topMenu}
        />
    );

    const showDrawer = () => {
        setVisible(true);
    };
    const onClose = () => {
        setVisible(false);
    };
    const handleDeleteNotice = (id) => {
        console.log('id', id)
        dispatch(deleteNotification(id))
    }

    return (
        <Header
            className="site-layout-sub-header-background"
            style={{
                padding: 0,
            }}
        >
            <Row justify="end">
                <Col span={2}>
                    <Space align="center" size="large">

                        <Badge count={notifies.length > 0 ? notifies.length : ''}>
                            <BellOutlined
                                style={{
                                    fontSize: 20,
                                }}
                                onClick={showDrawer}
                            />
                        </Badge>
                        <Dropdown
                            overlay={menu}
                            placement="bottom"
                            arrow={{
                                pointAtCenter: true,
                            }}
                        >
                            <span className="avatar-item">
                                <Avatar icon={<UserOutlined />} />

                            </span>
                        </Dropdown>
                    </Space>
                </Col>
            </Row>
            <Drawer title="Уведомления" placement="right" onClose={onClose} visible={visible}>
                {notifies.map(notice => {
                    return (
                        <Alert
                            key={notice.id}
                            message={notice.message}
                            closable
                            onClose={() => handleDeleteNotice(notice.id)}
                            className="notice_item"
                        />
                    )


                })}

            </Drawer>

        </Header>
    )
}

export default HeaderTemplate;