import express from 'express';
import { handleRazorpayWebhook } from './controllers/webhook.controller.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount the webhook route
app.post('/webhook/razorpay', handleRazorpayWebhook);

app.get('/', (req, res) => {
  res.send('Autonomous AI Revenue Recovery Agent is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
