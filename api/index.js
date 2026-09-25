const express = require('express');
const cors = require('cors');
const SSLCommerzPayment = require('sslcommerz-lts');

const app = express();
app.set('trust proxy', 1);

const configuredFrontendUrl = (
    process.env.FRONTEND_URL ||
    process.env.VITE_FRONTEND_URL ||
    'https://toppers-trust.online'
).replace(/\/+$/, '');
const allowedOrigins = new Set([
    'http://localhost:5173',
    'https://toppers-trust.vercel.app',
    'https://toppers-trust.online',
    configuredFrontendUrl
]);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const store_id = process.env.SSLCOMMERZ_STORE_ID || process.env.SSL_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASS || process.env.SSL_STORE_PASSWD;
const is_live = process.env.SSLCOMMERZ_IS_LIVE === 'true';

const getBaseUrl = (req) => `${req.protocol}://${req.get('host')}`;
const getFrontendUrl = (req) => {
    const candidate = req.body?.value_b || req.get('origin');
    return allowedOrigins.has(candidate) ? candidate : configuredFrontendUrl;
};
const hasPaymentCredentials = () => Boolean(store_id && store_passwd);
const getDashboardUrl = (req, payment, transactionId) => {
    const params = new URLSearchParams({ payment });
    if (transactionId) params.set('tx_id', transactionId);
    return `${getFrontendUrl(req)}/tutor-dashboard?${params.toString()}`;
};

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.post('/api/payment/initiate', async (req, res) => {
    try {
        const { tutorId, tutorName, amount, email, phone } = req.body;
        const numericAmount = Number(amount);

        if (!tutorId || !tutorName || !Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'A tutor, tutor name, and positive payment amount are required.'
            });
        }
        if (!hasPaymentCredentials()) {
            return res.status(503).json({
                success: false,
                message: 'Payment service is not configured.'
            });
        }

        const tran_id = `TT-${Date.now()}-${tutorId}`;
        const baseUrl = getBaseUrl(req);
        const frontendUrl = getFrontendUrl(req);

        const data = {
            total_amount: numericAmount,
            currency: 'BDT',
            tran_id: tran_id,
            success_url: `${baseUrl}/api/payment/success`, 
            fail_url: `${baseUrl}/api/payment/fail`,
            cancel_url: `${baseUrl}/api/payment/cancel`,
            ipn_url: `${baseUrl}/api/payment/ipn`,
            shipping_method: 'NO',
            product_name: 'Profile Advertisement',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: tutorName,
            cus_email: email || 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: phone || '01711111111',
            ship_name: tutorName,
            ship_add1: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: '1000',
            ship_country: 'Bangladesh',
            value_a: tutorId,
            value_b: frontendUrl,
        };

        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const apiResponse = await sslcz.init(data);

        if (apiResponse.status === 'SUCCESS') {
            res.json({
                success: true,
                message: 'Payment session created successfully.',
                redirectUrl: apiResponse.GatewayPageURL,
                transactionId: tran_id
            });
        } else {
            res.status(400).json({ success: false, message: 'SSLCommerz Init Failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/payment/success', async (req, res) => {
    const { tran_id, val_id } = req.body;
    
    try {
        if (!hasPaymentCredentials() || !val_id) {
            return res.redirect(getDashboardUrl(req, 'error'));
        }
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validation = await sslcz.validate({ val_id });

        if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
            res.redirect(getDashboardUrl(req, 'success', tran_id));
        } else {
            res.redirect(getDashboardUrl(req, 'failed'));
        }
    } catch (error) {
        res.redirect(getDashboardUrl(req, 'error'));
    }
});
app.post('/api/payment/fail', (req, res) => {
    res.redirect(getDashboardUrl(req, 'failed'));
});

app.post('/api/payment/cancel', (req, res) => {
    res.redirect(getDashboardUrl(req, 'cancelled'));
});

app.post('/api/payment/ipn', async (req, res) => {
    try {
        if (!hasPaymentCredentials() || !req.body.val_id) {
            return res.status(400).send('Invalid payment notification');
        }
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        const validation = await sslcz.validate({ val_id: req.body.val_id });
        if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
            return res.status(200).send('OK');
        }
        return res.status(400).send('Invalid payment');
    } catch (error) {
        return res.status(500).send('Payment validation failed');
    }
});

module.exports = app;