const { dynamodb } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.ORDERS_TABLE_NAME || 'RestaurantOrders';

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      items, 
      totalAmount, 
      deliveryAddress, 
      orderType,
      specialInstructions 
    } = req.body;
    
    // Validation
    if (!customerName || !customerPhone || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer name, phone, items, and total amount are required' 
      });
    }
    
    const order = {
      id: uuidv4(),
      orderNumber: `ORD-${Date.now()}`,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      items,
      totalAmount: parseFloat(totalAmount),
      deliveryAddress: deliveryAddress || '',
      orderType: orderType || 'delivery',
      specialInstructions: specialInstructions || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const params = {
      TableName: TABLE_NAME,
      Item: order
    };
    
    await dynamodb.put(params).promise();
    
    res.status(201).json({ 
      success: true,
      message: 'Order created successfully',
      order 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create order' 
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    
    let params = {
      TableName: TABLE_NAME
    };
    
    // Filter by status if provided
    if (status) {
      params.FilterExpression = '#status = :status';
      params.ExpressionAttributeNames = {
        '#status': 'status'
      };
      params.ExpressionAttributeValues = {
        ':status': status
      };
    }
    
    const result = await dynamodb.scan(params).promise();
    
    // Sort by createdAt descending
    const sortedOrders = result.Items.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json({ 
      success: true,
      count: sortedOrders.length,
      orders: sortedOrders 
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch orders' 
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return res.status(404).json({ 
        success: false,
        error: 'Order not found' 
      });
    }
    
    res.json({ 
      success: true,
      order: result.Item 
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch order' 
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }
    
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id },
      UpdateExpression: 'set #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await dynamodb.update(params).promise();
    
    res.json({ 
      success: true,
      message: 'Order status updated successfully',
      order: result.Attributes 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update order status' 
    });
  }
};

// Get orders by customer phone
exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { phone } = req.params;
    
    const params = {
      TableName: TABLE_NAME,
      FilterExpression: 'customerPhone = :phone',
      ExpressionAttributeValues: {
        ':phone': phone
      }
    };
    
    const result = await dynamodb.scan(params).promise();
    
    // Sort by createdAt descending
    const sortedOrders = result.Items.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    res.json({ 
      success: true,
      count: sortedOrders.length,
      orders: sortedOrders 
    });
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch customer orders' 
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    
    await dynamodb.delete(params).promise();
    
    res.json({ 
      success: true,
      message: 'Order deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete order' 
    });
  }
};
