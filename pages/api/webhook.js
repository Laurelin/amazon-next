import { buffer } from 'micro';
import * as admin from 'firebase-admin';

// run this command to debug:
// stripe listen --forward-to localhost:3000/api/webhook

// connection to stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// backend connection to firebase
const serviceAccount = require('../../permissions.json');

const attempt = {
  type: 'service_account',
  project_id: 'next-ead37',
  private_key_id: 'e1d056115c6fa7071c3ac99f063ab16c76283043',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQChStygfO5Iz2Ch\nodiPGYaZQ8QLgjXF5Rhq9U0uSJvb5WSsf0sEsegdoWqfY31UKyZ2yjZkMsDnQYwU\nqfl17UMXTwrnzE9SxMtV4fOk4kpmGWOLxcf/jAlknj5sdeVYPnZfcZuuPbjdV4KC\nZ515MXp9dCulNv5igw0x538RJ9jtaALTnUSqYGXBXEu2lHquD4+gSav9nDKfuG2/\nY1yZxfKsu6umdAsZ/1d4UztLjYN7KKsY4INumXf3VOCLQHmdE8K02WldfvxHbQVf\ndnLpcesWa1JDyi2ww487QOhvhJodG1hb9zWWJs+A4niq80T3NsKt7F2pQpZid49w\nzEl6KkddAgMBAAECgf9+VRUVG1EMMpht8cM5OynsGEcBV80zHHRJgP/y60lXWAAl\niMTzuekkU/yMjbXx8U6zMNZCrMP+q+vtWsh+OIb3J2Zy0z8QODrNjdfb4UPJrOLe\n/H+DY7e5qyFYyuAWRe2n64qIqaEDf1E9rBlG25GZa/fqYKTP2adsna+bmZKk+tJ0\nRCGdldLbWWrL+W78BcNtKGq/B02GGBlHzflu9PyoOGVZ0zBUuvP2I5DVXYiDYaam\nqBJvDAysAWQjr6W95zCA2krlAZpCk13HsSlvstSseaM2maKD6OhARLF8daVOSo8R\n38Ep/9e6+9yk3q50uGzNLIjc+o2+ch1JYpPSreECgYEA0EJfiUKFPLZc//E2UdQk\n2H+BGmGh4nTUtthJRL/X4a/X/wQXbK3rOGAm8kvA77rlWYRKDtfeLEoiLirWx9Id\n8jsoTMBl9XURBpg8HdGql9rckirBybGoPL41GGx+/jvu1k81Pqw++DkG0m0Yx5BD\nwD732XnAkeyLQa3SqhEkbrkCgYEAxkRBR2onAkEsDn7rbP6/ApPJvGek54HRbrw0\nOwZG5kQLEZPhmQAMXpakvq90SWR8wSeO/nlyhmp31Fp45ntBiZ8MrTRprQjWQ0Q7\nfWWapb5b3WVLFu/dWIz0eiqjDmzrOGQG+fXJnecgdGIjKAbgUgGrghZwscovzVlM\ngvrIK8UCgYA6UIuN1LmYMXxDEpjiOuQCV1mgOHxq+8ngVRnXDVz2zhVOTCf+/4gg\n5hOhvwKMXioAceGG3H1Sq4N8p/QySaym+lejfjBOlfQpg5E5zE7XbKpcp2pR/tQc\nBiq55w98Qu3yxoUjQnnzaYx2eaP5pXTDLR6bn9MDSVgJERIvGtO3yQKBgQChpVRz\nnSBgvjHlP6VCIBArUcLQUNApz7Woytjqppt3cVJ06lSsIVX0aG246eOtUrhD4rS6\n1NmCrZs1Du4zO5qbUYlMTcc6xFGsVh0Kh6QmLaVIRCWMddPJNmK8l7aJNFQyjZsC\ngFn420+ik8CGCdUqByKF1TXcPjPrADtZLo204QKBgE5jgfWLVhVMYQYwcm//cBsA\nsAiicn/nUCsKCc4SenHqhmYIZRr/T4N6thUaH8kctrODk6duBAiXpjOmC21UcTft\nCwkTlH9ZcGIzeRTa038oHFtroVBH0mBirDGF0Ow52RSxIasCTj6KyyfV4PcZxwXW\n0DKY0QJMzG2Ac4w3sK6c\n-----END PRIVATE KEY-----\n',
  client_email: 'firebase-adminsdk-4vxzu@next-ead37.iam.gserviceaccount.com',
  client_id: '112153690685421676781',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-4vxzu%40next-ead37.iam.gserviceaccount.com'
};

const app = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
  : admin.app();

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

export default async (req, res) => {
  if (req.method === 'POST') {
    // get signature from request(hopefully from stripe)
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
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`));
    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};
