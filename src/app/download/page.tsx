// pages/download.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from './DownloadPage.module.css'; // 引入CSS模块

const DownloadPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null); // 用于存储错误信息
    const [apiKey, setApiKey] = useState<string | null>(null);





    const handleDownload = async () => {
        try {
            // await handleLogin();

            setError(null); // 清空之前的错误

            const loginResponse = await axios.post('http://localhost:48080/merchant-api/auth/login', {
                "username": "test@airswift.io",
                "password": "111111"
            });

            // 假设 API 返回的 apiKey 在响应数据中
            let token=loginResponse.data.data.token;

            const response = await axios.get('http://localhost:48080/merchant-api/app/export', {
                responseType: 'blob', // 确保返回的是二进制数据
                headers: {
                    'Authorization': `Bearer ${token}`, // 将 API Key 添加到请求头
                },
            });
            const fileName = 'merchant_app.xls'; // 你想要的文件名
            downloadExcel(response.data, fileName);
        } catch (error) {
            console.error('Error downloading the file', error);
            setError('下载文件时发生错误，请重试。');
        }
    };

    const downloadExcel = (data: Blob, fileName: string) => {
        const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(href);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Download Excel File</h1>
            {/*<button className={styles.button} onClick={handleLogin}>*/}
            {/*    Login*/}
            {/*</button>*/}
            <button className={styles.button} onClick={handleDownload}>
                Download Excel
            </button>
            {error && <div className={styles.error}>{error}</div>} {/* 显示错误信息 */}
        </div>
    );
};

export default DownloadPage;