# System Architecture: AI Revenue Recovery Engine

The core pipeline operates on a continuous feedback loop from the Razorpay Webhook, routing through deterministic and probabilistic risk models before autonomous execution.

## Flow Diagram

```mermaid
graph TD
    A[Razorpay Webhook] --> B(Deterministic Risk Engine)
    B -->|Micro-tx < ₹500 / Permanent Fraud| C[Halt / Escalate]
    B -->|Eligible Failure| D{AI Diagnostic Model}
    D -->|Authentication Error| E[Action: PAYMENT_LINK]
    D -->|Temporary Decline| F[Action: RETRY]
    D -->|High Risk / Unknown| G[Action: ESCALATE]
    D -->|Terminal Error| H[Action: HALT]
    
    E --> I[Generate Custom Payment Link via API]
    F --> J[Schedule Retry via Gateway]
    G --> K[Flag to Human Operator]
    
    style A fill:#1a1a1a,stroke:#333,color:#fff
    style B fill:#333,stroke:#555,color:#fff
    style D fill:#2b4c7e,stroke:#3b6baf,color:#fff
    style C fill:#4a1c1c,stroke:#732828,color:#fff
    style H fill:#4a1c1c,stroke:#732828,color:#fff
```

## Core Philosophy: Risk Engine vs. LLM Synergy

Relying solely on LLMs for financial operations is cost-prohibitive and poses unnecessary risks. This architecture utilizes a **hybrid evaluation model**.

The **Deterministic Risk Engine** acts as the primary gatekeeper. It rapidly filters out non-recoverable transactions (e.g., permanent fraud flags or micro-transactions under ₹500) using hardcoded logic. This ensures cost-efficiency and absolute safety at scale.

The **LLM (OpenRouter/OpenAI)** is invoked *only* for eligible payments. When triggered, the AI Diagnostic Model analyzes the webhook metadata to deduce the root cause, selects the highest-probability recovery channel, and synthesizes dynamic, customer-friendly communication hooks to maximize conversion. 
