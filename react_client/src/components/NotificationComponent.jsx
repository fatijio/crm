import { notification } from 'antd';

const OpenNotification = ({type, message, detail}) => {
  // if (Array.isArray(message)) {
  //   for (let i = 0; i < message.length; i++) {
  //     notification[type]({
  //       message: message[i],
  //       description: detail,
  //     });
  //   }
  // } else {
    notification[type]({
      message: message,
      description: detail,
    });
  //}
};

//openNotificationWithIcon(tp = 'error', msg = 'empty');

export default OpenNotification;