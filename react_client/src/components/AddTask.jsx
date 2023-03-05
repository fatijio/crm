import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Divider, Upload, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { addTask } from '../store/slices/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import openNotification from './NotificationComponent';
import axios from 'axios';

const AddTask = ({ openModal }) => {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(1);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.task);
  const { TextArea } = Input;
  const { Option } = Select;

  useEffect(() => {
    const getCategories = async () => {
      const { data } = await axios.get('/api/tasks/categories', { headers: { Authorization: `Bearer ${localStorage.getItem('u-access')}` } });
      setCategories(data);
    }
    getCategories();

  }, []);

  const handleCategory = (choosenCat) => {
    setCategory(choosenCat);
    //console.log('category', choosenCat);
  }

  const normFile = (e) => {
    //console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  // const openNotificationWithIcon = (type, message) => {
  //   if (Array.isArray(message)) {
  //     for (let i = 0; i < message.length; i++) {
  //       notification[type]({
  //         message: message[i],
  //         placement: 'bottomRight',
  //         maxCount: 5,
  //         //description: errorname,
  //       });
  //     }
  //   } else {
  //     notification[type]({
  //       message: message,
  //       placement: 'bottomRight',
  //       maxCount: 5,
  //       //description: errorname,
  //     });
  //   }
  // };

  const handleUpload = (files) => {
    //console.log('fileList', files);
    setFiles(files);
  };

  const addTaskHandler = async () => {
    //e.preventDefault()
    //console.log('addtask', files)
    const formData = new FormData();

    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', category);

    if (files) {
      for (let file of files.fileList) {
        //console.log(file.originFileObj)
        formData.append("files", file.originFileObj);
      }
    }

    //formData.append('files', files.fileList)
    //console.log(formData);
    const setTask = await dispatch(addTask(formData));
    //console.log('addhandler', setTask)
    if (setTask.error) {
      openNotification('error', setTask.payload);
    } else {
      openNotification('success', setTask.payload.msg);
      setTitle('');
      setDescription('');
      setFiles('');
      form.resetFields();
      openModal(false);
    }
  }

  return (
    <>
      <Form
        name="basic"
        labelCol={{
          span: 24,
        }}
        onFinish={addTaskHandler}
        form={form}
      >
        <Form.Item
          label="Заголовок:"
          name="title"
          rules={[
            {
              required: true,
              message: 'Укажите краткое описание задачи',
            },
          ]}
        >
          <Input onChange={(e) => setTitle(e.target.value)} value={title} />
        </Form.Item>

        <Form.Item
          label="Описание:"
          name="description"
          rules={[
            {
              required: true,
              message: 'Опишите подробнее задачу',
            },
          ]}
        >
          <TextArea rows={4} onChange={(e) => setDescription(e.target.value)} value={description} />
        </Form.Item>

        <Form.Item
          label="Категория"
          name="category"
          rules={[
            {
              required: true,
              message: 'Необходимо выбрать категорию',
            },
          ]}
        >
          <Select
            placeholder="Выберите категорию"
            style={{
              width: 180,
            }}
            onChange={handleCategory}
          >
            {categories.map(cat =>
              <Option key={cat.id} value={cat.id}>{cat.name}</Option>
            )}

          </Select>
        </Form.Item>

        <Form.Item
          name="files"
          label="Файлы:"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Файлы: doc, docx, xls, xlsx, jpg, jpeg, png. Размер не более 5 Мб"
        >
          <Upload
            listType="text"
            fileList={files}
            onChange={handleUpload}
            beforeUpload={() => false}
            multiple
          >
            <Button icon={<UploadOutlined />}>Загрузить файлы</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Divider />
          <Button type="primary" htmlType="submit" size="large" loading={loading}>
            Создать
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default AddTask
