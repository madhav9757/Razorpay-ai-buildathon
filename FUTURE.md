# Future Scope & Scalability

While this MVP operates perfectly for a hackathon environment, scaling to process millions of transactions per day requires a distributed architecture:

1. **Durable State & Queueing:** Replacing the in-memory metric state with a **PostgreSQL** cluster for permanent audit logs, and introducing a **Redis Pub/Sub** message bus to decouple webhook ingestion from the heavy AI processing tasks.
2. **High-Concurrency Workers:** Migrating the core webhook ingestion and recovery execution nodes to stateless **Go (Golang)** microservices to handle massive concurrent traffic spikes during peak e-commerce sales.
3. **Omnichannel Execution:** Integrating the Meta WhatsApp Business API for rich, interactive messages (e.g., sending a 1-click "Change Payment Method" button directly in WhatsApp instead of a standard SMS).
4. **Dynamic Incentives & Split Payments:** Upgrading the AI agent to offer real-time dynamic EMIs or small discounts if it detects the failure was strictly due to insufficient funds.
