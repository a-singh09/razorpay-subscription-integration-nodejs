const express = require('express')
const app = express()
const port = 3000
var crypto = require('crypto');

const Razorpay = require('razorpay');

app.use(express.json());


// This razorpayInstance will be used to
// access any resource from razorpay
const razorpayInstance = new Razorpay({
    key_id: 'rzp_test_BOJKRLdGj32zDZ',
    key_secret: 'ARu8uQXsSgsCA6KveDjOWnXt'
});

app.post('/createOrder', (req, res) => {

    const { quantity } = req.body;

    razorpayInstance.subscriptions.create({
        plan_id: "plan_Ksun3nBTATeHB7",
        customer_notify: 1,
        quantity: quantity,
        total_count: 6
    }, (err, order) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("order created");
            res.json(order);
        }
    });

});


app.post('/verifyOrder', (req, res) => {

    // Receive Payment Data
    const { order_id, payment_id } = req.body;
    const razorpay_signature = req.headers['x-razorpay-signature'];

    // Pass yours key_secret here
    const key_secret = 'ARu8uQXsSgsCA6KveDjOWnXt';

    // Verification & Send Response to User

    // Creating hmac object
    let hmac = crypto.createHmac('sha256', key_secret);

    // Passing the data to be hashed
    hmac.update(order_id + "|" + payment_id);

    // Creating the hmac in the required format
    const generated_signature = hmac.digest('hex');


    if (razorpay_signature === generated_signature) {
        res.json({ success: true, message: "Payment has been verified" })
    }
    else
        res.json({ success: false, message: "Payment verification failed" })
});



app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
