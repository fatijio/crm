import { UserOutlined } from '@ant-design/icons';
import { Avatar, Badge } from 'antd';
import React from 'react';

const TopNav = () => {
    return (
        <span className="avatar-item">
            <Badge count={1}>
                <Avatar shape="square" icon={<UserOutlined />} />
            </Badge>
        </span>
    )
}

export default TopNav;