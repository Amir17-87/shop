import { ConfigProvider, Layout, theme } from 'antd';
import fa_IR from "antd/lib/locale/fa_IR";
import { Outlet } from "react-router-dom";
import { BACKGROUND, ITEM } from '../helpers/colors';
import Navbar from "./Navbar";
import FooterComponent from './FooterComponent';
const { Content, Footer } = Layout;

const LandingLayout = () => {
    return <ConfigProvider
        locale={fa_IR}
        componentSize="large"
        theme={{
            token: {
                colorPrimary: '#ffc107',
                colorError: '#dc3545',
                colorSuccess: '#28a745',
                colorWarning: '#ffc107',
                colorInfo: '#1E1E1E',
                fontFamily: 'IranSansDN',
            },
            // algorithm: theme.defaultAlgorithm,
        }}
        direction="rtl">
        <Layout style={{}}>
            <Navbar />
            <Content style={{ backgroundColor: BACKGROUND }}>
                <div style={{ minHeight: 'calc(100vh - 135px)', padding: 24, flex: 1 }}>
                    <Outlet />
                </div>
            </Content>
            <FooterComponent />
        </Layout>

    </ConfigProvider>;
}
export default LandingLayout;
