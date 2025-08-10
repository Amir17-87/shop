import { Card, Col, Row } from "antd";
import { FOREGROUND, ITEM } from "../helpers/colors";

const AboutUs = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col data-aos="fade-up" span={24}>
                    <Card style={{ backgroundColor: ITEM, borderRadius: 40}}>
                        <h1 style={{ color: FOREGROUND, textAlign: "right", fontSize: "50px" }}>
                            درباره ما
                        </h1>
                        <p style={{ fontSize: "20px", textAlign: "right" }}>
                            فروشگاه ایرانی یکی از بزرگترین فروشگاه های اینترنتی است که در زمینه فروش محصولات ایرانی عمل می کند.<br />
                            ما با ارائه محصولات با کیفیت بالا و سرویس روزانه به مشتریان خود را خوشحال کرده ایم.<br />
                        </p><br />
                        <span style={{ fontWeight: "bolder", textAlign: "center" }}>گروه برنامه نویسی : یاقوت بنفش</span><br />
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AboutUs;
