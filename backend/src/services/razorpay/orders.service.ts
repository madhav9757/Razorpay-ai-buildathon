import { razorpay } from '../../lib/razorpay.js';
import type { RazorpayOrder } from '../../types/razorpay.js';

export const fetchOrders = async (): Promise<RazorpayOrder[]> => {
  try {
    const response = await razorpay.orders.all({
      count: 100,
    });

    return response.items as RazorpayOrder[];
  } catch (error: any) {
    console.error('[Razorpay API] Error fetching orders:', error.message || error);
    return [];
  }
};