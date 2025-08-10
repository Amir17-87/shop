import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER_URL } from "../services/productService";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "antd";
import { BACKGROUND, ITEM } from "../helpers/colors";


const HighestPricePage = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        HighPrice: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${SERVER_URL}/Home/GetData`);
                setData(data);
                setLoading(false);
            } catch (error) {
                console.log(error.message);
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return (
        <>
            {loading ? <Loading /> :
                <>
                    <Row data-aos="fade-up" data-aos-anchor-placement="top-center" gutter={[16, 16]}>
                        {data?.HighPrice.map(product => (
                            <Col key={product.Id} md={4} xs={12}>
                                <Link to={`products/${product.Id}`}>
                                    <Card
                                        style={{
                                            backgroundColor: ITEM,
                                            width: '100%',
                                            minHeight: '400px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}
                                        hoverable
                                        cover={
                                            <img
                                                alt={product.Name}
                                                src={product.Image}
                                                style={{
                                                    width: '100%',
                                                    height: '250px',
                                                    backgroundColor: 'white',
                                                    objectFit: 'cover',
                                                    borderRadius: '16px 16px 0 0'
                                                }}
                                            />}
                                    >
                                        <Card.Meta title={product.Name} description={product.Price} />
                                    </Card>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </>
            }
        </>
    )
}

export default HighestPricePage;
