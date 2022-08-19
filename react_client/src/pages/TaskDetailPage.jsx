import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { Descriptions, Divider, Input, Form, Button, PageHeader, Avatar, Tooltip, Comment, Upload, Space } from 'antd';
import { UploadOutlined, MessageOutlined, FileOutlined } from '@ant-design/icons';
import * as moment from 'moment';
import 'moment/locale/ru';
import openNotification from '../components/ErrorPopup';
import axios from 'axios'

const { TextArea } = Input;

const Editor = ({ onChange, onSubmit, submitting, value, getMessages }) => (
    <>
        <Form.Item>
            <TextArea rows={4} onChange={onChange} value={value} />
        </Form.Item>
        <Form.Item>
            <Space>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                    Отправить сообщение
                </Button>
                <Upload disabled>
                    <Tooltip title="Отправка файлов находится в разработке">
                        <Button disabled icon={<UploadOutlined />}>Добавить файлы</Button>
                    </Tooltip>
                </Upload>
            </Space>
        </Form.Item>
    </>
);

const TaskDetail = () => {

    const { id } = useParams()
    const userName = useSelector(state => state.auth.login).substr(0, 1);
    //const history = useNavigate()

    //console.log(id);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [created, setCreated] = useState('');
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [messages, setMessages] = useState([]);
    const [files, setFiles] = useState([]);

    const [message, setMessage] = useState('');
    const [sendStatus, setSendStatus] = useState(false);
    //const [error, setError] = useState('');

    useEffect(() => {

        const getTaskDetail = async () => {
            const { data } = await axios.get(`/api/tasks/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` } });
            //console.log('data', data);
            setTitle(data.taskDetail.title);
            setDescription(data.taskDetail.description);
            setCreated(data.taskDetail.createdAt);
            setStatus(data.taskDetail.status.name);
            setCategory(data.taskDetail.category.name);
            setMessages(data.taskMessages);
            if (data.taskDetail.files) {
                setFiles(data.taskDetail.files.split(','));

                //console.log('files', data.taskDetail.files.split(','));

                const convertFiles = () => {
                    const replacedVal = data.taskDetail.files.split(',');
                    const filesList = replacedVal.map(item => {
                        //console.log(item);
                        return { filename: item.replace('filename: ', '') }
                    });

                    //console.log(filesList);
                    setFiles(filesList);
                }
                convertFiles();
            }


            // for reviews
            //setReviews(data.review)
        }
        getTaskDetail()

    }, [id]);

    const handleSendMessage = async () => {
        const messageData = {
            message: message,
            taskId: id
        }
        setSendStatus(true);
        const sendData = await axios.post(`/api/tasks/${id}`, messageData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('u-access')}`,
            }
        })
            .catch((error) => {
                return error.response.data;
            });
        if (sendData.error) {
            openNotification('error', sendData.msg);
            setSendStatus(false);
            return false;
        }
        setMessages([
            ...messages,
            sendData.data
        ])
        setMessage('');
        setSendStatus(false);
    }

    // for test
    const getFile = async (name) => {
        //console.log('file name', name);
        await axios.get(`/api/tasks/files/${name}`, {
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('u-access')}`,
                'Content-type': 'application/octet-stream'
            }
        })
            .then(data => {
                let url = URL.createObjectURL(data.data);
                //setPreview(url.replace('blob:', '').toString());
                let anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = name;
                document.body.append(anchor);
                anchor.style = 'display:none';
                anchor.click();
                anchor.remove();
                URL.revokeObjectURL(url);
                //console.log('url', url.replace('blob:', ''))
            });

    }
    // for test
    const getMoreMessages = async () => {
        const count = 10;
        const { data } = await axios.get(`/api/tasks/${id}/${count}`, { headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` } });
        console.log('getMessages', data);
    }

    return (
        <>
            <div className="site-page-header-ghost-wrapper">
                <PageHeader
                    ghost={false}
                    onBack={() => window.history.back()}
                    title={title}
                >
                    <Descriptions size="small" column={1} bordered>
                        <Descriptions.Item label="Дата создания">{moment(created).local().format('DD.MM.YYYY HH:mm')}</Descriptions.Item>
                        <Descriptions.Item label="Статус">{status}</Descriptions.Item>
                        <Descriptions.Item label="Категория">{category}</Descriptions.Item>
                        <Descriptions.Item label="Описание">
                            {description}
                        </Descriptions.Item>
                        <Descriptions.Item label="Файлы">
                            {!files ? '' : files.map(item => {
                                return (
                                    <div className="file_item" key={item.filename}>
                                        <FileOutlined style={{ fontSize: '2.5em' }} onClick={() => getFile(item.filename)} />
                                        <a href={item.filename}  >
                                            {item.filename}</a>
                                    </div>
                                )
                            })}
                        </Descriptions.Item>
                    </Descriptions>
                    <Divider orientation="left" plain><MessageOutlined /> Сообщения</Divider>
                </PageHeader>

            </div>

            <div className="task_detail_message_block">
                <div className="messages_block">

                    {!messages ? ' ' :

                        messages.map((data) => {
                            let color = '';
                            color = (data.user.fio === 'Менеджер') ? color = '#7cb736' : color = '#57b0ff';
                            return (
                                <div key={data.createdAt + data.id}>
                                    < Comment
                                        author={data.user.fio}
                                        avatar={<Avatar alt={data.user.fio} style={{ backgroundColor: color }} >{data.user.fio.substr(0, 1)}</Avatar>}
                                        className="message_block_single"
                                        content={
                                            <p>
                                                {data.message}
                                            </p>
                                        }
                                        datetime={
                                            <Tooltip title={moment(data.createdAt).local().format('YYYY-MM-DD HH:mm:ss')}>
                                                <span>{moment(data.createdAt).local().fromNow()}</span>
                                            </Tooltip>
                                        }
                                    />
                                </div>
                            )
                        })

                    }

                </div>
                <Divider />
                <Comment
                    avatar={<Avatar style={{ backgroundColor: '#57b0ff' }} alt={userName} >{userName}</Avatar>}
                    content={
                        <Editor
                            onChange={e => setMessage(e.target.value)}
                            onSubmit={handleSendMessage}
                            submitting={sendStatus}
                            value={message}
                            getMessages={getMoreMessages}
                        />
                    }
                />
            </div>
        </>
    )
}

export default TaskDetail
