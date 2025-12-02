const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

// Get all menu items
router.get('/', menuController.getAllMenuItems);

// Get menu items by category
router.get('/category/:category', menuController.getMenuItemsByCategory);

// Get single menu item
router.get('/:id', menuController.getMenuItemById);

// Create menu item
router.post('/', menuController.createMenuItem);

// Update menu item
router.put('/:id', menuController.updateMenuItem);

// Delete menu item
router.delete('/:id', menuController.deleteMenuItem);

module.exports = router;
