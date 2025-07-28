# phpMyAdmin Setup Guide for Inaam Bazaar

## Option 1: Using MAMP (Easiest for macOS)

### Step 1: Install MAMP
1. Download MAMP from https://www.mamp.info/
2. Install MAMP on your Mac
3. Open MAMP application

### Step 2: Start Services
1. Click "Start Servers" in MAMP
2. Wait for Apache and MySQL to start (green indicators)

### Step 3: Access phpMyAdmin
1. Open your browser
2. Go to: `http://localhost:8888/phpMyAdmin`
3. Login with:
   - Username: `root`
   - Password: (leave empty)

### Step 4: Connect to Your Database
1. In phpMyAdmin, you should see your `inaam-bazaar` database
2. Click on it to view all tables
3. You can browse, edit, and manage your data

## Option 2: Using Docker (Professional Setup)

### Prerequisites
Make sure you have Docker Desktop installed on your Mac.

### Step 1: Start Services
```bash
# Navigate to your project directory
cd /Users/apple/Documents/Project/inaam-bazaar-backend

# Start MySQL and phpMyAdmin
docker-compose up -d
```

### Step 2: Access phpMyAdmin
1. Open your browser
2. Go to: `http://localhost:8080`
3. Login with:
   - Username: `root`
   - Password: (leave empty)

### Step 3: Stop Services (when done)
```bash
docker-compose down
```

## Your Database Configuration
Based on your .env file:
- Database Name: `inaam-bazaar`
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: (empty)

## Troubleshooting

### If you can't connect:
1. Make sure MySQL is running
2. Check if port 3306 is available
3. Verify your .env file configuration
4. Try restarting the services

### If you don't see your database:
1. Make sure your NestJS app has run at least once
2. Check if the database was created automatically
3. You may need to create the database manually in phpMyAdmin

## Database Tables You Should See
Once connected, you should see these tables:
- `user` - User accounts
- `product` - Products
- `category` - Product categories
- `order` - Orders
- `order_item` - Order items
- `customer` - Customer information
- `lottery` - Lottery items
- `inventory` - Inventory management
- And more...

## Next Steps
1. Start your NestJS application: `npm run start:dev`
2. Access phpMyAdmin to view your database
3. You can now browse, edit, and manage your data through the web interface 