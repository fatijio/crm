import { message } from 'antd';
const MessagePopup = ({status, variant}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = () => {
    messageApi.open({
      type: 'loading',
      content: 'Загрузка',
      duration: 0,
    });    
  };

  if(status) {
    showMessage()
  }else{
    //setTimeout(messageApi.destroy, 2500);
    messageApi.destroy();
  }

  return (
    <>
      {contextHolder}
    </>
  );
};
export default MessagePopup;