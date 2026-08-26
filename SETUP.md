# Local Setup & Quickstart

This document explains how to set up the AI Revenue Recovery Engine on your local machine.

## Prerequisites
- Node.js (v18+)
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/madhav9757/Razorpay-ai-buildathon.git
cd Razorpay-ai-buildathon

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory with the following variables:

```env
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
OPENROUTER_API_KEY="your_openrouter_api_key"
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL="http://localhost:3000"
```

### 3. Start Development Servers

Run the backend API and webhook listeners:

```bash
cd backend
npm run dev
```

In a new terminal window, boot the React frontend:

```bash
cd frontend
npm run dev
```
