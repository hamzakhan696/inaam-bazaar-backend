# WhatsApp Business API Setup Guide

## Current Configuration
- **Phone Number ID**: `684177008114996`
- **API Version**: `v19.0`
- **Templates**: `signup_win`, `login_app`

## Required Environment Variables

Add these to your `.env` file:

```env
# WhatsApp Configuration
WHATSAPP_ACCESS_TOKEN=your_permanent_access_token_here
WHATSAPP_VERIFY_TOKEN=your_webhook_verify_token_here
WHATSAPP_PHONE_NUMBER_ID=684177008114996

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=inaam_bazaar

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com
```

## Facebook Developer Console Setup

### 1. Access Token Configuration
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Navigate to your WhatsApp Business App
3. Go to **WhatsApp > Getting Started**
4. **Generate a Permanent Access Token:**
   - Click on "Generate Token"
   - Select "Never" for expiration
   - Copy the token and update your `.env` file

### 2. Webhook Configuration
1. Go to **WhatsApp > Configuration**
2. Set your **Webhook URL** to:
   ```
   https://your-backend-domain.com/webhook/whatsapp
   ```
3. Set **Verify Token** to match your `.env` file
4. Subscribe to these events:
   - `messages`
   - `message_deliveries`
   - `message_reads`

### 3. Message Templates

#### Template 1: `signup_win`
```
Template Name: signup_win
Category: Marketing
Language: English (en_US)
Header: Welcome to Inaam Bazaar!
Body: Complete your signup to start shopping and winning amazing prizes! 🎉
Button: URL Button
Button Text: Complete Signup
```

#### Template 2: `login_app`
```
Template Name: login_app
Category: Marketing
Language: English (en_US)
Header: Welcome Back!
Body: Click below to login to your account and continue shopping.
Button: URL Button
Button Text: Login Now
```

## Testing Your Setup

### 1. Test Webhook
Send a test message to your WhatsApp number and check if:
- Webhook receives the message
- User gets appropriate response (signup/login template)

### 2. Test Templates
- Send "hi" or any message to your WhatsApp number
- Existing users should receive login template
- New users should receive signup template

### 3. Check Logs
Monitor your backend logs for:
- Webhook verification success
- Message processing
- Template sending success/errors

## Troubleshooting

### Access Token Expired
- Generate a new permanent token
- Update your `.env` file
- Restart your backend

### Webhook Not Receiving Messages
- Verify webhook URL is correct
- Check verify token matches
- Ensure HTTPS is enabled
- Check firewall settings

### Templates Not Sending
- Verify template names match exactly
- Check access token permissions
- Ensure phone number is verified
- Check template approval status

## Security Best Practices

1. **Use Permanent Access Tokens** - Avoid token expiration issues
2. **Secure Webhook URL** - Use HTTPS only
3. **Strong Verify Token** - Use a random, secure string
4. **Environment Variables** - Never commit tokens to code
5. **Rate Limiting** - Implement proper rate limiting
6. **Error Handling** - Log all errors for debugging

## API Endpoints

Your backend exposes these WhatsApp-related endpoints:

- `GET /webhook/whatsapp` - Webhook verification
- `POST /webhook/whatsapp` - Receive messages
- `POST /auth/whatsapp-login` - Login via WhatsApp token

## Monitoring

Monitor these metrics:
- Webhook delivery success rate
- Template sending success rate
- User engagement (signup/login conversion)
- Error rates and types 