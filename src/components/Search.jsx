import React from 'react';
import { Input, Space } from 'antd';
const { Search } = Input;

const onSearch = (value, _e, info) =>
    console.log(info === null || info === void 0 ? void 0 : info.source, value);
const MySearch = () => (
    <Space style={{textAlign: "right", width: '100%', justifyContent: 'flex-start'}}>
        <Search 
            placeholder="دنبال چه چیزی می گردید؟" 
            onSearch={onSearch} 
            enterButton 
            dir="rtl"
            style={{ 
                direction: 'rtl',
                textAlign: 'right',
                width: '300px'
            }}
        />
    </Space>
);
export default MySearch;