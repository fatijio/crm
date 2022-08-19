import React from 'react';
import { Button, Input, Row, Col, Form, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchLogin } from '../../store/slices/authSlice';

export default function AuthPage() {
    const dispatch = useDispatch();
    /*const onLoginSubmit = async () => {
        await dispatch(fetchLogin([email, password]));
    }*/

    const onFinish = async (event) => {
        const result = await dispatch(fetchLogin([event.email, event.password]));
        if (result.error) {
            showNotification('error', result.payload);
        }
    }

    const showNotification = (type, msg) => {
        notification[type]({
            message: msg,
        });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
            <Col span={4}>
                <h1 className="title_auth">Авторизация</h1>
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Введите ваш email',
                            },
                        ]}
                        initialValue="admin1@yandex.ru"

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Введите пароль',
                            },
                        ]}
                        initialValue="Qq1234567"
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Войти
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row >

    )
}