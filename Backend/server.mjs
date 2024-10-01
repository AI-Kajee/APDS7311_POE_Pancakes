import https from "https";
import http from "http";
import fs from "fs";
import posts from "./routes/post.mjs";
import users from "./routes/user.mjs";
import express from "express";
import cors from "cors";
import helmet from "helmet"; // Import helmet for security
import rateLimit from "express-rate-limit"; // Import rate limiter
import brute from "express-brute";


const PORT = 3001;
const app = express();

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};


// Middleware for CORS
app.use(cors());
app.use(express.json());


// Set security headers using Helmet (Protection against clickjacking)
app.use(helmet());


// Prevent clickjacking by setting the X-Frame-Options header
app.use(helmet.frameguard({ action: 'deny' }));


// Set Content Security Policy (CSP) to prevent clickjacking via embedding via iframes
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        frameAncestors: ["'none'"], // Disallow any source from embedding the site
    },
}));


// Enforce HTTPS for one year
app.use(helmet.hsts({ maxAge: 60 * 60 * 24 * 365 }));

// Hide the "X-Powered-By" header
app.use(helmet.hidePoweredBy());


// Rate limiting middleware (DDoS protection)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Set CORS headers manually
app.use((reg, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

// Use routes
app.use("/post",posts);
app.route("/post", posts);
app.use("/user", users);
app.use("/user",users)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});


// Create HTTPS server
let server = https.createServer(options, app);


server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});
