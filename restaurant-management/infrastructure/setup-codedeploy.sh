#!/bin/bash

# AWS CodeDeploy Setup Script
# Creates CodeDeploy application and deployment group

set -e

REGION="us-east-1"
APP_NAME="RestaurantAPI"
DEPLOYMENT_GROUP="Production"
S3_BUCKET="restaurant-api-deployments"

echo "========================================="
echo "AWS CodeDeploy Setup"
echo "========================================="
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Get AWS Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS Account ID: ${ACCOUNT_ID}"
echo ""

# Create S3 bucket for deployments
echo "📦 Creating S3 bucket for deployments..."
if aws s3 ls s3://${S3_BUCKET} 2>&1 | grep -q 'NoSuchBucket'; then
    aws s3 mb s3://${S3_BUCKET} --region ${REGION}
    echo "✓ S3 bucket created: ${S3_BUCKET}"
else
    echo "✓ S3 bucket already exists: ${S3_BUCKET}"
fi
echo ""

# Create CodeDeploy Application
echo "🚀 Creating CodeDeploy application..."
if aws deploy get-application --application-name ${APP_NAME} --region ${REGION} 2>&1 | grep -q 'ApplicationDoesNotExistException'; then
    aws deploy create-application \
        --application-name ${APP_NAME} \
        --compute-platform Server \
        --region ${REGION}
    echo "✓ CodeDeploy application created: ${APP_NAME}"
else
    echo "✓ CodeDeploy application already exists: ${APP_NAME}"
fi
echo ""

# Create Service Role for CodeDeploy (if not exists)
echo "🔐 Setting up IAM role for CodeDeploy..."
ROLE_NAME="CodeDeployServiceRole"

if ! aws iam get-role --role-name ${ROLE_NAME} 2>&1 | grep -q 'NoSuchEntity'; then
    echo "✓ Role already exists: ${ROLE_NAME}"
else
    # Create trust policy
    cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codedeploy.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    # Create role
    aws iam create-role \
        --role-name ${ROLE_NAME} \
        --assume-role-policy-document file:///tmp/trust-policy.json \
        --description "Service role for AWS CodeDeploy"

    # Attach policy
    aws iam attach-role-policy \
        --role-name ${ROLE_NAME} \
        --policy-arn arn:aws:iam::aws:policy/AWSCodeDeployRole

    echo "✓ IAM role created: ${ROLE_NAME}"
    rm /tmp/trust-policy.json
fi

ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${ROLE_NAME}"
echo "   Role ARN: ${ROLE_ARN}"
echo ""

# Create Deployment Group
echo "👥 Creating deployment group..."
echo ""
echo "⚠️  IMPORTANT: Make sure your EC2 instances have the following tag:"
echo "   Key: Name"
echo "   Value: RestaurantAPI"
echo ""
read -p "Have you tagged your EC2 instance? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please tag your EC2 instance first, then run this script again."
    exit 1
fi

if aws deploy get-deployment-group \
    --application-name ${APP_NAME} \
    --deployment-group-name ${DEPLOYMENT_GROUP} \
    --region ${REGION} 2>&1 | grep -q 'DeploymentGroupDoesNotExistException'; then
    
    aws deploy create-deployment-group \
        --application-name ${APP_NAME} \
        --deployment-group-name ${DEPLOYMENT_GROUP} \
        --deployment-config-name CodeDeployDefault.OneAtATime \
        --ec2-tag-filters Key=Name,Value=RestaurantAPI,Type=KEY_AND_VALUE \
        --service-role-arn ${ROLE_ARN} \
        --region ${REGION}
    
    echo "✓ Deployment group created: ${DEPLOYMENT_GROUP}"
else
    echo "✓ Deployment group already exists: ${DEPLOYMENT_GROUP}"
fi
echo ""

echo "========================================="
echo "✅ CodeDeploy Setup Complete!"
echo "========================================="
echo ""
echo "Configuration Summary:"
echo "  Application: ${APP_NAME}"
echo "  Deployment Group: ${DEPLOYMENT_GROUP}"
echo "  S3 Bucket: ${S3_BUCKET}"
echo "  Region: ${REGION}"
echo ""
echo "Next steps:"
echo "1. Make sure your EC2 instance has:"
echo "   - CodeDeploy Agent installed"
echo "   - Tag: Name=RestaurantAPI"
echo "   - IAM role with permissions for DynamoDB and S3"
echo ""
echo "2. Deploy your application:"
echo "   cd backend && ./deploy.sh"
echo ""
