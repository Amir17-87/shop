import { Avatar, Card, Col, List, Row } from "antd";
import { useEffect, useState } from "react";
import { getProduct, getProductGroup } from "../services/productService";
import Loading from "./Loading";
import { useParams } from "react-router-dom";
import { addItem } from "../helpers/tool";

const ViewProduct = () => {
    const { productId } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!productId) return;

            try {
                setLoading(true);
                setError(null);
                const { data: productData } = await getProduct(productId);
                setProduct(productData);
                console.log('Product Data:', productData);
            } catch (error) {
                console.error('Error fetching product:', error);
                setError(error.message || 'خطا در دریافت اطلاعات محصول');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [productId]);


    return (
        <>
            {loading
                ? <Loading />
                :
                <>
                    <Row>
                        <Col span={24}>
                            <h1>{product.Name}</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>

                            <Card>
                                <Row>
                                    <Col md={12} xs={24}>
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={[
                                                {
                                                    title: 'قیمت',
                                                    description: product.Price
                                                },
                                                ...addItem({
                                                    title: 'توضیحات',
                                                    description: product.Description

                                                }, product.Description),

                                                // ...(product.Description ? [{
                                                //     title: 'توضیحات',
                                                //     description: product.Description
                                                // }] : []),
                                                {
                                                    title: 'گروه محصول',
                                                    description: product.Group.Name
                                                },
                                            ]}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        style={{ textAlign: 'right' }}
                                                        title={item.title}
                                                        description={item.description}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </Col>
                                    <Col md={{ span: 6, offset: 6 }} xs={24}>
                                        <Card cover={<img src={product.Image} alt={product.Name} style={{ maxWidth: 500, maxHeight: 800, width: '100%', height: '100%' }} />}></Card>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>
                </>}
        </>
    )
}

export default ViewProduct;