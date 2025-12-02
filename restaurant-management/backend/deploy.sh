#!/bin/bash

# Restaurant API Deployment Script
# This script creates a deployment package and deploys to AWS CodeDeploy

set -e

# Configuration
APP_NAME="RestaurantAPI"
DEPLOYMENT_GROUP="Production"
S3_BUCKET="restaurant-api-deployments"
REGION="us-east-1"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
PACKAGE_NAME="restaurant-api-${TIMESTAMP}.zip"

echo "========================================="
echo "Restaurant API Deployment"
echo "========================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Make sure to create it on the EC2 instance."
    echo "   Using .env.example as reference..."
fi

# Create deployment package
echo "📦 Creating deployment package..."
zip -r ${PACKAGE_NAME} . \
    -x "*.git*" \
    -x "node_modules/*" \
    -x "*.zip" \
    -x ".env" \
    -x "deploy.sh"

echo "✓ Package created: ${PACKAGE_NAME}"
echo ""

# Upload to S3
echo "☁️  Uploading to S3..."
aws s3 cp ${PACKAGE_NAME} s3://${S3_BUCKET}/${PACKAGE_NAME} --region ${REGION}
echo "✓ Uploaded to s3://${S3_BUCKET}/${PACKAGE_NAME}"
echo ""

# Create deployment
echo "🚀 Creating deployment..."
DEPLOYMENT_ID=$(aws deploy create-deployment \
    --application-name ${APP_NAME} \
    --deployment-group-name ${DEPLOYMENT_GROUP} \
    --s3-location bucket=${S3_BUCKET},key=${PACKAGE_NAME},bundleType=zip \
    --region ${REGION} \
    --query 'deploymentId' \
    --output text)

echo "✓ Deployment created with ID: ${DEPLOYMENT_ID}"
echo ""

# Clean up local package
rm ${PACKAGE_NAME}
echo "✓ Cleaned up local package"
echo ""

# Monitor deployment
echo "📊 Monitoring deployment status..."
echo "   You can also check: https://console.aws.amazon.com/codesuite/codedeploy/deployments/${DEPLOYMENT_ID}"
echo ""

while true; do
    STATUS=$(aws deploy get-deployment \
        --deployment-id ${DEPLOYMENT_ID} \
        --region ${REGION} \
        --query 'deploymentInfo.status' \
        --output text)
    
    echo "   Current status: ${STATUS}"
    
    if [ "${STATUS}" = "Succeeded" ]; then
        echo ""
        echo "========================================="
        echo "✅ Deployment completed successfully!"
        echo "========================================="
        break
    elif [ "${STATUS}" = "Failed" ] || [ "${STATUS}" = "Stopped" ]; then
        echo ""
        echo "========================================="
        echo "❌ Deployment ${STATUS}"
        echo "========================================="
        echo "Check the AWS Console for details:"
        echo "https://console.aws.amazon.com/codesuite/codedeploy/deployments/${DEPLOYMENT_ID}"
        exit 1
    fi
    
    sleep 10
done

echo ""
echo "🎉 Your Restaurant API is now live!"
echo ""
