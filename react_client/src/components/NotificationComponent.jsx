import { notification } from 'antd';

<<<<<<< Updated upstream
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
=======
const OpenNotification = ({ type, message, detail }) => {
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
>>>>>>> Stashed changes
};

//openNotificationWithIcon(tp = 'error', msg = 'empty');

export default openNotification;