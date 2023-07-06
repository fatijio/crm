import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
//import 'antd/dist/antd.min.css';
import 'antd/dist/reset.css';
import './index.css';
import { Provider } from 'react-redux';
import { setupStore } from './store';
import { ConfigProvider } from 'antd';
import ru from 'antd/es/locale/ru_RU';
import { notification } from 'antd';

const store = setupStore();

// Settings theme
const defaultData = {
<<<<<<< Updated upstream
    colorPrimary: '#1677ff',
=======
    colorPrimary: '#0ea5e9',
    colorLink: '#0369a1',
    borderRadius: 8,
    fontSize: 15,
    colorBgLayout: '#e8ebef',
>>>>>>> Stashed changes
};
// Global config notification
notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 3,
    maxCount: 3,
});

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <ConfigProvider
                locale={ru}
                theme={{
                    token: {
                        colorPrimary: defaultData.colorPrimary,
<<<<<<< Updated upstream
=======
                        colorLink: defaultData.colorLink,
                        borderRadius: defaultData.borderRadius,
                        fontSize: defaultData.fontSize,
                        colorBgLayout: defaultData.colorBgLayout,
>>>>>>> Stashed changes
                    },
                    components: {

                    }
                }}

            >
                <App tab="home" />
            </ConfigProvider>
        </BrowserRouter >
    </Provider >
);