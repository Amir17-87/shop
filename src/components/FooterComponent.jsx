import { Footer } from "antd/es/layout/layout";
import { ITEM } from "../helpers/colors";
import { Col, Row, Space } from "antd";
import { Link } from "react-router-dom";
import { FaInstagram, FaShop } from "react-icons/fa6";
import { FaTelegram } from "react-icons/fa";
import { MdDeveloperMode } from "react-icons/md";

const FooterComponent = () => {
    return (
        <Footer style={{ textAlign: 'center', backgroundColor: ITEM }}>
            <Row>
                <Col md={15} xs={24} style={{ textAlign: "right" }}>
                    <Link to="/">
                        <Space>
                            <FaShop size={25} />
                            فروشگاه ایرانی
                        </Space>
                    </Link>
                    <p style={{ fontFamily: 'Capsule', margin: "20px 0" }}>ما برای پیدا کردن محصولات <br />رویاییتون به شما کمک می کنیم</p>
                    <Link to="https://www.instagram.com/amir17_87" target="_blank">
                        <FaInstagram size={30} style={{ marginRight: 10 }} />
                    </Link>
                    <Link to="https://t.me/amir17_87" target="_blank">
                        <FaTelegram size={30} style={{ marginRight: 10 }} />
                    </Link>
                </Col>
                <Col md={3} xs={8}>
                <span style={{ fontSize: 12, fontWeight: "bold" }}>ارتباط با ما</span><br />
                    <Link to="tel:+989934141887" style={{ fontSize: 12, fontWeight: "bold" }} target="_blank">
                        تلفن تماس
                    </Link><br/>
                    <Link to="mailto:amirmohammadmahdyan@gmail.com" style={{ fontSize: 12, fontWeight: "bold" }} target="_blank">
                        ایمیل
                    </Link>
                </Col>
                <Col md={3} xs={8}>
                    <span style={{ fontSize: 12, fontWeight: "bold" }}>اطلاعات</span><br />
                    <Link to="/aboutus" style={{ fontSize: 12, fontWeight: "bold" }} target="_blank">
                        درباره ما
                    </Link><br/>
                    <Link to="/products" style={{ fontSize: 12, fontWeight: "bold" }} target="_blank">
                        محصولات
                    </Link>
                </Col>
                <Col md={3} xs={8}>
                    <MdDeveloperMode />
                    <span style={{ fontSize: 12, fontWeight: "bold" }}>WEB DEVELOPER</span><br />
                    <Link to="https://amirmahdian.ir/Projects/First%20Project-Profile/Profile.html" style={{ fontSize: 12, fontWeight: "bold" }}>
                        Amir Mahdian
                    </Link>
                </Col>
                <p>تمامی حقوق مادی و معنوی این سایت متعلق به فروشگاه ایرانی می باشد و هرگونه کپی برداری غیرقانونی محسوب خواهد شد.</p>
            </Row>
        </Footer>
    )
}

export default FooterComponent;
