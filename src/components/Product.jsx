import { Card, Col } from "antd";
import { Link } from "react-router-dom";
import { ITEM } from "../helpers/colors";

const Product = ({ product }) => {
    return (
        <>
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
        </>
    )
}

export default Product;
