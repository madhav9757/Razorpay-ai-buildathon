# AI Revenue Recovery Engine

<video src="./video/New%20project.mp4" controls width="100%"></video>

**An autonomous payment failure diagnostics and recovery agent designed to capture lost revenue without human intervention.**

Payment drop-offs due to gateway failures, authentication drops, or insufficient funds represent a massive leak in e-commerce revenue streams. Traditional systems simply mark these as "failed" and rely on manual follow-ups or generic automated emails that yield low conversion rates. 

The **AI Revenue Recovery Engine** replaces this static process with an intelligent, multi-agent AI system. It intercepts payment failure events in real-time, quantitatively analyzes the financial viability of recovery, uses Large Language Models (LLMs) to diagnose the exact root cause, and automatically executes the highest-converting recovery action—such as generating dynamic payment links, scheduling silent retries, or escalating to human support.

---

## How It Works: The Recovery Pipeline

The system is designed as a rigid pipeline where deterministic security rules protect probabilistic AI agents. 

### 1. Real-Time Webhook Ingestion
The process initiates the millisecond a transaction fails. The engine listens to `payment.failed` webhooks directly from the Razorpay gateway. This payload contains rich metadata, including the payment amount, currency, error codes, error descriptions, and customer contact information. By relying on webhooks rather than polling, the system guarantees real-time interception and minimal latency.

### 2. Deterministic Risk Filtering
Before any AI processing occurs, the system protects itself against financial loss and malicious activity through hardcoded rules:
- **Velocity Guardrails:** If a single customer identity (email or phone) triggers multiple failures in a 60-second window, the system halts to prevent brute-force card testing attacks.
- **Economic Viability:** Transactions below ₹500, or those flagged as permanent fraud, are immediately dropped. The system mathematically ensures that the cost of invoking the AI (LLM tokens + operational costs) does not exceed the Expected Value of Recovery (EVR).

### 3. AI-Powered Diagnostics
Transactions that pass the security gate are routed to the Multi-Agent AI Chain (powered by OpenAI/OpenRouter APIs). Instead of a single generic prompt, the system uses distinct AI roles:
- The **Diagnostic Node** parses the Razorpay error signature (e.g., `BAD_REQUEST_ERROR`, `GATEWAY_ERROR`) to determine the *actual* human-readable root cause (e.g., "The customer's session timed out" or "The bank required OTP but it wasn't entered").
- The **Policy Node** takes this diagnosis and decides on a strict operational action (`PAYMENT_LINK`, `RETRY`, `ESCALATE`, or `HALT`).

### 4. Autonomous Recovery Execution
Once the AI chain reaches a decision, the system maps it to an automated execution protocol:
- **`PAYMENT_LINK` (Active Intervention):** If the failure requires the customer to try again (e.g., incorrect OTP, expired card), the system hits the Razorpay API to generate a fresh, secure Payment Link. A Generative AI node then drafts a highly personalized, polite message (e.g., *"Hi, it looks like your bank session timed out. You can complete your purchase here: [Link]"*) for immediate dispatch via SMS or WhatsApp.
- **`RETRY` (Passive Intervention):** If the failure was due to a transient bank or gateway outage, bothering the customer creates unnecessary friction. The system queues the transaction for an automated, silent retry later when infrastructure stabilizes.
- **`ESCALATE`:** High-value transactions with ambiguous failure reasons are flagged directly to the human operator dashboard, complete with the AI's diagnostic notes, allowing support agents to call the customer directly.
- **`HALT`:** Definitive failures (e.g., stolen card flags) are permanently aborted to maintain gateway compliance.

### 5. Analytics & Dashboard
Every decision made by the AI, along with the subsequent recovery status, is indexed into a database. This powers a real-time admin dashboard where operators can view total revenue recovered, AI confidence scores, and categorical breakdowns of why payments are failing across their platform.

---

## Built-In Synthetic Test Suite

Validating an autonomous financial AI in a local environment is challenging because real payment failures cannot be predictably triggered on demand. 

To solve this, the project ships with a deterministic scenario simulator (`synthetic-injector.ts`). When activated, this simulator injects a continuous stream of mocked Razorpay webhook payloads into the local server. 

The test suite covers 10 distinct, mathematically modeled scenarios that force the AI to route through all 4 recovery branches (`PAYMENT_LINK`, `RETRY`, `ESCALATE`, `HALT`). This allows developers to observe the AI's decision-making logic, test the velocity rate-limiters, and verify the frontend dashboard's real-time updates—all without touching a live payment gateway.

---

## 🛠️ Project Documentation

We have modularized our documentation for clarity. Please refer to the specific guides below:

- 🏗️ **[System Architecture Guide](ARCHITECTURE.md):** Deep dive into the multi-agent prompt chains, Idempotency layers, and Expected Value of Recovery (EVR) mathematical models.
- ⚙️ **[Local Setup & Quickstart](SETUP.md):** Step-by-step instructions for installing dependencies, configuring `.env` keys, and booting up the development servers.
- 🚀 **[Future Scope & Scalability](FUTURE.md):** Our roadmap for scaling to millions of transactions using distributed Go microservices and Redis Pub/Sub.