import express from 'express';
import cors from 'cors';
import { handleRazorpayWebhook } from './controllers/webhook.controller.js';
import { metricsService } from './services/recovery/metrics.service.js';
import dotenv from 'dotenv';
import { simulateBatch } from './controllers/simulation.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/metrics', (req, res) => {
  res.json(metricsService.getMetrics());
});

app.get('/api/audit-logs', (req, res) => {
  res.json(metricsService.getAuditLogs());
});

app.get('/api/audit-logs/:id', (req, res) => {
  const journey = metricsService.getPaymentJourney(req.params.id);
  if (!journey) {
    res.status(404).json({ error: 'Payment journey not found' });
    return;
  }
  res.json(journey);
});

app.post('/api/simulate', simulateBatch);

app.post('/webhook/razorpay', handleRazorpayWebhook);

app.get('/', (req, res) => {
  res.send('Autonomous AI Revenue Recovery Agent is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
