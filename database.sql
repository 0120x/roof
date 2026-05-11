-- 1. 데이터베이스 생성 및 선택
CREATE DATABASE IF NOT EXISTS infinite_loop;
USE infinite_loop;

-- 2. 기존 테이블이 있다면 삭제 (여러 번 실행해도 에러가 나지 않도록 초기화)
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Recipes;
DROP TABLE IF EXISTS Users;

-- 3. 사용자 테이블 생성
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- 4. 냉장고 재고 (유통기한 관리) 테이블 생성
CREATE TABLE Inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ingredient_name VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 5. 레시피 테이블 생성
CREATE TABLE Recipes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty ENUM('초급', '중급', '고급') DEFAULT '초급',
    cooking_time_min INT,
    microwave_friendly BOOLEAN DEFAULT FALSE,
    allergy_tags VARCHAR(255)
);

-- 6. 가상의 사용자 1명 생성 데이터 추가
INSERT INTO Users (id, username, email) VALUES (1, '김무한', 'muhan@loop.com');

-- 7. 테스트 및 시연용 레시피 데이터 전체 추가
INSERT INTO Recipes (title, description, difficulty, cooking_time_min, allergy_tags) VALUES
('토마토 계란 볶음', '유통기한이 임박한 계란과 토마토를 활용한 영양만점 반찬', '초급', 10, '계란'),
('양파 볶음밥', '남은 양파를 듬뿍 넣은 달콤하고 든든한 한 끼', '초급', 15, '없음'),
('냉장고 파먹기 찌개', '자투리 채소를 몽땅 넣고 끓인 얼큰한 찌개', '중급', 20, '대두'),
('두부 김치', '냉장고에 남은 두부와 신김치를 볶아 만든 밥도둑', '초급', 15, '대두'),
('우유 크림 파스타', '생크림 없이 남은 우유로 만드는 꾸덕한 파스타', '중급', 20, '유제품,밀'),
('돼지고기 숙주볶음', '유통기한 임박한 숙주와 돼지고기의 굴소스 만남', '초급', 10, '돼지고기'),
('파 당근 볶음밥', '자투리 대파와 당근만으로 맛을 내는 중국집 볶음밥', '초급', 15, '없음'),
('치즈 감자전', '싹트기 직전인 감자를 갈아 치즈를 듬뿍 올린 전', '중급', 25, '유제품');