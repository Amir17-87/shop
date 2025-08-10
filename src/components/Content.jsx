import { Button, Card, Carousel, Col, Row, ConfigProvider, Input, Space, Flex } from "antd";
import { BACKGROUND, FOREGROUND, ITEM } from "../helpers/colors";
import MySearch from "./Search";
import imgShop from "../assets/img-shop.png";
import imgProduct from "../assets/img-product.png";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineReadMore } from "react-icons/md";
import { SERVER_URL } from "../services/productService";
import faIR from 'antd/locale/fa_IR';
import styles from './Content.module.css';

const contentStyle = {
    margin: 0,
    padding: 40,
    height: '160px',
    backgroundColor: ITEM,
    color: FOREGROUND,
    lineHeight: '30px',
    textAlign: 'right',
    borderRadius: 40,
    direction: 'rtl'
};

const Content = ({ }) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        HighPrice: [],
        LowPrice: []
    });
    const [dataGroup, setDataGroup] = useState({
        RandomGroup: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${SERVER_URL}/Home/GetData`);
                const { data: dataGroup } = await axios.get(`${SERVER_URL}/Home/GetDataGroup`);
                setData(data);
                setDataGroup(dataGroup);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
                setLoading(false);
            }
        }
        fetchData();
    }, []);


    return (
        loading ? <Loading />
            :
            <>
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Card data-aos="fade-up" data-aos-anchor-placement="top-center" style={{ backgroundColor: ITEM, borderRadius: 40 }}>
                            <Row >
                                <Col xs={24} md={12}>
                                    <Flex vertical justify="center" align="start" style={{ height: '100%' }}>

                                        <h1 className={styles.bannerTitle} style={{
                                            fontFamily: 'Capsule',
                                            color: FOREGROUND,
                                            textAlign: "right",

                                            fontWeight: "bolder",
                                            margin: 0
                                        }}>
                                            محصولات رویایی<br /> خود را بخرید
                                        </h1>
                                        <Space style={{ textAlign: "right", width: '100%', justifyContent: 'flex-start' }}>
                                            <Input.Search
                                                placeholder="دنبال چه چیزی می گردید؟"
                                                enterButton
                                                dir="rtl"
                                                style={{
                                                    textAlign: 'right',
                                                    maxWidth: '300px'
                                                }}
                                            />
                                        </Space>

                                    </Flex>
                                </Col>
                                <Col xs={24} md={12} style={{ textAlign: 'left' }}>
                                    <img src={imgShop} alt="img-shop" style={{ width: '100%', height: '100%', maxWidth: '500px', maxHeight: '500px' }} />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
                    <Col md={6} xs={24}>
                        <Card data-aos="fade-up" data-aos-anchor-placement="top-center" style={{ backgroundColor: BACKGROUND, borderRadius: 40, textAlign: "right" }}>
                            <h2>گران ترین محصولات</h2>
                            <p>فروشگاه بی نظیر ایرانی با ارائه بهترین محصولات در کنار شماست.</p>
                            <Link to={`products/highestprice`} >
                                <Button style={{ backgroundColor: ITEM, margin: 20 }}>
                                    <MdOutlineReadMore />
                                    دیدن بیشتر
                                </Button>
                            </Link>
                        </Card>
                    </Col>
                    {data?.HighPrice.slice(0, 3).map(product => (<Col key={product.Id} md={6} xs={24}>
                        <Link to={`products/${product.Id}`}>
                            <Card data-aos="fade-up" data-aos-anchor-placement="top-center" style={{ backgroundColor: BACKGROUND, borderRadius: 40 }}
                                cover={<img src={product.Image} alt={product.Name} width={300} height={400} style={{
                                    width: '100%',
                                    height: '300px',
                                    objectFit: 'cover',
                                    borderRadius: '40px 40px 0 0'
                                }} />}
                            >
                                <Card.Meta title={product.Name} description={product.Price} style={{ backgroundColor: BACKGROUND, borderRadius: 40 }} />
                            </Card>
                        </Link>
                    </Col>))}
                </Row>
                <Row data-aos="fade-up" data-aos-anchor-placement="top-center" gutter={[16, 16]} style={{ marginTop: 20, backgroundColor: ITEM, padding: 20 }}>
                    <Col span={24}>
                        <h2 className={styles.category} style={{ color: FOREGROUND, fontWeight: "bolder" }}>دسته بندی محصولات </h2>
                        <p className={styles.categoryDescription} style={{ color: 'gray' }}>چیزی که میخوای رو از اینجا پیدا کن</p>
                    </Col>
                    {dataGroup?.RandomGroup.map(productsGroup => (<Col key={productsGroup.Id} md={8} xs={24}>
                        <Link to={`productgroups/${productsGroup.Id}`}>
                            <Card data-aos="fade-up" data-aos-anchor-placement="top-center" style={{ backgroundColor: BACKGROUND, borderRadius: 40 }}
                                cover={<img
                                    src={productsGroup.Image}
                                    alt={productsGroup.Name}
                                style={{
                                    width: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '40px 40px 0 0'
                                }}
                            />}
                        >
                            <Card.Meta title={productsGroup.Name} />
                        </Card>
                        </Link>
                    </Col>))}
                </Row>

                <Row data-aos="fade-up" gutter={[16, 16]} style={{ marginTop: 20, backgroundColor: BACKGROUND, padding: 20 }}>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <h1 className={styles.commentTitle} style={{ color: FOREGROUND, fontWeight: "bolder" }}>مشتریان درباره محصولات فروشگاه ایرانی چه نظری دارند؟</h1>
                    </Col>
                </Row>
                <Row data-aos="fade-up" gutter={[16, 16]} style={{ marginTop: 20, backgroundColor: BACKGROUND, padding: 20 }}>
                    <Col span={24}>
                        <div style={{ direction: 'rtl' }}>
                            <Carousel
                                arrows
                                infinite={true}

                                style={{ direction: 'ltr' }}
                            >
                                <div>
                                    <h3 style={contentStyle}>Name</h3>
                                </div>
                                <div>
                                    <h3 style={contentStyle}>Name</h3>
                                </div>
                                <div>
                                    <h3 style={contentStyle}>Name</h3>
                                </div>
                                <div>
                                    <h3 style={contentStyle}>Name</h3>
                                </div>
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </>
    );
};
export default Content;
