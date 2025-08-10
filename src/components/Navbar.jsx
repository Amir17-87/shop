import { InfoCircleOutlined, LoginOutlined, LogoutOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, Modal, Space } from 'antd';
import { useEffect, useState } from 'react';
import { CiGrid42 } from 'react-icons/ci';
import { FaShop } from "react-icons/fa6";
import { TfiWrite } from 'react-icons/tfi';
import { Link, useNavigate } from 'react-router-dom';
import { FOREGROUND } from '../helpers/colors';
import Content from './Content';
import { FaRegUserCircle } from "react-icons/fa";
import { SERVER_URL } from '../services/productService';
import axios from 'axios';
import { addItem } from '../helpers/tool';
import { RiGeminiLine } from "react-icons/ri";


const { Header } = Layout;

const Navbar = () => {
    const [current, setCurrent] = useState();
    const navigate = useNavigate();
    const onClick = e => {
        if (e.key === '/logout') {
            Modal.confirm({
                title: 'آیا از خروج از حساب کاربری خود مطمئن هستید؟',
                onOk: () => {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    setProfile(null);
                    setCurrent('/');
                    navigate('/');
                }
            });
        } else {
            setCurrent(e.key);
            navigate(e.key);
        }
    };

    const [profile, setProfile] = useState();
    const isLoggedIn = !!profile;


    const getProfile = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken')

            const url = `${SERVER_URL}/Account/GetProfile`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setProfile(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getProfile();
    }, []);

    const items = [



        ...addItem({
            label: profile?.FullName ?? 'کاربر',
            key: '/profile',
            icon: <FaRegUserCircle size={30} />,
            children: [
                {
                    type: 'group',
                    label: 'کاربر',
                    children: [

                        {
                            label: 'سبد خرید',
                            key: '/cart',
                            icon: <ShoppingCartOutlined />,
                        },
                        {
                            label: "خروج از حساب",
                            key: '/logout',
                            icon: <LogoutOutlined />,
                        },
                    ]
                }
            ],
        }, isLoggedIn),
        ...addItem({
            label: "ثبت نام",
            key: '/register',
            icon: <TfiWrite />,

        }, !isLoggedIn),
        ...addItem({
            label: "ورود",
            key: '/login',
            icon: <LoginOutlined />,
        }, !isLoggedIn),
        {
            label: 'محصولات',
            key: '/products',
            icon: <CiGrid42 />,
        },
        // {
        //     label: 'Gemini',
        //     key: '/gemini',
        //     icon: <RiGeminiLine />,
        // },
        {
            label: 'درباره ما',
            key: '/aboutus',
            icon: <InfoCircleOutlined />,
        },
        {
            label: 'تماس با ما',
            key: '/contactus',
            icon: <PhoneOutlined />,
        },
    ];
    return (
        <Header
            style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                width: '100%',
            }}>
            <div className="logo" style={{ color: FOREGROUND, fontWeight: "bolder", marginLeft: "55px" }}>
                <Link to="/">
                    <Space>
                        <FaShop size={25} />
                        فروشگاه ایرانی
                    </Space>
                </Link>
            </div>
            <Menu
                onClick={onClick}
                selectedKeys={[current]}
                theme="light"
                mode="horizontal"
                items={items}
                style={{ flex: 1, minWidth: 0 }}
            />
        </Header>
    );
};
export default Navbar;