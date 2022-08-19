import React from 'react';
import { notification } from 'antd';

const openNotification = (type, message) => {
    if (Array.isArray(message)) {
        for (let i = 0; i < message.length; i++) {
            notification[type]({
                message: message[i],
                //description: errorname,
            });
        }
    } else {
        notification[type]({
            message: message,
            //description: errorname,
        });
    }
};

//openNotificationWithIcon(tp = 'error', msg = 'empty');


export default openNotification;