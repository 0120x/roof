import React, { useState } from 'react';

function AddIngredientForm({ userId }) {
    // 사용자가 입력할 데이터의 상태(State) 관리
    const [formData, setFormData] = useState({
        ingredient_name: '',
        expiry_date: '',
        quantity: 1
    });

    // 입력값이 변경될 때마다 상태 업데이트
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // '등록' 버튼을 눌렀을 때 백엔드로 데이터 전송
    const handleSubmit = async (e) => {
        e.preventDefault(); // 페이지 새로고침 방지

        try {
            const response = await fetch('http://localhost:8080/api/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    ingredient_name: formData.ingredient_name,
                    expiry_date: formData.expiry_date,
                    quantity: formData.quantity
                }),
            });

            if (response.ok) {
                alert('🥦 식재료가 성공적으로 등록되었습니다!');
                // 등록 성공 후 입력칸 초기화 및 화면 새로고침 (간단한 시연용 처리)
                setFormData({ ingredient_name: '', expiry_date: '', quantity: 1 });
                window.location.reload(); 
            } else {
                alert('등록에 실패했습니다.');
            }
        } catch (error) {
            console.error("전송 에러:", error);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', border: '2px dashed #4CAF50', borderRadius: '8px' }}>
            <h2>🛒 새로운 식재료 등록</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label>재료 이름: </label>
                    <input type="text" name="ingredient_name" value={formData.ingredient_name} onChange={handleChange} required placeholder="예: 두부" />
                </div>
                <div>
                    <label>유통기한: </label>
                    <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} required />
                </div>
                <div>
                    <label>수량: </label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required style={{ width: '50px' }} />
                </div>
                <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    냉장고에 넣기
                </button>
            </form>
        </div>
    );
}

export default AddIngredientForm;