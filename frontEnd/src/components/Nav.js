import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { LogoutOutlined, ReadOutlined, HomeOutlined } from '@ant-design/icons';

function Nav() {
    return (
        <nav>
            <Menu style={{ textAlign: 'center' }} mode="horizontal" theme="dark">

                <Menu.Item key="mail">
                    <Link to='/screensource'>
                        <HomeOutlined type="home" />
                        sources
                    </Link>
                </Menu.Item>

                <Menu.Item key="test">
                    <Link to='/screenmyarticles'>
                        <ReadOutlined type="read" />
                        My articles
                    </Link>
                </Menu.Item>

                <Menu.Item key="app">
                    <Link to='/'>
                        <LogoutOutlined type="logout" />
                        Logout
                    </Link>
                </Menu.Item>

            </Menu>
        </nav>
    )
}

export default Nav;
