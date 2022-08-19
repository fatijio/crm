import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import logo from './../../../src/crm_logo.png';
import { HomeOutlined, ProfileOutlined, SettingOutlined, TeamOutlined, QuestionCircleOutlined } from '@ant-design/icons';
const { Sider } = Layout;

const menuItems = [
    { label: (<Link to="/">Задачи</Link>), icon: < HomeOutlined />, key: 1, group: 2 },
    { label: (<Link to="/users">Пользователи</Link>), icon: <TeamOutlined />, key: 2, group: 1 },
    { label: (<Link to="/info">Справка</Link>), icon: <QuestionCircleOutlined />, key: 3, group: 2 },
    { label: (<Link to="/settings">Настройки</Link>), icon: <SettingOutlined />, key: 4, group: 1 },
]

const SiderTemplate = ({ group }) => {

    const [collapsed, setCollapsed] = useState(false);

    const checkGroups = () => {
        if (group === 1) {
            return menuItems;
        }
        return menuItems.filter(item => item.group != 1)

    }

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            breakpoint="lg"

            onBreakpoint={broken => {
                //console.log(broken);
            }}
        >
            <div className="logo" style={{ minHeight: '80px' }}><img src={logo} alt="crm task logo" /> </div>
            <Menu
                theme="dark"
                mode="inline"
                items={checkGroups()}
            >
            </Menu>
        </Sider>
    )
}

export default SiderTemplate;