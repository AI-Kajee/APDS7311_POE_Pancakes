import express from "express";
import db from "../db/conn.mjs";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import sanitize from 'mongo-sanitize';
import checkauth from "../check-auth.mjs"; 


const router = express.Router();
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);


// Protected route for Dashboard
router.get("/dashboard", checkauth, (req, res) => {
    res.status(200).json({ message: `Welcome to the dashboard, ${req.user.username}` });
});

// Protected route for Payment
router.get("/payment", checkauth, (req, res) => {
    res.status(200).json({ message: "Accessing payment page" });
});

//sign up
router.post("/signup", async (req, res) => {
    console.log(req.body);
    const namePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const fullName = sanitize(req.body.fullName);
    const username = sanitize(req.body.username);
    const idNumber = sanitize(req.body.idNumber);
    const accountNumber = sanitize(req.body.accountNumber);
    const password = sanitize(req.body.password);
    const confirmPassword = sanitize(req.body.confirmPassword);

     // Regex to check for email patterns
     const emailPattern = /[\w._%+-]+@[\w.-]+\.(com|org|net|gov|edu|mil|info|io|co|biz|me|app|us|xyz|online|store)/i;


    // Validate fullName and username against email patterns
    if (emailPattern.test(fullName)) {
        return res.status(400).json({ message: "Full Name cannot be an email." });
    }
    if (emailPattern.test(username)) {
        return res.status(400).json({ message: "Username cannot be an email." });
    }
     
    if (!namePattern.test(username)) {
        return res.status(400).json({ message: "Invalid username." });
    }
    if (!passwordPattern.test(password)) {
        return res.status(400).json({ message: "Password must meet criteria." });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log("Hashed Password:", hashedPassword);
        let newUser = { fullName, username, idNumber, accountNumber, password: hashedPassword };
        const collection = await db.collection("users");
        await collection.insertOne(newUser);

        // Return success without redirect
        res.status(201).json({ message: "User registered successfully." });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed." });
    }
});




// Login
router.post("/login", bruteforce.prevent, async (req, res) => {
    console.log("Request Body:", req.body);

    const { username, accountNumber, password } = req.body;

    const namePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // Validate inputs
    if (!namePattern.test(username)) {
        console.error("Invalid username format");
        return res.status(400).json({ message: "Invalid username." });
    }
    if (!namePattern.test(accountNumber)) {
        console.error("Invalid account number format");
        return res.status(400).json({ message: "Invalid account number." });
    }
    if (!passwordPattern.test(password)) {
        console.error("Invalid password format");
        return res.status(400).json({ message: "Invalid password." });
    }

    try {
        const collection = db.collection("users");
        const user = await collection.findOne({ username, accountNumber });

        if (!user) {
            console.error("User not found");
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.error("Incorrect password");
            return res.status(401).json({ message: "Authentication failed: Incorrect password." });
        }

        //session string
        req.session.username = user.username;

        const token = jwt.sign(
            { username: user.username, accountNumber: user.accountNumber }, 
            "this_secret_should_be_longer_than_it_is", 
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Authentication successful", token, name: user.username });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed due to a server error." });
    }
});
/*
router.get("/profile", async (req, res) => {
    try {
        if (!req.session.username) {
            return res.status(401).json({ message: "Not logged in." });
        }

        const collection = db.collection("users");
        const user = await collection.findOne({ username: req.session.username });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({ fullName: user.fullName });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching user profile." });
    }
});*/


router.post("/pay", checkauth, async (req, res) => {
  const { amount, currency, provider, accountHolder, accountNumber, reference, swiftCode } = req.body;

  // Validate required fields
  if (!amount || !currency || !provider || !accountHolder || !accountNumber || !reference || !swiftCode) {
    return res.status(400).send({ message: "All fields are required." });
  }

  // Specific validation: amount should be a number greater than 0
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).send({ message: "Invalid amount provided." });
  }

  try {
    // Hash swift code and account number
    const hashedAccountNumber = await bcrypt.hash(accountNumber, 10);
    const hashedSwiftCode = await bcrypt.hash(swiftCode, 10);

    // Log hashed values for debugging
    console.log('Hashed Account Number:', hashedAccountNumber);
    console.log('Hashed Swift Code:', hashedSwiftCode);

    const paymentData = {
      amount,
      currency,
      provider,
      accountHolder,
      accountNumber: hashedAccountNumber, // Save hashed account number
      swiftCode: hashedSwiftCode,         // Save hashed swift code
      reference,
    };

    console.log('Payment data to insert:', paymentData);

    let collection = await db.collection("payments");
    let result = await collection.insertOne(paymentData);
    console.log('Payment processed successfully:', result);
    res.status(201).send({ message: "Payment processed successfully", result });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send({ message: "Error processing payment. Please try again later." });
  }
});

  router.get("/hello", async (req, res) => {
    console.log("Hello World!");
  });


//radhya doing test
export default router

