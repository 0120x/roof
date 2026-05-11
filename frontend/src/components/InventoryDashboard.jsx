// src/components/InventoryDashboard.jsx
import React, { useState, useEffect } from 'react';

function InventoryDashboard({ userId }) {
    const [expiringItems, setExpiringItems] = useState([]);

    // 백엔드 API 호출하여 임박 재료 가져오기
    useEffect(() => {
        const fetchExpiringItems = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/inventory/expiring/${userId}`);
                const data = await response.json();
                setExpiringItems(data);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchExpiringItems();
    }, [userId]);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>⚠️ 유통기한 임박 재료 (D-3)</h2>
            
            {expiringItems.length === 0 ? (
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <p>임박한 재료가 없습니다. 냉장고가 안전합니다! 🍏</p>
                    <button>새로운 재료 추가하기</button> {/* 빈 상태 화면 예외 처리 반영 */}
                </div>
            ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {expiringItems.map(item => {
                        // 날짜 차이 계산
                        const daysLeft = Math.ceil((new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24));
                        
                        return (
                            <li key={item.id} style={{ 
                                padding: '15px', 
                                marginBottom: '10px', 
                                border: '1px solid #ff4d4d', 
                                backgroundColor: '#ffe6e6',
                                borderRadius: '8px',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <strong>{item.ingredient_name} (수량: {item.quantity})</strong>
                                <span style={{ color: 'red', fontWeight: 'bold' }}>D-{daysLeft}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default InventoryDashboard;