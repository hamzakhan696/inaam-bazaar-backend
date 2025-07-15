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
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'login_link',
      language: { code: 'en' },
      components: [
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            { type: 'text', text: `winbazar://dashboard?token=${token}` }
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
    await sendSimpleTextMessage(to, `Welcome back! Tap to login: winbazar://dashboard?token=${token}`);
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