const { dynamodb } = require('../config/dynamodb');
const { v4: uuidv4 } = require('uuid');

const TABLE_NAME = process.env.RESERVATIONS_TABLE_NAME || 'RestaurantReservations';

// Create new reservation
exports.createReservation = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      date, 
      time, 
      numberOfGuests, 
      specialRequests 
    } = req.body;
    
    // Validation
    if (!customerName || !customerPhone || !date || !time || !numberOfGuests) {
      return res.status(400).json({ 
        success: false,
        error: 'Customer name, phone, date, time, and number of guests are required' 
      });
    }
    
    const reservation = {
      id: uuidv4(),
      reservationNumber: `RES-${Date.now()}`,
      customerName,
      customerEmail: customerEmail || '',
      customerPhone,
      date,
      time,
      numberOfGuests: parseInt(numberOfGuests),
      specialRequests: specialRequests || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const params = {
      TableName: TABLE_NAME,
      Item: reservation
    };
    
    await dynamodb.put(params).promise();
    
    res.status(201).json({ 
      success: true,
      message: 'Reservation created successfully',
      reservation 
    });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create reservation' 
    });
  }
};

// Get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    const { status, date } = req.query;
    
    let params = {
      TableName: TABLE_NAME
    };
    
    // Build filter expression
    let filterExpressions = [];
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    
    if (status) {
      filterExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }
    
    if (date) {
      filterExpressions.push('#date = :date');
      expressionAttributeNames['#date'] = 'date';
      expressionAttributeValues[':date'] = date;
    }
    
    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
      params.ExpressionAttributeNames = expressionAttributeNames;
      params.ExpressionAttributeValues = expressionAttributeValues;
    }
    
    const result = await dynamodb.scan(params).promise();
    
    // Sort by date and time
    const sortedReservations = result.Items.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
    
    res.json({ 
      success: true,
      count: sortedReservations.length,
      reservations: sortedReservations 
    });
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch reservations' 
    });
  }
};

// Get reservation by ID
exports.getReservationById = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    
    const result = await dynamodb.get(params).promise();
    
    if (!result.Item) {
      return res.status(404).json({ 
        success: false,
        error: 'Reservation not found' 
      });
    }
    
    res.json({ 
      success: true,
      reservation: result.Item 
    });
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch reservation' 
    });
  }
};

// Update reservation status
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'seated', 'completed', 'cancelled', 'no-show'];
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
      message: 'Reservation status updated successfully',
      reservation: result.Attributes 
    });
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update reservation status' 
    });
  }
};

// Get reservations by customer phone
exports.getReservationsByCustomer = async (req, res) => {
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
    
    // Sort by date and time
    const sortedReservations = result.Items.sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      return b.time.localeCompare(a.time);
    });
    
    res.json({ 
      success: true,
      count: sortedReservations.length,
      reservations: sortedReservations 
    });
  } catch (error) {
    console.error('Error fetching customer reservations:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch customer reservations' 
    });
  }
};

// Delete reservation
exports.deleteReservation = async (req, res) => {
  try {
    const params = {
      TableName: TABLE_NAME,
      Key: { id: req.params.id }
    };
    
    await dynamodb.delete(params).promise();
    
    res.json({ 
      success: true,
      message: 'Reservation deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete reservation' 
    });
  }
};
