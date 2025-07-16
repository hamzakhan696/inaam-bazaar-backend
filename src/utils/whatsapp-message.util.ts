import axios from 'axios';

export async function sendWhatsAppSignupTemplate(to: string) {
  // Use HTTPS URL for WhatsApp button, with phone as query param
  const signupUrl = `https://universal-link-plum.vercel.app/signup?phone=${to}`;
  console.log('Signup URL:', signupUrl); // Debug log
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'signup_win', // updated template name
      language: { code: 'en_US' },
      components: [
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            { type: 'text', text: signupUrl } // send HTTPS link with number
          ]
        }
      ]
    }
  };
  console.log('WhatsApp API Payload:', JSON.stringify(data, null, 2)); // Debug log
  try {
    await axios.post(
      'https://graph.facebook.com/v19.0/684177008114996/messages',
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to send WhatsApp signup template', error?.response?.data || error.message);
    // Fallback to simple text message
    await sendSimpleTextMessage(to, `Click below to complete sign-up 👇 ${signupUrl}`);
  }
}

export async function sendWhatsAppLoginTemplate(to: string, token: string) {
  // Prevent double URL: extract JWT if a full URL is passed
  let jwtToken = token;
  if (typeof token === 'string' && token.startsWith('http')) {
    try {
      const url = new URL(token);
      jwtToken = url.searchParams.get('token') || token;
    } catch {
      // fallback: use as is
    }
  }
  // Send only the JWT token as the parameter for the WhatsApp template
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'login_app', // must match the template name in WhatsApp Manager
      language: { code: 'en_US' },
      components: [
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            { type: 'text', text: jwtToken } // Only JWT token, not full URL
          ]
        }
      ]
    }
  };
  try {
    await axios.post(
      'https://graph.facebook.com/v19.0/684177008114996/messages',
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Failed to send WhatsApp login template', error?.response?.data || error.message);
    // Fallback to simple text message
    const loginUrl = `https://universal-link-plum.vercel.app/dashboard?token=${jwtToken}`;
    await sendSimpleTextMessage(to, `Welcome back! Tap to login: ${loginUrl}`);
  }
}

// Simple text message function that will definitely work
export async function sendSimpleTextMessage(to: string, text: string) {
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: {
      body: text
    }
  };
  try {
    await axios.post(
      'https://graph.facebook.com/v19.0/684177008114996/messages',
      data,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Simple text message sent successfully');
  } catch (error) {
    console.error('Failed to send simple text message', error?.response?.data || error.message);
  }
} 