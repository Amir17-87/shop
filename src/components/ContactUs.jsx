import { Card, Col, Row } from "antd";
import { FOREGROUND, ITEM } from "../helpers/colors";

const ContactUs = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col data-aos="fade-up" span={24}>
                    <Card style={{ backgroundColor: ITEM, borderRadius: 40 }}>
                        <h1 style={{ color: FOREGROUND, textAlign: "right" }}>
                            تماس با ما
                        </h1>
                        <h2 style={{ textAlign: "center" }}>
                            گروه برنامه نویسی : یاقوت بنفش
                            <img src={require("../assets/logo-purple-ruby.png")} alt="PurpleRuby" style={{ width: "50px", height: "50px", marginRight: "10px" }} />
                        </h2><br />
                        <p style={{ textAlign: "right" }}>
                            شماره تماس : 09934141887<br />
                            ایمیل : amirmohammadmahdyan@gmail.com<br />
                            آدرس : اصفهان , خمینی شهر
                        </p><br />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default ContactUs;
