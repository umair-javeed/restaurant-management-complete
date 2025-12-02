const { dynamodb } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.MENU_TABLE_NAME || 'RestaurantMenu';

// Get all menu items
exports.getAllMenuItems = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME
    };
    
    const result = await dynamodb.scan(params).promise();
    
    // Sort by category and name
    const sortedItems = result.Items.sort((a, b) => {
      if (a.category === b.category) {
        return a.name.localeCompare(b.name);
      }
      return a.category.localeCompare(b.category);
    });
    
    res.json({ 
      success: true,
      count: sortedItems.length,
      items: sortedItems 
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch menu items' 
    });
  }
};

// Get menu items by category
exports.getMenuItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      }
    };
    
    const result = await dynamodb.scan(params).promise();
    
    res.json({ 
      success: true,
      category,
      count: result.Items.length,
      items: result.Items 
    });
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch menu items' 
    });
  }
};

// Get single menu item by ID
exports.getMenuItemById = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return res.status(404).json({ 
        success: false,
        error: 'Menu item not found' 
      });
    }
    
    res.json({ 
      success: true,
      item: result.Item 
    });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch menu item' 
    });
  }
};

// Create new menu item
exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;
    
    // Validation
    if (!name || !price || !category) {
      return res.status(400).json({ 
        success: false,
        error: 'Name, price, and category are required' 
      });
    }
    
    const item = {
      id: uuidv4(),
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      image: image || '',
      available: available !== undefined ? available : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const params = {
      TableName: TABLE_NAME,
      Item: item
    };
    
    await dynamodb.put(params).promise();
    
    res.status(201).json({ 
      success: true,
      message: 'Menu item created successfully',
      item 
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create menu item' 
    });
  }
};

// Update menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, available } = req.body;
    
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id },
      UpdateExpression: 'set #name = :name, description = :description, price = :price, category = :category, image = :image, available = :available, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':description': description || '',
        ':price': parseFloat(price),
        ':category': category,
        ':image': image || '',
        ':available': available !== undefined ? available : true,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await dynamodb.update(params).promise();
    
    res.json({ 
      success: true,
      message: 'Menu item updated successfully',
      item: result.Attributes 
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update menu item' 
    });
  }
};

// Delete menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    
    await dynamodb.delete(params).promise();
    
    res.json({ 
      success: true,
      message: 'Menu item deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete menu item' 
    });
  }
};
