import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import uuid from 'uuid-random';

async function init() {
    const db = await open({
        filename: '.db.sqlite',
        driver: sqlite3.Database,
        verbose: true,
    });
    await db.migrate({ migrationsPath: './src/migrations-sqlite' });
    return db;
}

const dbConn = init();

// User
export async function findUser(id) {
    const db = await dbConn;
    return db.get('SELECT * FROM users WHERE user_id = ?', id);
}

// User's Skin Type
export async function userSkinType(updatedSkinType) {
    const db = await dbConn;

    const id = updatedSkinType.id;

    await db.run('UPDATE users set skin_type = ? WHERE user_id = ?', [updatedSkinType.skin_type, id]);

    return db.get('SELECT * FROM users WHERE user_id = ?', id);
}

// List of Products
export async function listProducts() {
    const db = await dbConn;
    return db.all('SELECT * FROM products');
}

// Find the Products from the Database
export async function findProduct(id) {
    const db = await dbConn;
    return db.get('SELECT * FROM products WHERE product_id = ?', id);
}

// Create Routine 
export async function createRoutine(data) {
    const db = await dbConn;
    const id = uuid();
    await db.run(
        'INSERT INTO routines (routine_id, routine_name, user_id) VALUES (?, ?, ?)',
        [id, data.routineName, data.user_id] 
    );
    return db.get('SELECT * FROM routines WHERE routine_id = ?', id);
}

// List of Routines
export async function listRoutines(user_id) {
    const db = await dbConn;
    return db.all(
        `
        SELECT 
            r.routine_id,
            r.routine_name, 
            GROUP_CONCAT(p.name, ', ') AS product_names
        FROM routines r
        LEFT JOIN routine_products rp ON r.routine_id = rp.routine_id
        LEFT JOIN products p ON rp.product_id = p.product_id
        WHERE r.user_id = ?
        GROUP BY r.routine_id
        `,
        [user_id]
    );
}

// Find the Routine from the Database
export async function findRoutine(routine_id) {
    const db = await dbConn;
    return db.get(
        `
        SELECT 
            r.routine_id,
            r.routine_name, 
            GROUP_CONCAT(p.name, ', ') AS product_names
        FROM routines r
        LEFT JOIN routine_products rp ON r.routine_id = rp.routine_id
        LEFT JOIN products p ON rp.product_id = p.product_id
        WHERE r.routine_id = ?
        GROUP BY r.routine_id
        `,
        [routine_id]
    );
}

export async function addProductToRoutine(routine_id, product_id) {
    const db = await dbConn;
    await db.run('INSERT INTO routine_products (routine_id, product_id) VALUES (?, ?)', [routine_id, product_id]);

    return db.get(
        `
        SELECT
            r.routine_id,
            r.routine_name,
            GROUP_CONCAT(p.name, ', ') AS product_names
        FROM routines r
        LEFT JOIN routine_products rp ON r.routine_id = rp.routine_id
        LEFT JOIN products p ON rp.product_id = p.product_id
        WHERE r.routine_id = ?
        GROUP BY r.routine_id
        `,
        [routine_id]
    );
}

// Delete a routine by ID
export async function deleteARoutine(id) {
    const db = await dbConn;
    return db.run('DELETE FROM routines WHERE routine_id = ?', id);
}

export async function updateRoutineProducts(id, product) {
    const db = await dbConn;
    await db.run('UPDATE routines set product = ? WHERE routine_id = ?', [product, id]);
}

export async function listPredefinedRoutines(skin_type) { 
    const db = await dbConn;
    return db.all(
        `
        SELECT 
            pr.routine_id, 
            pr.skin_type, 
            pr.time, 
            GROUP_CONCAT(p.name, ', ') AS product_names
        FROM predefined_routines pr
        JOIN predefined_routine_products prp ON pr.routine_id = prp.routine_id
        JOIN products p ON prp.product_id = p.product_id
        WHERE pr.skin_type = ?
        GROUP BY pr.routine_id
        `,
        [skin_type]
    );
}

export async function findPredefinedRoutine(predefined_routine_id) {
    const db = await dbConn;
    return db.all(
        `
        SELECT 
            p.product_id,
            p.name,
            p.product_type,
            p.skin_type,
            p.ingredients,
            pr.skin_type AS routine_skin_type,
            pr.time
        FROM predefined_routines pr
        JOIN predefined_routine_products prp ON pr.routine_id = prp.routine_id
        JOIN products p ON prp.product_id = p.product_id
        WHERE pr.routine_id = ?
        ORDER BY prp.rowid
        `,
        [predefined_routine_id]
    );
}

export async function deleteProductFromRoutineById(routine_id, product_id) {
    const db = await dbConn;
  
    await db.run(
      'DELETE FROM routine_products WHERE rowid IN (SELECT rowid FROM routine_products WHERE routine_id = ? AND product_id = ?)',
      [routine_id, product_id]
    );
  }