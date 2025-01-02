const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
    // Get the token from the 'Authorization' header
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];  // Extract token (e.g., "Bearer <token>")

    if (!token) {
        return res.status(401).json({ success: false, message: 'You must be logged in to checkout' });
    }

    // Verify the token using your JWT secret key
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        // Attach the decoded user data to the request object
        req.user = decoded;
        next();  // Proceed to the next middleware (the checkout logic)
    });
}

module.exports = authenticate;  // Export the middleware
