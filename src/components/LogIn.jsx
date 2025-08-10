import React, { useState } from 'react';
import { App, Button, Card, Checkbox, Col, Form, Input, Row, Modal, Flex } from 'antd';
// import { TfiWrite } from 'react-icons/tfi';
import { ITEM } from '../helpers/colors';
import { LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../services/productService';
import axios from 'axios';
import Loading from './Loading';


const LogIn = () => {


    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const url = `${SERVER_URL}/login`;
            const response = await axios.post(url, {
                email: values.Email,
                password: values.Password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.accessToken) {
                // Store the token in localStorage
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('refreshToken', response.data.refreshToken);


                Modal.success({
                    title: 'ورود موفق',
                    content: 'شما با موفقیت وارد شدید',
                    onOk: () => navigate('/')
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            Modal.error({
                title: 'خطا در ورود',
                content: error.response?.data?.message || 'خطا در ارتباط با سرور'
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? <Loading /> :
                <>
                    <Row data-aos="fade-up">
                        <Col md={{ span: 8, offset: 8 }} xs={24}>
                            <Card title="ورود" style={{ backgroundColor: ITEM, borderRadius: 40 }}>
                                <Form
                                    form={form}
                                    align="right"
                                    name="basic"
                                    labelCol={{ md: 8, xs: 24 }}
                                    wrapperCol={{ md: 16, xs: 24 }}
                                    style={{ maxWidth: 600 }}
                                    initialValues={{ remember: true }}
                                    autoComplete="off"
                                    onFinish={handleSubmit}
                                >
                                    <Form.Item
                                        label="نام کاربری"
                                        name="Email"
                                        rules={[
                                            { required: true, message: 'لطفا نام کاربری خود را وارد کنید!' },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item
                                        label="رمز عبور"
                                        name="Password"
                                        rules={[
                                            { required: true, message: 'لطفا رمز عبور خود را وارد کنید!' },
                                            { min: 6, message: 'رمز عبور باید حداقل ۶ کاراکتر باشد!' }
                                        ]}
                                    >
                                        <Input.Password />
                                    </Form.Item>

                                    <Form.Item name="remember" valuePropName="checked" style={{ textAlign: 'end' }}>
                                        <Checkbox>مرا به یاد داشته باش</Checkbox>
                                    </Form.Item>

                                    <Flex justify="end">
                                        <Button type="primary" htmlType="submit" icon={<LoginOutlined />}>
                                            ورود
                                        </Button>
                                    </Flex>
                                </Form>
                            </Card>
                        </Col>
                    </Row>
                </>
            }
        </>
    )
}

export default LogIn;
