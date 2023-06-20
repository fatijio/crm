import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router'
import { Descriptions, Divider, Input, Form, Button, Avatar, Tooltip, Upload, Space, Select } from 'antd';
import { Comment } from '@ant-design/compatible';
import { PageHeader } from '@ant-design/pro-layout';
import { UploadOutlined, MessageOutlined, FileOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/ru';
import { openMessageBox } from '../store/slices/messageSlice';
import axios from 'axios'

const { TextArea } = Input;
const { Option } = Select;

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

  const { id } = useParams();
  const userName = useSelector(state => state.auth.login).substr(0, 1);
  const group = useSelector(state => state.auth.group);
  const statuses = useSelector(state => state.task.statuses);
  const chatBlock = useRef();
  const dispatch = useDispatch();

  //const history = useNavigate()
  //console.log(id);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [created, setCreated] = useState('');
  const [currentStatus, setCurrentStatus] = useState({});
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
      setCurrentStatus(data.taskDetail.status);
      setCategory(data.taskDetail.category.name);
      setMessages(data.taskMessages);
      setFiles(data.taskDetail.files);
      /*if (data.taskDetail.files) {
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
      }*/
    }
    getTaskDetail();
  }, [id]);

  useLayoutEffect(() => {
    setTimeout(() => {
      chatBlock.current.scrollTop = chatBlock.current.scrollHeight;
    }, 100)
  }, []);

  const handleSendMessage = async () => {
    const messageData = {
      message: message,
      taskId: id
    }
    if(message.trim() === '') {
      dispatch(openMessageBox({type: 'error', message: 'Сообщение не может быть пустым'}));
      return;
    }
    setSendStatus(true);
    await axios.post(`/api/tasks/${id}`, messageData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('u-access')}`,
      }
    })
      .then((response) => {
        setMessages([
          ...messages,
          response.data
        ])
        setMessage('');
        setSendStatus(false);
      })
      .catch((error) => {
        //OpenNotification('error', error.response.data);
        setSendStatus(false);
      });
  }

  //console.log('Statuses', statuses);
  const handleChangeStatus = async (statusId) => {
    console.log('handleChangeStatus', statusId);
    const data = {
      id: id,
      status_id: statusId
    }
    const updateStatus = await axios.put(`/api/tasks/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('u-access')}`,
        }
      });

    console.log('updateStatus', updateStatus);

    if (updateStatus.data[0] === 1) {
      let newStatus = statuses.filter(item => item.id === statusId);
      setCurrentStatus(...newStatus);
    }
  }

  // download file on client
  const getFile = async (name) => {
    console.log('file name', name);
    await axios.get(`/api/tasks/${id}/${name}`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('u-access')}`,
        'Content-type': 'application/octet-stream'
      },
    })
      .then(res => {
        let url = URL.createObjectURL(res.data);
        //setPreview(url.replace('blob:', '').toString());
        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = name;
        document.body.append(anchor);
        anchor.style = 'display:none';
        anchor.click();
        anchor.remove();

        //console.log('url', url)
        URL.revokeObjectURL(url);
      });

    //return link;
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
            <Descriptions.Item label="Статус">
              {console.log('currentStatus',currentStatus)}
              {group === 1 ?
                <Select
                  value={currentStatus.id}
                  onChange={handleChangeStatus}

                >
                  {statuses.map(status =>
                    <Option key={status.id} value={status.id}>{status.name}</Option>
                  )}

                </Select>
                :
                currentStatus.name
              }
            </Descriptions.Item>
            <Descriptions.Item label="Категория">{category}</Descriptions.Item>
            <Descriptions.Item label="Описание">
              {description}
            </Descriptions.Item>
            <Descriptions.Item label="Файлы">
              {!files ? '' : files.map(item => {
                return (
                  <div className="file_item" key={item.filename}>
                    <div onClick={() => getFile(item.filename)}>
                      <FileOutlined style={{ fontSize: '2em' }} />
                      <span>{item.originalname}</span>
                    </div>
                  </div>
                )
              })}
            </Descriptions.Item>
          </Descriptions>
          <Divider orientation="left" plain><MessageOutlined /> Сообщения</Divider>
        </PageHeader>

      </div>

      <div className="task_detail_message_block">
        <div className="messages_block" ref={chatBlock}>

          {!messages ? ' ' :

            messages.map((data) => {
              let color = '';
              color = (data.user.group_id === 1) ? color = '#7cb736' : color = '#57b0ff';
              return (
                <div key={data.createdAt + data.id}>
                  < Comment
                    author={data.user.name}
                    avatar={<Avatar alt={data.user.name} style={{ backgroundColor: color }} >{data.user.name}</Avatar>}
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
          avatar={<Avatar style={{ backgroundColor: group === 1 ? '#7cb736' : '#57b0ff' }} alt={userName} >{userName}</Avatar>}
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
