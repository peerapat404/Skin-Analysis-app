import * as db from './database.js';

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const filename = fileURLToPath(import.meta.url);
const _dirname = dirname(filename);
const app = express();


app.use(express.json());
app.use(express.static(path.join(_dirname, 'src')));
app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, 'src', 'myskin.html'));
});

async function getProducts(req, res) {
    res.json(await db.listProducts());
}

async function getProduct(req, res) {
    const result = await db.findProduct(req.params.id);
    if (result) {
        res.json(result);
    } else {
        res.status(404).send("Product not found");
    }
}

async function postRoutine(req, res) {
    try {
        const routineData = {
            routineName: req.body.routineName,
            user_id: req.body.user_id 
        };

        const routine = await db.createRoutine(routineData);
        res.status(200).json(routine);
    } catch (error) {
        console.error("Failed to create routine:", error);
        res.status(404).send("Failed to create routine");
    }
}

async function getRoutines(req, res) {
    const user_id = req.body.user_id;
    if (!user_id) {
        res.status(400).send("user_id is required");
        return;
    }
    const routines = await db.listRoutines(user_id);
    res.json(routines);
}

async function getRoutine(req, res) {
    try {
        const routine = await db.findRoutine(req.params.id);
        if (routine) {
            res.json(routine);
        } else {
            res.status(404).send("Routine not found");
        }
    } catch (error) {
        console.error("Failed to retrieve routine:", error);
        res.status(404).send("Failed to retrieve routine");
    }
}

async function getUser(req, res) {
    const user = await db.findUser(req.params.id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send("User not found");
    }
}

async function updatedUserskin_type(req, res) {
    const userskin_type = await db.userSkinType(req.body);
    if (userskin_type) {
        res.json(userskin_type);
    } else {
        res.status(404).send("User skin type not found");}
}

async function deleteRoutine(req, res) {
    const routine = await db.deleteARoutine(req.params.id);
    if (routine) {
        res.json(routine);
    } else {
        res.status(404).send("Routine not found");
    }
}

async function postProductInRoutine(req, res) {
    try {
        const { product_id, routine_id} = req.body;  // Expecting a product ID from the client

        // Check if the routine exists (you might also want to verify the product exists)
        const routine = await db.findRoutine(routine_id);
        if (!routine) {
            res.status(404).send("Routine not found");
            return;
        }

        // Add the product to the routine using the join table
        const updatedRoutine = await db.addProductToRoutine(routine_id, product_id);
        res.json(updatedRoutine);
    } catch (error) {
        console.error("Failed to update routine products:", error);
        res.status(404).send("Failed to update routine products");
    }
}

async function getPredefinedRoutines(req, res) {
    const routines = await db.listPredefinedRoutines(req.params.skin_type);
    res.json(routines);
}

async function getPredefinedRoutine(req, res) {
    try {
        const products = await db.findPredefinedRoutine(req.params.routine_id);
        if (products.length > 0) {
            const { routine_skin_type, time } = products[0];
            res.json({
                time,
                skin_type: routine_skin_type,
                products: products.map(({ product_id, name, product_type, skin_type, ingredients }) => ({
                    product_id, name, product_type, skin_type, ingredients
                }))
            });
        } else {
            res.status(404).send("Routine not found");
        }
    } catch (error) {
        console.error("Failed to retrieve routine:", error);
        res.status(404).send("Failed to retrieve routine");
    }
}


async function deleteProductInRoutine(req, res) {
    try {
      const routine_id = req.params.id;
      const { product_id } = req.body;
  
      await db.deleteProductFromRoutineById(routine_id, product_id);
      res.status(200).json({ message: "Product deleted" });
    } catch (err) {
      console.error("Failed to delete product from routine:", err);
      res.status(500).send("Failed to delete product from routine");
    }
  }
  
// Routes

// Products
app.get('/products', getProducts);
app.get('/products/:id', getProduct);

// Routines
app.post('/routines', postRoutine);
app.post('/getRoutines', getRoutines);
app.get('/routines/:id', getRoutine);
app.post('/add-product', postProductInRoutine)
app.post('/updateRoutines/:id', deleteRoutine);
app.post('/updateProducts/:id/delete-product', deleteProductInRoutine);

// Users and Skin Type
app.get('/users/:id', getUser);
app.put('/users/skin-type', updatedUserskin_type);

// Predefined Routines
app.get('/predefined-routines/skin/:skin_type', getPredefinedRoutines)
app.get('/predefined-routines/:routine_id', getPredefinedRoutine);


const PORT = 8080;
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is running at: http://localhost:${PORT}`);
    } else {
        console.log("Error occurred, server can't start", error);
    }
});