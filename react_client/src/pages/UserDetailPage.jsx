import {
  Col, 
  Row, 
  Typography,
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Upload,
} from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { queryUpdateUser } from '../store/slices/userSlice';
import MessagePopup from '../components/MessageComponent';
import 'moment/locale/ru';

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const UserDetailPage = () => {
  
  const dispatch = useDispatch();
  const formRef = React.useRef(null);  
  const { id, email, name, middleName, lastName, phone, city, post, profession, birthDate, login, group_id, published } = useSelector(state => state.auth.userData);
  const { loading } = useSelector(state => state.user);

  const changeUserData = (formValues) => {
    //console.log('Success:', formValues);
    const formData = new FormData();
    Object.entries(formValues).forEach( field => {
      //console.log('field', field);
      formData.append([field[0]], [field[1]]);
    });

    const newFormData = {};
    for(let [field, value] of formData){
      newFormData[field] = value;
    }

    dispatch(queryUpdateUser({id, newFormData}));
  };

  return (
    <>
      <Row justify="space-between">
        <Col lg={16}><Typography.Title level={3}>{name} {middleName} {lastName}</Typography.Title></Col>
      </Row>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        disabled={loading}
        style={{
          maxWidth: 600,
        }}
        ref={formRef}
        initialValues={{ email, name, middleName, lastName, phone, city, post, profession, birthDate, login, group_id, published}}
        onFinish={changeUserData}
      >
        <Form.Item label="Активность" name="published" valuePropName="checked">
          <Checkbox></Checkbox>
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Имя" name="name">
          <Input prefix={<UserOutlined className="site-form-item-icon" />} />
        </Form.Item>
        <Form.Item label="Фамилия" name="middleName">
          <Input />
        </Form.Item>
        <Form.Item label="Отчество" name="lastName">
          <Input />
        </Form.Item>
        <Form.Item label="Город" name="city">
          <Input />
        </Form.Item>
        <Form.Item label="Телефон" name="phone">
          <Input />
        </Form.Item>
        <Form.Item label="Профессия" name="profession">
          <Input />
        </Form.Item>
        <Form.Item label="Должность" name="post">
          <Input />
        </Form.Item>
        <Form.Item label="Пароль">
          <Input type="password"/>
        </Form.Item>
        <Form.Item label="Группа" name="group_id">
          <Select 
            options={[
              {
                value: 1,
                label: 'Администратор'
              },
              {
                value: 2,
                label: 'Пользователь'
              },
            ]}
          />
        </Form.Item>
        <Form.Item label="Аватар" valuePropName="fileList" getValueFromEvent={normFile}>
          <Upload action="/upload.do" listType="picture-card">
            <div>
              <PlusOutlined />
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Загрузите аватар
              </div>
            </div>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Сохранить</Button>
        </Form.Item>
      </Form>
      <MessagePopup status={loading}/>
    </>
  )
}

export default UserDetailPage;