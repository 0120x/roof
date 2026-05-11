import React, { useState, useEffect } from 'react';

function RecipeRecommendation({ userId }) {
    const [recommendation, setRecommendation] = useState({ targetIngredient: null, recipes: [] });

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/recipes/recommend/${userId}`);
                const data = await response.json();
                setRecommendation(data);
            } catch (error) {
                console.error("레시피 로딩 실패:", error);
            }
        };
        fetchRecipes();
    }, [userId]);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '20px auto', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
            <h2>🍳 오늘의 추천 레시피</h2>
            
            {!recommendation.targetIngredient ? (
                <p>지금은 냉장고가 평화롭습니다! 원하는 레시피를 직접 검색해보세요.</p>
            ) : (
                <>
                    <p>빨리 먹어야 하는 <strong>[{recommendation.targetIngredient}]</strong>(을)를 활용한 레시피예요!</p>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {recommendation.recipes.map(recipe => (
                            <li key={recipe.id} style={{ padding: '15px', marginBottom: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{recipe.title}</h3>
                                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>{recipe.description}</p>
                                <div style={{ fontSize: '12px', display: 'flex', gap: '10px' }}>
                                    <span style={{ backgroundColor: '#eee', padding: '3px 8px', borderRadius: '12px' }}>난이도: {recipe.difficulty}</span>
                                    <span style={{ backgroundColor: '#eee', padding: '3px 8px', borderRadius: '12px' }}>⏱ {recipe.cooking_time_min}분</span>
                                </div>
                            </li>
                        ))}
                        {recommendation.recipes.length === 0 && (
                            <p style={{ color: 'gray' }}>해당 재료를 활용한 레시피가 아직 등록되지 않았습니다.</p>
                        )}
                    </ul>
                </>
            )}
        </div>
    );
}

export default RecipeRecommendation;