import React, { useEffect } from 'react';
import { Alert, Layout, Avatar, Badge, Row, Col, Dropdown, Menu, Space, Popover } from 'antd';
import { UserOutlined, ImportOutlined, BellOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogout } from '../../store/slices/authSlice';
import { getNotifications, deleteNotification, setNewNotice } from '../../store/slices/notifySlice';

const { Header } = Layout;

const HeaderTemplate = () => {

    const login = useSelector(state => state.auth.login);
    const notifies = useSelector(state => state.notify.messages);
    const dispatch = useDispatch();

    const handleLogout = (event) => {
        event.preventDefault();
        dispatch(fetchLogout());
    }

    useEffect(() => {
        dispatch(getNotifications());
        const eventSource = new EventSource('http://localhost:8080/api/notifications/news', { withCredentials: true });
        eventSource.addEventListener('message', function (e) {
            dispatch(setNewNotice(JSON.parse(e.data)));
            //console.log('message', JSON.parse(e.data));
        }, false);
        return () => {
            //eventSource.removeEventListener("message", handleReceiveMessage);
            eventSource.close();
        };
    }, [dispatch]);

    /* тут будет функция которая обработает события типа message, notice, status и т.д для онлайн передачи
    const handleReceiveMessage = (event) => {
        const eventData = JSON.parse(event.data);
        if (event) {
            setData((data) => data.concat(eventData));
        }
    }*/

    const topMenu = [

        {
            key: '1',
            label: login,
            icon: <UserOutlined />
        },
        {
            key: '2',
            label: (
                <a href="!#" onClick={handleLogout}>
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

    const handleDeleteNotice = (id) => {
        //console.log('id', id)
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
                        <Popover
                            placement="bottomRight"
                            arrowPointAtCenter="true"
                            mouseLeaveDelay="0.3"
                            autoAdjustOverflow="false"
                            content={notifies.map(notice => {
                                return (
                                    <Alert
                                        key={notice.id}
                                        message={notice.message}
                                        description={notice.description}
                                        closable
                                        onClose={() => handleDeleteNotice(notice.id)}
                                        className="notice_item"
                                    />
                                )


                            })}
                            trigger="hover">
                            <Badge className="badge_count" title="" overflowCount={99} count={notifies.length > 0 ? notifies.length : ''}>
                                <BellOutlined
                                    style={{
                                        fontSize: 22,
                                    }}
                                />
                            </Badge>
                        </Popover>

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
        </Header>
    )
}

export default HeaderTemplate;