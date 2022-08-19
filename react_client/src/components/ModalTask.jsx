import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { DiffOutlined } from '@ant-design/icons';
import AddTask from './AddTask';

const ModalTask = () => {
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const showModal = () => {
        setVisible(true);
    };

    const handleOk = async (status) => {
        setConfirmLoading(true);
        if (!status) {
            setVisible(false);
            setConfirmLoading(false);
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOpenModal = (status) => {
        setVisible(status);
    }

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Создать задачу
            </Button>
            <Modal
                title={<><DiffOutlined /> Новая задача</>}
                visible={visible}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={null}
            >
                <AddTask openModal={handleOpenModal} />
            </Modal >
        </>
    );
};

export default ModalTask;