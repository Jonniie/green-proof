# GreenProof Setup Guide

This guide will walk you through setting up all the required credentials and services for the GreenProof platform.

## Prerequisites

- Node.js 18+ installed
- MongoDB (local or cloud)
- Git

## Step 1: Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd green-proof
npm install
```

## Step 2: Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Now let's get each credential:

### 2.1 Hedera Configuration

**For Development/Testing:**

1. Go to [Hedera Portal](https://portal.hedera.com/)
2. Create a new account (free for testnet)
3. Generate a new key pair
4. Copy the Account ID and Private Key

**For Production:**

1. Use Hedera mainnet
2. Purchase HBAR tokens for your account
3. Follow the same steps as above

**Example:**

```
HEDERA_NETWORK=testnet
HEDERA_OPERATOR_ID=0.0.123456
HEDERA_OPERATOR_KEY=302e020100300506032b6570042204201234567890abcdef...
```

### 2.2 Guardian Configuration

Guardian is the framework for verifiable credentials on Hedera.

**Option 1: Use Guardian Demo Instance**

- For testing, you can use the public Guardian demo
- Set `GUARDIAN_API_URL=https://guardian-demo.hashgraph.com`
- Use demo API key (check Guardian documentation)

**Option 2: Self-Host Guardian**

1. Follow [Guardian Setup Guide](https://docs.hedera.com/guardian/)
2. Deploy Guardian to your infrastructure
3. Get API credentials from your Guardian admin

**Option 3: Use Guardian Cloud Service**

1. Sign up for Guardian cloud service
2. Get API credentials from your dashboard

### 2.3 Database Configuration

**Option 1: Local MongoDB**

```bash
# Install MongoDB locally
sudo apt-get install mongodb  # Ubuntu/Debian
brew install mongodb-community  # macOS

# Start MongoDB
sudo systemctl start mongodb  # Ubuntu/Debian
brew services start mongodb-community  # macOS

# Set in .env
MONGODB_URI=mongodb://localhost:27017/greenproof
```

**Option 2: MongoDB Atlas (Recommended for Production)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Get connection string
5. Set in .env:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greenproof
```

**Option 3: Docker**

```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Set in .env
MONGODB_URI=mongodb://localhost:27017/greenproof
```

### 2.4 JWT Secret

Generate a secure random string:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output to your .env file:

```
JWT_SECRET=your_generated_secret_here
```

## Step 3: Optional Services

### 3.1 File Storage (AWS S3)

For production file uploads:

1. Create AWS account
2. Create S3 bucket
3. Create IAM user with S3 access
4. Add to .env:

```
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
```

### 3.2 Email Service

For notifications:

1. Use Gmail SMTP or other email service
2. Add to .env:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## Step 4: Start the Application

### Development Mode

```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately
npm run server  # Backend on port 5000
npm run dev     # Frontend on port 5173
```

### Production Mode

```bash
# Build frontend
npm run build

# Start production server
NODE_ENV=production npm run server
```

## Step 5: Verify Setup

1. **Backend Health Check**: Visit `http://localhost:5000/api/health`
2. **Frontend**: Visit `http://localhost:5173`
3. **Database**: Check MongoDB connection in server logs
4. **Hedera**: Test connection in server logs

## Troubleshooting

### Common Issues

**MongoDB Connection Error:**

- Ensure MongoDB is running
- Check connection string format
- Verify network access

**Hedera Connection Error:**

- Verify account ID and private key
- Check network (testnet/mainnet)
- Ensure account has sufficient HBAR

**Guardian API Error:**

- Verify API URL and key
- Check Guardian service status
- Ensure proper authentication

**Port Already in Use:**

- Change PORT in .env
- Kill existing processes: `lsof -ti:5000 | xargs kill`

### Getting Help

- Check server logs for detailed error messages
- Verify all environment variables are set correctly
- Ensure all services are running and accessible

## Security Notes

1. **Never commit .env file** - it's already in .gitignore
2. **Use strong JWT secrets** - generate cryptographically secure random strings
3. **Secure Hedera keys** - store private keys securely
4. **Production deployment** - use environment-specific configurations
5. **HTTPS in production** - always use SSL/TLS for production deployments

## Next Steps

Once your environment is set up:

1. **Test Authentication**: Register and login users
2. **Create Products**: Add your first sustainable products
3. **Issue Credentials**: Create and verify sustainability credentials
4. **Generate QR Codes**: Test product traceability
5. **Monitor Dashboard**: Check analytics and metrics

Your GreenProof platform is now ready for development and testing!
