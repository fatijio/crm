import React, { useEffect } from 'react'
import { Space, Table, Col, Row, Tag, Typography } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import ModalTask from '../components/ModalTask';
import { getTasks } from '../store/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';

const {Text} = Typography;

const getColumns = (statuses) => {
  return [
  {
    title: 'ID',
    key: 'id',
    dataIndex: 'id',
    sorter: (a, b) => a.id - b.id,
    showSorterTooltip: false,
    width: '3%',
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
=======
import moment from 'moment';
import 'moment/locale/ru';

const { Text } = Typography;

const getColumns = (statuses) => {
  return [
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      sorter: (a, b) => a.id - b.id,
      showSorterTooltip: false,
      width: '4%',
    },
    {
      title: 'Дата создания',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: '14%',
      //sorter: (a, b) => new Date(a.createdAt).toLocaleString() - new Date(b.createdAt).toLocaleString(),
      render: (_, data) => {
        const locaData = new Date(data.createdAt).toLocaleString();
        return (
          <>
            {moment(data.createdAt).local().format('DD.MM.YYYY HH:mm')}
          </>
        )
>>>>>>> Stashed changes

      },
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
<<<<<<< Updated upstream
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
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    width: '10%',
    filters: statuses.map( status => {return {text: status.name, value: status.name}}),
    onFilter: (value, record) => record.status.name.indexOf(value) === 0,
    render: (status) => (
      <Tag icon={(status.id === 2) ? < SyncOutlined spin /> : ' '} color={status.color} >
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
}

const TaskList = () => {
  //const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, tasks, statuses } = useSelector(state => state.task);

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  return (
    <>
      <Row justify="space-between">
        <Col lg={16}><Typography.Title level={3}>Задачи</Typography.Title></Col>
        <Col>
          <ModalTask loading={loading}/>
        </Col>
      </Row>
      <Row>
        <Col lg={24}>
          <Table
            locale="ru"
            columns={getColumns(statuses)}
            dataSource={tasks.empty ? [] : tasks}
            loading={loading}
            size="large"
            onRow={(record, rowIndex) => {
              return {
                onDoubleClick: event => { navigate(`/task/${record.id}`) },
              };
            }}
            pagination={{
              position: ['bottomLeft'],
            }}
            summary={(tasks) => {
              return (
                <>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={24}>
                      Кол-во задач: <Text type="dafault">{tasks.length ? tasks.length : 0}</Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </Col>
      </Row>
      {/*notify && (<OpenNotification type={notify.type} message={notify.message} detail={notify.detail}/>)*/}
    </>
  )
}

export default TaskList;