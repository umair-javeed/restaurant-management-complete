const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'us-east-1'
});

// Create DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Helper function to handle common DynamoDB operations
const dbHelpers = {
  // Scan with error handling
  async scan(tableName) {
    try {
      const params = { TableName: tableName };
      return await dynamodb.scan(params).promise();
    } catch (error) {
      console.error(`Error scanning ${tableName}:`, error);
      throw error;
    }
  },

  // Get item with error handling
  async get(tableName, key) {
    try {
      const params = {
        TableName: tableName,
        Key: key
      };
      return await dynamodb.get(params).promise();
    } catch (error) {
      console.error(`Error getting item from ${tableName}:`, error);
      throw error;
    }
  },

  // Put item with error handling
  async put(tableName, item) {
    try {
      const params = {
        TableName: tableName,
        Item: item
      };
      return await dynamodb.put(params).promise();
    } catch (error) {
      console.error(`Error putting item to ${tableName}:`, error);
      throw error;
    }
  },

  // Update item with error handling
  async update(tableName, key, updateExpression, expressionAttributeValues, expressionAttributeNames = {}) {
    try {
      const params = {
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };
      
      if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames;
      }
      
      return await dynamodb.update(params).promise();
    } catch (error) {
      console.error(`Error updating item in ${tableName}:`, error);
      throw error;
    }
  },

  // Delete item with error handling
  async delete(tableName, key) {
    try {
      const params = {
        TableName: tableName,
        Key: key
      };
      return await dynamodb.delete(params).promise();
    } catch (error) {
      console.error(`Error deleting item from ${tableName}:`, error);
      throw error;
    }
  }
};

module.exports = { dynamodb, dbHelpers };
