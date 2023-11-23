import { notification } from 'antd';

//type NotificationType = 'success' | 'info' | 'warning' | 'error';

type tNotification = {
  type?: string;
  message?: string;
  detail?: string;
}

const GlobalMessage = ({ type, message, detail }: tNotification) => {
  console.log('type', type);
  switch (type) {
    case 'success': {
      notification.success({
        message: message,
        description: detail,
      });
      break;
    }
    case 'info': {
      notification.info({
        message: message,
        description: detail,
      });
      break;
    }
    case 'warning': {
      notification.warning({
        message: message,
        description: detail,
      });
      break;
    }
    case 'error': {
      notification.error({
        message: message,
        description: detail,
      });
      break;
    }
  }
  // notification[type]({
  //   message: message,
  //   description: detail,
  // });
  return undefined;
};

//openNotificationWithIcon(tp = 'error', msg = 'empty');

export default GlobalMessage;