import express from "express";
import db from "../db/conn.mjs";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import sanitize from 'mongo-sanitize';

const router = express.Router();
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

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
    const { username, password, accountNumber } = req.body;

    const namePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!namePattern.test(username) || !passwordPattern.test(password)) {
        return res.status(400).json({ message: "Invalid input data." });
    }

    try {
        const collection = db.collection("users");
        const user = await collection.findOne({ username, accountNumber });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed: Incorrect password." });
        }

        const token = jwt.sign(
            { username: user.username, accountNumber: user.accountNumber }, 
            "this_secret_should_be_longer_than_it_is", 
            { expiresIn: "1h" }
        );

        // Send the token back to the client instead of redirecting
        res.status(200).json({ message: "Authentication successful", token: token, name: user.username });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed due to a server error." });
    }
});



//radhya doing test
export default router

