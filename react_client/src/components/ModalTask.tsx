import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { DiffOutlined, PlusOutlined } from '@ant-design/icons';
import AddTask from './AddTask';

type tModalCreateTask = {
  loading: boolean;
}

const ModalTask = ({ loading }: tModalCreateTask) => {
  const [open, setOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      <Button type="primary" onClick={showModal} disabled={loading}>
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
        <AddTask openModal={handleOpenModal} handleCancel={handleCancel} />
      </Modal >
    </>
  );
};

export default ModalTask;