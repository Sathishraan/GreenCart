import { request } from "express";
import Stripe from "stripe";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";


export const placeOderCOD = async (req, res) => {

    try {

        const { userId, items, address } = req.body;

        if (!address || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid data"
            })
        }

        let amount = await items.reduce(async (acc, item) => {

            const product = await Product.findById(item.product);

            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'COD',


        });

        return res.json({
            success: true,
            message: "place oder"
        })




    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}



export const stripeWebhooks =  async(req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Verify the event using Stripe's webhook secret
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEB_HOOKS
        );
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Event verified successfully
    console.log(`✅ Webhook received: ${event.type}`);

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;
            console.log("✅ Payment succeeded:", paymentIntent.id);
            // Handle successful payment
            // Update order status, send confirmation email, etc.
            break;
        }

        case "checkout.session.completed": {
            const session = event.data.object;
            console.log("✅ Checkout session completed:", session.id);
            // Handle completed checkout
            // This is often where you'd fulfill the order
             await handleCheckoutSessionCompleted(session);
            break;
        }

        case "charge.succeeded": {
            const charge = event.data.object;
            console.log("✅ Charge succeeded:", charge.id);
            // Handle successful charge
            // This happens when payment is captured
            break;
        }

        case "payment_intent.created": {
            const paymentIntent = event.data.object;
            console.log("✅ Payment intent created:", paymentIntent.id);
            // Handle payment intent creation
            // Usually just for logging/tracking
            break;
        }

        case "charge.updated": {
            const charge = event.data.object;
            console.log("✅ Charge updated:", charge.id, "Status:", charge.status);
            // Handle charge updates (status changes, etc.)
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            console.log("❌ Payment failed:", paymentIntent.id);
            // Handle failed payments
            // Send failure notification, update order status
            break;
        }

        case "invoice.payment_succeeded": {
            const invoice = event.data.object;
            console.log("✅ Invoice payment succeeded:", invoice.id);
            // Handle subscription payments
            break;
        }

        case "customer.subscription.created": {
            const subscription = event.data.object;
            console.log("✅ Subscription created:", subscription.id);
            // Handle new subscriptions
            break;
        }

        default:
            console.log(`ℹ️ Unhandled event type: ${event.type}`);
        // You can choose to log these or ignore them
    }

    res.json({ received: true });
};

// Helper function to handle checkout session completion
 async function handleCheckoutSessionCompleted(session) {
    try {
        // Example: Update order in database
        console.log("Processing checkout session:", {
            sessionId: session.id,
            customerId: session.customer,
            customerEmail: session.customer_details?.email,
            paymentStatus: session.payment_status,
            amountTotal: session.amount_total,
            currency: session.currency
        });

        console.log("Processing checkout session:", {
            sessionId: session.id,
            metadata: session.metadata // 👈 This logs the entire metadata object
          });
          

    // ✅ HERE! This line gets the order ID from metadata
    const orderId = session.metadata.orderid;
    
    if (!orderId) {
      console.error("❌ No order ID found in session metadata");
      return;
    }
    
    // ✅ Then uses that order ID to update the database
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId, // 👈 This is the order ID from metadata
      {
        isPaid: true,
        status: "Confirmed",
        // ... other updates
      }
    );
    
    } catch (error) {
        console.error("Error processing checkout session:", error);
    }
}
export const placeOderStripe = async (req, res) => {

    try {

        const { userId, items, address } = req.body;

        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid data"
            })
        }
        let productData = []

        let amount = await items.reduce(async (acc, item) => {

            const product = await Product.findById(item.product);

            productData.push({

                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity
            })

            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: 'online',


        })

        //Stripe gateway initization

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = productData.map((item) => {

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Math.floor(item.price + item.price * 0.2) * 100
                },
                quantity: item.quantity,
            }

        })

        //create session


        const session = await stripeInstance.checkout.sessions.create({

            line_items,
            mode: 'payment',
            success_url: `${origin}/loader?next=myorder`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderid: order._id.toString(),
                userId
            }

        })



        return res.json({
            success: true,
            url: session.url
        })


    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}



export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;



        const orders = await Order.find({
            userId: userId, // ✅ match your DB field
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        })
            .populate("items.product address")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });

    } catch (error) {
        console.log(error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};


export const getAllOrders = async (req, res) => {

    try {


        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        })

    } catch (error) {
        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })


    }

}