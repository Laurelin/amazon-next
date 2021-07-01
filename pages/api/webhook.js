import { buffer } from 'micro';
import * as admin from 'firebase-admin';

// run this command to debug:
// stripe listen --forward-to localhost:3000/api/webhook

// connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// backend connection to firebase
const serviceAccount = {
  type: 'service_account',
  project_id: 'next-ead37',
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: 'firebase-adminsdk-4vxzu@next-ead37.iam.gserviceaccount.com',
  client_id: '112153690685421676781',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4vxzu%40next-ead37.iam.gserviceaccount.com'
};

console.log('service account:', serviceAccount);

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  : admin.app();

console.log('app:', app);

const fulfillOrder = async (session) => {
  console.log('Fulfilling order: ', session);
  return app
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping / 100,
      images: JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => console.log(`SUCCESS: Order ${session.id} has been added to the DB`));
};

export default async function webhook(req, res) {
  if (req.method === 'POST') {
    // get signature from request(hopefully from stripe)
    console.log('first webhook request:', req);
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers['stripe-signature'];

    let event;

    // verify event is from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('session completed event (session):', session);
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};
