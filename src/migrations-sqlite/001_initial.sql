-- TABLES

--  Users
CREATE TABLE IF NOT EXISTS users (
    user_id CHAR(36) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    skin_type VARCHAR(50) 
);

-- Skincare Routines
CREATE TABLE IF NOT EXISTS routines (
    routine_id CHAR(36) PRIMARY KEY,
    routine_name VARCHAR(100) NOT NULL,
    user_id CHAR(36) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Product table
CREATE TABLE IF NOT EXISTS products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    skin_type VARCHAR(50) NOT NULL,
    ingredients TEXT NOT NULL
);

-- Predefined skincare routines
CREATE TABLE IF NOT EXISTS predefined_routines (
    routine_id CHAR(36) PRIMARY KEY,
    skin_type TEXT NOT NULL CHECK (skin_type IN ('normal', 'dry', 'oily', 'combination', 'sensitive')),
    time TEXT NOT NULL CHECK (time IN ('morning', 'evening'))
);

CREATE TABLE IF NOT EXISTS predefined_routine_products (
    routine_id CHAR(36) NOT NULL,
    product_id INTEGER NOT NULL,
    PRIMARY KEY (routine_id, product_id),
    FOREIGN KEY (routine_id) REFERENCES predefined_routines(routine_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Routine Products (Many to Many relationship between routines and products)
CREATE TABLE IF NOT EXISTS routine_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id CHAR(36) NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(routine_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Product Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_comment TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- INSERT VALUES

-- Inserting data of sample user
INSERT INTO users (user_id, username)
VALUES
(
    "42a2d2a9-e77f-48a5-8697-41b505626fe0",
    "User1"
);

-- Inserting data into the products table
INSERT INTO products (name, product_type, skin_type, ingredients) VALUES
-- Cleansers
('Gentle Foaming Cleanser', 'Cleanser', 'Sensitive & Normal', 'Aloe Vera, Glycerin, Water'),
('Oil-Control Cleanser', 'Cleanser', 'Oily & Acne-Prone', 'Salicylic Acid, Tea Tree Oil, Water'),
('Hydrating Cream Cleanser', 'Cleanser', 'Dry & Sensitive', 'Shea Butter, Coconut Oil, Water'),
('Brightening Facial Wash', 'Cleanser', 'Normal & Dull', 'Vitamin C, Orange Extract, Water'),

-- Serums
('Vitamin C Glow Serum', 'Serum', 'Normal & Dull', 'Vitamin C, Ferulic Acid, Water'),
('Hydrating Hyaluronic Serum', 'Serum', 'Dry & Sensitive', 'Hyaluronic Acid, Glycerin, Water'),
('Anti-Blemish Serum', 'Serum', 'Oily & Acne-Prone', 'Niacinamide, Zinc PCA, Water'),
('Wrinkle Repair Serum', 'Serum', 'Aging & Dry', 'Retinol, Peptides, Water'),

-- Moisturisers
('Oil-Free Moisturiser', 'Moisturiser', 'Oily & Combination', 'Niacinamide, Panthenol, Water'),
('Deep Nourish Cream', 'Moisturiser', 'Dry & Sensitive', 'Ceramides, Shea Butter, Water'),
('Balancing Daily Moisturiser', 'Moisturiser', 'Combination', 'Green Tea, Glycerin, Water'),
('Lightweight Gel Moisturiser', 'Moisturiser', 'Oily & Acne-Prone', 'Aloe Vera, Niacinamide, Water'),

-- Sunscreens
('SPF 30 Daily Shield', 'Sunscreen', 'All Skin Types', 'Zinc Oxide, Titanium Dioxide, Water'),
('Matte Finish SPF 50', 'Sunscreen', 'Oily & Combination', 'Silica, Zinc Oxide, Water'),
('Tinted Mineral Sunscreen', 'Sunscreen', 'Sensitive & Dry', 'Iron Oxide, Zinc Oxide, Glycerin'),
('Hydrating Facial SPF', 'Sunscreen', 'Dry & Normal', 'Avobenzone, Hyaluronic Acid, Water'),

-- Eye Creams
('Brightening Eye Cream', 'Eye Cream', 'All Skin Types', 'Vitamin C, Caffeine, Water'),
('Firming Eye Gel', 'Eye Cream', 'Aging & Normal', 'Peptides, Aloe Vera, Water'),
('Hydra Boost Eye Cream', 'Eye Cream', 'Dry & Sensitive', 'Hyaluronic Acid, Panthenol, Water'),
('De-Puff Eye Serum', 'Eye Cream', 'Puffy Eyes', 'Caffeine, Green Tea Extract, Water'),

-- Toners
('Pore Minimizing Toner', 'Toner', 'Oily & Acne-Prone', 'Witch Hazel, Niacinamide, Water'),
('Soothing Chamomile Toner', 'Toner', 'Sensitive & Redness-Prone', 'Chamomile, Aloe Vera, Water'),
('Hydrating Rose Toner', 'Toner', 'Dry & Normal', 'Rose Water, Glycerin, Water'),
('Clarifying AHA Toner', 'Toner', 'Dull & Oily', 'Glycolic Acid, Aloe Vera, Water');



-- Inserting data into the predefined_routines table
INSERT INTO predefined_routines (routine_id, skin_type, time)
VALUES 
(
    "9f2b7d42-b77f-4f38-b32f-64b1dc9c0a68",
    "dry",
    "morning"
),
(
    "bf53a89b-7f45-42ae-87cf-17cf7988b6ce",
    "dry",
    "evening"
),
(
    "5ad37b7a-bac5-45d1-a9a8-4e1a61fce7de",
    "oily",
    "morning"
),
(
    "ccb96c59-5d01-4a6c-9797-64a0e14e5a11",
    "oily",
    "evening"
),
(
    "ec00a72e-08c7-4c1c-bf6c-235e47986fd1",
    "combination",
    "morning"
),
(
    "27434f1a-7233-4d90-b1b0-2dd885bc566b",
    "combination",
    "evening"
),
(
    "6f38d121-802e-4435-9b09-70b520d1ea86",
    "sensitive",
    "morning"
),
(
    "14cdab7c-6b3f-45ad-a5b3-99f94d3f6608",
    "sensitive",
    "evening"
),
(
    "11d44ea0-e1e4-42bc-a837-9b7d1284d822",
    "normal",
    "morning"
),
(
    "7fd96bde-c92f-4461-a00b-ec79ac24df2e",
    "normal",
    "evening"
);

INSERT INTO predefined_routine_products (routine_id, product_id)
VALUES 
-- Dry Morning
(
    "9f2b7d42-b77f-4f38-b32f-64b1dc9c0a68",
    1
),
(
    "9f2b7d42-b77f-4f38-b32f-64b1dc9c0a68",
    2
),
(
    "9f2b7d42-b77f-4f38-b32f-64b1dc9c0a68",
    3

),
-- Dry Evening
(
    "bf53a89b-7f45-42ae-87cf-17cf7988b6ce",
    1
),
(
    "bf53a89b-7f45-42ae-87cf-17cf7988b6ce",
    4
),
(
    "bf53a89b-7f45-42ae-87cf-17cf7988b6ce",
    2
),
-- Oily Morning
(
    "5ad37b7a-bac5-45d1-a9a8-4e1a61fce7de",
    1
),
(
    "5ad37b7a-bac5-45d1-a9a8-4e1a61fce7de",
    5
),
(
    "5ad37b7a-bac5-45d1-a9a8-4e1a61fce7de",
    2
),
(
    "5ad37b7a-bac5-45d1-a9a8-4e1a61fce7de",
    3
),
-- Oily Evening
(
    "ccb96c59-5d01-4a6c-9797-64a0e14e5a11",
    1
),
(
    "ccb96c59-5d01-4a6c-9797-64a0e14e5a11",
    6
),
(
    "ccb96c59-5d01-4a6c-9797-64a0e14e5a11",
    2
),
-- Combination Morning
(
    "ec00a72e-08c7-4c1c-bf6c-235e47986fd1",
    1
),
(
    "ec00a72e-08c7-4c1c-bf6c-235e47986fd1",
    4
),
(
    "ec00a72e-08c7-4c1c-bf6c-235e47986fd1",
    2
),
(
    "ec00a72e-08c7-4c1c-bf6c-235e47986fd1",
    3
),
-- Combination Evening
(
    "27434f1a-7233-4d90-b1b0-2dd885bc566b",
    1
),
(
    "27434f1a-7233-4d90-b1b0-2dd885bc566b",
    4
),
(
    "27434f1a-7233-4d90-b1b0-2dd885bc566b",
    2
),
-- Sensitive Morning
(
    "6f38d121-802e-4435-9b09-70b520d1ea86",
    1
),
(
    "6f38d121-802e-4435-9b09-70b520d1ea86",
    2
),
(
    "6f38d121-802e-4435-9b09-70b520d1ea86",
    3
),
-- Sensitive Evening
(
    "14cdab7c-6b3f-45ad-a5b3-99f94d3f6608",
    1
),
(
    "14cdab7c-6b3f-45ad-a5b3-99f94d3f6608",
    2
),
-- Normal Morning
(
    "11d44ea0-e1e4-42bc-a837-9b7d1284d822",
    1
),
(
    "11d44ea0-e1e4-42bc-a837-9b7d1284d822",
    4
),
(
    "11d44ea0-e1e4-42bc-a837-9b7d1284d822",
    2
),
(
    "11d44ea0-e1e4-42bc-a837-9b7d1284d822",
    3
),
-- Normal Evening
(
    "7fd96bde-c92f-4461-a00b-ec79ac24df2e",
    1
),
(
    "7fd96bde-c92f-4461-a00b-ec79ac24df2e",
    4
),
(
    "7fd96bde-c92f-4461-a00b-ec79ac24df2e",
    2
);