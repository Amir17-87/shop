import { Avatar, Card, Col, List, Row } from "antd";
import { useEffect, useState } from "react";
import { findGroup, getProduct } from "../services/productService";
import Loading from "./Loading";
import { Link, useParams } from "react-router-dom";
import { addItem } from "../helpers/tool";
import { ITEM } from "../helpers/colors";

const ViewProductGroups = () => {
    const { productGroupId } = useParams();
    const { productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [productGroup, setProductGroup] = useState({});
    const [error, setError] = useState(null);
    const [product, setProduct] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!productGroupId) return;

            try {
                setLoading(true);
                setError(null);
                const { data: productData } = await getProduct(productId);
                // const { data } = await getProductsByGroup(productGroupId);
                const { data: productGroupData } = await findGroup(productGroupId);
                setProduct(productData);
                setProductGroup(productGroupData);
                console.log('Product Group Data:', productGroupData);
            } catch (error) {
                console.error('Error fetching product group:', error);
                setError(error.message || 'خطا در دریافت اطلاعات گروه محصول');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [productGroupId]);


    return (
        <>
            {loading
                ? <Loading />
                :
                <>
                    <Row>
                        <Col span={24}>
                            <h1>{productGroup.Name}</h1>
                        </Col>
                        <Col md={{ span: 8, offset: 8 }} xs={24}>
                            <Card cover={<img src={productGroup.Image} alt={productGroup.Name} style={{ maxWidth: 500, maxHeight: 800, width: '100%', height: '100%' }} />}></Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} xs={12}>
                            <Link to={`/products/${product.Id}`}>
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
                                        />
                                    }
                                >
                                    <Card.Meta title={product.Name} description={product.Price} />
                                </Card>
                            </Link>
                        </Col>
                    </Row>
                </>}
        </>
    )
}

export default ViewProductGroups;