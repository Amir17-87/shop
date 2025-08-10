import { Card, Col, Row } from "antd";
import { FOREGROUND, ITEM } from "../helpers/colors";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Product from "./Product";
import NotFound from '../assets/NotFound.gif';
import { useEffect, useState } from "react";
import { getAllProductGroups, getAllProducts } from "../services/productService";


const Products = () => {

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productGroups, setProductGroups] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { data: productsData } = await getAllProducts();
                const { data: productGroupsData } = await getAllProductGroups();
                setProducts(productsData);
                setProductGroups(productGroupsData);
                console.log(productsData);

                // const { data: peopleData } = await axios.get("https://localhost:7295/api/People");
                // console.log(peopleData);
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
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <h2 style={{ textAlign: "right" }}>محصولات</h2>
                </Col>
            </Row>

            {loading
                ? <Loading />
                :
                <Row data-aos="fade-up" data-aos-anchor-placement="top-center" gutter={[16, 16]}>
                    {products.length > 0 ? products.map(p => (
                        <Product key={p.id} product={p} />
                    )) :
                        (
                            <Col md={24} xs={24}>
                                <h3 style={{ color: FOREGROUND }}>محصول یافت نشد ...</h3>
                                <img src={NotFound} alt="پیدا نشد" style={{ borderRadius: "10px", width: "100%", height: "100%" ,maxWidth: "500px" , maxHeight: "500px"}} />
                            </Col>
                        )
                    }
                    {/* {Array.from({ length: products.length }).map((_) => (
                 <Product/>
            ))} */}
                </Row >

            }






        </>
    )
}

export default Products;
