import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, SettingOutlined, TeamOutlined, QuestionCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
const { Sider } = Layout;

const styleItemMenu = {
    fontSize: '20px',
    color: '#0ea5e9'
}

const menuItems = [
    { label: (<Link to="/">Задачи</Link>), icon: < HomeOutlined style={styleItemMenu} />, key: 1, group: 2 },
    { label: (<Link to="/users">Пользователи</Link>), icon: <TeamOutlined style={styleItemMenu} />, key: 2, group: 1 },
    { label: (<Link to="/info">Справка</Link>), icon: <QuestionCircleOutlined style={styleItemMenu} />, key: 3, group: 2 },
    { label: (<Link to="/settings">Настройки</Link>), icon: <SettingOutlined style={styleItemMenu} />, key: 4, group: 1 },
]

const SiderTemplate = ({ group }) => {

    const [collapsed, setCollapsed] = useState(false);

    const checkGroups = () => {
        if (group === 1) {
            return menuItems;
        }
        return menuItems.filter(item => item.group !== 1)

    }

    return (

        <Sider
            //collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            breakpoint="lg"
            onBreakpoint={broken => {
                //console.log(broken);
            }}
            style={{backgroundColor: '#4f5860'}}
        >
            <div className="logo" style={{ minHeight: '80px' }}><img src={logo} alt="crm task logo" /> </div>
            <Menu
                theme="dark"
                mode="inline"
                items={checkGroups()}
                style={{backgroundColor: '#4f5860'}}
            >
            </Menu>
=======
            trigger={collapsed ? <RightOutlined /> : <><LeftOutlined /> Свернуть</>}
            width={240}
        >
            <Layout>
                <Menu
                    theme="light"
                    mode="inline"
                    items={checkGroups()}
                    style={{ backgroundColor: '#fff' }}
                >
                </Menu>
            </Layout>
>>>>>>> Stashed changes
        </Sider>

    )
}

export default SiderTemplate;