import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { DiffOutlined, PlusOutlined } from '@ant-design/icons';
import AddTask from './AddTask';

<<<<<<< Updated upstream
const ModalTask = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
=======
const ModalTask = ({ loading }) => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

>>>>>>> Stashed changes
  const showModal = () => {
    setOpen(true);
  };

  const handleOk = async (status) => {
    setConfirmLoading(true);
    if (!status) {
      setOpen(false);
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOpenModal = (status) => {
    setOpen(status);
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        <PlusOutlined />Создать задачу
      </Button>
      <Modal
        title={<><DiffOutlined /> Новая задача</>}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        footer={null}
      >
<<<<<<< Updated upstream
        <AddTask openModal={handleOpenModal} />
=======
        <AddTask openModal={handleOpenModal} handleCancel={handleCancel} />
>>>>>>> Stashed changes
      </Modal >
    </>
  );
};

export default ModalTask;