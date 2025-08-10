import React, { useState } from 'react';
import { App, Button, Card, Checkbox, Col, Flex, Form, Input, Modal, Row } from 'antd';
import { TfiWrite } from 'react-icons/tfi';
import { ITEM } from '../helpers/colors';
import { SERVER_URL } from '../services/productService';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';


const Register = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { modal } = App.useApp();

    // const SignUp = (User) => {
    //     const url = `${SERVER_URL}/Account/SignUp`;
    //     return axios.post(url, User);
    // }

    const handleSubmit = async (values) => {
        const url = `${SERVER_URL}/Account/SignUp`;
        const r = await axios.post(url, values);
        if (r.data.Success) {
            navigate('/login');
            Modal.success({
                title: 'Success',
                content: r.data.Message,
            });
        } else {
            Modal.error({
                title: 'Error',
                content: r.data.Message,
            });
        }

    };




    return (
        <>
            <Row data-aos="fade-up" style={{ width: '100%' }}>
                <Col md={{ span: 8, offset: 8 }} xs={24}>
                    <Card title="ثبت نام" style={{ backgroundColor: ITEM, borderRadius: 40 }}>
                        <Form
                            form={form}
                            dir="rtl"
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
                                label="نام"
                                name="FullName"
                                rules={[{ required: true, message: 'لطفا نام واقعی خود را وارد کنید!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="نام کاربری"
                                name="UserName"
                                rules={[{ required: true, message: 'لطفا نام کاربری خود را وارد کنید!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="رمز عبور"
                                name="Password"
                                rules={[{ required: true, message: 'لطفا رمز عبور خود را وارد کنید!' }]}
                            >
                                <Input.Password maxLength={8} />
                            </Form.Item>

                            <Form.Item
                                label="تکرار رمز عبور"
                                name="RePassword"
                                rules={[{ required: true, message: 'لطفا رمز عبور خود را تکرار کنید!' }]}
                                dependencies={['Password']}
                            >
                                <Input.Password maxLength={8} />
                            </Form.Item>

                            <Form.Item
                                label="ایمیل"
                                name="Email"
                                rules={[{ required: true, message: 'لطفا ایمیل خود را وارد کنید!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Flex justify="end">
                                <Button type="primary" htmlType="submit" icon={<TfiWrite />}>
                                    ثبت نام
                                </Button>
                            </Flex>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default Register;