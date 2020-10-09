import {notification} from 'antd';

notification.config({
  top: 70,
});

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

export default openNotificationWithIcon;
