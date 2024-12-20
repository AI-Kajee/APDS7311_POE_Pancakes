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
import xss from 'xss-clean';
import session from 'express-session';

const PORT = process.env.PORT || 3001;
const app = express(); // Initialize the app here

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
};

app.use(session({
    secret: 'our_big_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true } // set secure true in production
  }));

// Middleware for XSS protection (XSS Clean)
app.use(xss()); // Now you can apply it after app is initialized

// Middleware for CORS
app.use(cors({
    origin: 'https://localhost:3000',
    credentials: true
  }));
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

// Use routes
app.use("/post", posts); // No need to use both app.use and app.route, app.use is sufficient
app.use("/user", users);

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


// Code Attribution

// Securing APIs with express-rate-limit and express-slow-down 
// Source: Mozilla Developer Network. (2023)
// Reference URL: https://developer.mozilla.org/en-US/blog/securing-apis-express-rate-limit-and-slow-down/
// Accessed: 8 October 2024

// Integration of Gemini AI in React
// Author: Adurinti Ashok

// Using HTTPS in React.js Development Environment
// Article: How to Make React.js Use HTTPS in Development
// Published by: SWLH

// mongo-sanitize npm package
// A tool to sanitize MongoDB queries and prevent injection attacks

// express-brute npm package
// Middleware for rate-limiting in Express to guard against brute-force attacks

// MongoDB Update Methods Documentation
// Reference: https://www.mongodb.com/docs/manual/reference/update-methods/
// Provides details on MongoDB update operators and methods for handling data modifications

// Building a Login/Register Application with React, Node.js, and PostgreSQL
// Source: Codegenitor. "Building a Login/Register Application with React, Node.js, and PostgreSQL (Beginner to Advanced)"
// Reference URL: https://codegenitor.medium.com/building-a-login-register-application-with-react-node-js-and-postgres-beginner-to-advanced-1a9fa46c7825

