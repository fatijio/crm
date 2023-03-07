import React, { useEffect } from 'react'
import { Space, Table, Col, Row, Tag, Typography } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ModalTask from '../components/ModalTask';
import { getTasks } from '../store/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import openNotification from '../components/NotificationComponent';

const columns = [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
    showSorterTooltip: false,
    width: '5%',
  },
  {
    title: 'Дата создания',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: '12%',
    //sorter: (a, b) => new Date(a.createdAt).toLocaleString() - new Date(b.createdAt).toLocaleString(),
    render: (_, data) => {
      const locaData = new Date(data.createdAt).toLocaleString();
      return (
        <>
          {locaData}
        </>
      )

    },
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    filters: [
      {
        text: 'Обработка',
        value: 'Обработка',
      },
      {
        text: 'В работе',
        value: 'В работе',
      },
      {
        text: 'Выполнено',
        value: 'Выполнено',
      },
    ],
    onFilter: (value, record) => record.status.name.indexOf(value) === 0,
    render: (status) => (
      < Tag icon={(status.id === 2) ? < SyncOutlined spin /> : ' '} color={status.color} >
        {status.name}
      </Tag >
    ),
  },
  {
    title: 'Категория',
    dataIndex: 'category',
    key: 'category.id',
    width: '10%',
    render: (category) => (
      category.name
    ),
  },
  {
    title: 'Заголовок',
    key: 'title',
    dataIndex: 'title',
    width: '25%',
    ellipsis: true,
    render: (_, title) => (
      <Space size="middle">
        <Link to={`/task/${title.id}`}>{title.title}</Link>
      </Space >
    ),
  },
  {
    title: 'Описание',
    dataIndex: 'description',
    key: 'description',
    width: '60%',
    ellipsis: true,
    //render: (text) => ({ text }),
  },
  /*{
      title: 'Действия',
      key: 'action',
      render: (_, record) => (
          <Space size="middle">
              <Link to={`/task/edit/${record.id}`}>Редактировать</Link>
          </Space >
      ),
  },*/
];

const TaskList = () => {
  //const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, tasks, error } = useSelector(state => state.task);
  useEffect(() => {
    if (error) {
      openNotification('error', error.message);
    } else {
      dispatch(getTasks());
    }
  }, []);

  return (
    <>
      <Row justify="space-between">
        <Col lg={16}><Typography.Title level={3}>Задачи</Typography.Title></Col>
        <Col>
          <ModalTask />
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <Table
            locale="ru"
            columns={columns}
            dataSource={tasks.empty ? [] : tasks}
            loading={loading}
            size="middle"
            onRow={(record, rowIndex) => {
              return {
                onDoubleClick: event => { navigate(`/task/${record.id}`) },
              };
            }}
            pagination={{
              position: ['bottomLeft'],
            }}
          />
        </Col>
      </Row>
    </>
  )
}

export default TaskList;