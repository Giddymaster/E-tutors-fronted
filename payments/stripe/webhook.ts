import { Request, Response } from 'express';
import { stripe } from '../../services/payment.service';

export const handleStripeWebhook = async (req: Request, res: Response) => {
    const event = req.body;

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Handle successful payment here
            break;
        case 'payment_intent.payment_failed':
            const paymentFailed = event.data.object;
            // Handle failed payment here
            break;
        // Add more event types as needed
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.status(200).send('Webhook received');
};