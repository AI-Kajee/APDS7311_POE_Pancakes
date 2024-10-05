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




//radhya doing test
export default router

