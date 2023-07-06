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
    colorPrimary: '#1677ff',
    colorLink: '#8596a6',
    borderRadius: 4
};
// Global config notification
notification.config({
    placement: 'bottomRight',
    bottom: 50,
    duration: 8,
    maxCount: 5,
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
                        //colorLink: defaultData.colorLink,
                        borderRadius: defaultData.borderRadius,
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