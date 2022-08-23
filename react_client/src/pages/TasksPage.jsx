import React, { useEffect } from 'react'
import { Space, Table, Col, Row, Tag, Typography } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ModalTask from '../components/ModalTask';
import { getTasks } from '../store/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';

const columns = [
    {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'Дата создания',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '12%',
        render: (_, data) => {
            const locaData = new Date(data.createdAt).toLocaleString();
            return (
                <>
                    {locaData}
                </>
            )

        }
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
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
        render: (category) => (
            category.name
        ),
    },
    {
        title: 'Заголовок',
        key: 'title',
        dataIndex: 'title',
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
    const dispatch = useDispatch();
    const { loading, tasks } = useSelector(state => state.task);

    useEffect(() => {
        const getTasksData = async () => {
            dispatch(getTasks());
        }
        getTasksData()
    }, [dispatch])

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
                    < Table columns={columns} dataSource={tasks.empty ? [] : tasks} loading={loading} size="middle" />
                </Col>
            </Row>
        </>
    )
}

export default TaskList;