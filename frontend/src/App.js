import React from 'react';
import AddIngredientForm from './components/AddIngredientForm'; // 새로 추가된 폼
import InventoryDashboard from './components/InventoryDashboard';
import RecipeRecommendation from './components/RecipeRecommendation';

function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: 'center' }}>무한루프 서비스 테스트</h1>
      {/* 컴포넌트들을 순서대로 배치합니다 */}
      <AddIngredientForm userId={1} />
      <InventoryDashboard userId={1} />
      <RecipeRecommendation userId={1} />
    </div>
  );
}

export default App;