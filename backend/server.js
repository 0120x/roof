// server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL 연결 설정
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'infinite_loop'
});

// [API] 1. 새로운 식재료 등록 (유통기한 설정)
app.post('/api/inventory', async (req, res) => {
    const { user_id, ingredient_name, expiry_date, quantity } = req.body;
    try {
        const [result] = await pool.execute(
            'INSERT INTO Inventory (user_id, ingredient_name, expiry_date, quantity) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
            [user_id, ingredient_name, expiry_date, quantity, quantity] // 중복 시 수량 합산 (예외 처리 반영)
        );
        res.status(201).json({ message: '재료가 성공적으로 등록되었습니다.', id: result.insertId });
    } catch (error) {
        console.error("🚨 데이터베이스 저장 에러 발생:", error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

// [API] 2. 유통기한 임박(D-3 이내) 재료 조회
app.get('/api/inventory/expiring/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    try {
        // 현재 날짜로부터 3일 이내인 재료 조회
        const [rows] = await pool.execute(
            `SELECT * FROM Inventory 
             WHERE user_id = ? AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
             ORDER BY expiry_date ASC`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
});

// [API] 3. 유통기한 임박 재료 기반 레시피 추천
app.get('/api/recipes/recommend/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    try {
        // 1. 유저의 냉장고에서 가장 유통기한이 급한 재료 1개 찾기
        const [ingredients] = await pool.execute(
            `SELECT ingredient_name FROM Inventory 
             WHERE user_id = ? AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
             ORDER BY expiry_date ASC LIMIT 1`, 
            [userId]
        );

        if (ingredients.length === 0) {
            return res.json({ targetIngredient: null, recipes: [] }); // 급한 재료가 없으면 빈 값 반환
        }

        const targetIngredient = ingredients[0].ingredient_name;

        // 2. 해당 재료 이름이 제목이나 설명에 들어간 레시피 검색
        const [recipes] = await pool.execute(
            `SELECT * FROM Recipes WHERE title LIKE ? OR description LIKE ? LIMIT 3`,
            [`%${targetIngredient}%`, `%${targetIngredient}%`]
        );

        res.json({ targetIngredient, recipes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '레시피를 불러오는 중 오류가 발생했습니다.' });
    }
});

app.listen(8080, () => {
    console.log('백엔드 서버가 8080 포트에서 실행 중입니다.');
});