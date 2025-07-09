import axios from 'axios';

export async function sendWhatsAppSignupTemplate(to: string) {
  const data = {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: 'signup_link',
      language: { code: 'en_US' },
      components: [
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            { type: 'text', text: 'winbazar://dashboard' }
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
    console.error('Failed to send WhatsApp signup template', error?.response?.data || error.message);
    // Fallback to simple text message
    await sendSimpleTextMessage(to, `Click below to complete sign-up 👇 winbazar://dashboard`);
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