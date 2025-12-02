#!/bin/bash

# DynamoDB Tables Creation Script
# Creates all necessary tables for the Restaurant Management System

set -e

REGION="us-east-1"

echo "========================================="
echo "Creating DynamoDB Tables"
echo "========================================="
echo ""

# Create Menu Table
echo "📋 Creating RestaurantMenu table..."
aws dynamodb create-table \
    --table-name RestaurantMenu \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ${REGION} \
    --tags Key=Project,Value=RestaurantManagement Key=Environment,Value=Production

echo "✓ RestaurantMenu table created"
echo ""

# Create Orders Table
echo "📋 Creating RestaurantOrders table..."
aws dynamodb create-table \
    --table-name RestaurantOrders \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ${REGION} \
    --tags Key=Project,Value=RestaurantManagement Key=Environment,Value=Production

echo "✓ RestaurantOrders table created"
echo ""

# Create Reservations Table
echo "📋 Creating RestaurantReservations table..."
aws dynamodb create-table \
    --table-name RestaurantReservations \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region ${REGION} \
    --tags Key=Project,Value=RestaurantManagement Key=Environment,Value=Production

echo "✓ RestaurantReservations table created"
echo ""

echo "========================================="
echo "✅ All tables created successfully!"
echo "========================================="
echo ""
echo "Waiting for tables to become active..."
echo ""

# Wait for tables to become active
aws dynamodb wait table-exists --table-name RestaurantMenu --region ${REGION}
aws dynamodb wait table-exists --table-name RestaurantOrders --region ${REGION}
aws dynamodb wait table-exists --table-name RestaurantReservations --region ${REGION}

echo "✓ All tables are now active"
echo ""
echo "You can view your tables at:"
echo "https://console.aws.amazon.com/dynamodbv2/home?region=${REGION}#tables"
