import { notification } from 'antd';

const GlobalMessage = ({type, message, detail}) => {
  notification[type]({
    message: message,
    description: detail,
  });
};

//openNotificationWithIcon(tp = 'error', msg = 'empty');

export default GlobalMessage;