# Autonomous AI Revenue Recovery Agent

## Features

**Backend (Node.js + Express):**
- **Razorpay Webhook Integration:** Listens to Razorpay payment events (e.g., `payment.failed`).
- **AI Revenue Recovery Engine:** Analyzes payment failure reasons (like `authentication_failed`, `insufficient_balance`, `fraud_suspected`) and automatically acts to recover the revenue by generating new payment links.
- **Metrics Service:** Tracks recovery statistics, including total recovered revenue and recovery rates.
- **Synthetic Webhook Injector:** A testing script (`synthetic-injector.ts`) that simulates various payment failures and successful recoveries for local development and demonstration.

**Frontend (React + Vite + Tailwind CSS):**
- **AI Recovery Dashboard:** A comprehensive dashboard to monitor the AI agent's performance.
- **Live Metrics Display:** Visualizes key performance indicators (KPIs) like Total Revenue Recovered, active recovery attempts, etc.
- **Audit Log:** Displays a detailed, historical log of the AI's actions and decisions for each failed payment.
- **Event Feed:** A real-time feed showing incoming webhook events and the immediate actions taken by the system.

## Implementation Checklist

Here are the main tasks we have completed:

- [x] **Project Setup:** Initialized the project structure with separate `backend` (Express) and `frontend` (React + Vite) directories.
- [x] **Razorpay Integration:** Set up the Razorpay SDK and configured webhook endpoints to securely receive payment events.
- [x] **Recovery Logic:** Implemented the core backend logic to parse failed webhooks, determine the failure reason, and generate Razorpay payment links for recovery.
- [x] **Metrics API:** Created a backend service and API endpoint (`/api/metrics`) to aggregate and serve recovery data.
- [x] **Synthetic Testing:** Built a synthetic injector script to seamlessly test the webhook flow and populate the dashboard with realistic data.
- [x] **Dashboard UI:** Designed and developed the AI Recovery Dashboard frontend using Tailwind CSS and components.
- [x] **Data Integration:** Connected the frontend dashboard to the backend APIs to display real-time Metrics, Audit Logs, and the Event Feed.
