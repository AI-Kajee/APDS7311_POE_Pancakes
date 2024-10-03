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
router.post("/signup", async (req, res) =>{
    const namePattern = /^[a-zA-Z0-9]+$/; // Whitelists alphanumeric names
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least 1 letter and 1 number

    // Sanitize input to avoid XSS and NoSQL injection
    const name = sanitize(req.body.name);
    const password = sanitize(req.body.password);

    if (!namePattern.test(name) || !passwordPattern.test(password)) {
        return res.status(400).send("Invalid input data.");
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        let newDocument = {
            name,
            password: hashedPassword,
        };

        const collection = await db.collection("users");
        const result = await collection.insertOne(newDocument);
        res.status(201).json({ message: "User created successfully." });
        console.log(password);
        res.send(result).status(204);
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Signup failed." });
    }
});


// Login
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password, accountNumber } = req.body;

    // Input validation using RegEx
    const namePattern = /^[a-zA-Z0-9]+$/; // Whitelist for alphanumeric names
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least 1 letter and 1 number

    if (!namePattern.test(name) || !passwordPattern.test(password)) {
        return res.status(400).json({ message: "Invalid input data." });
    }

    try {
        const collection = db.collection("users");
        const user = await collection.findOne({ name, accountNumber }); // Now also checks account number

        if (!user) {
            return res.status(401).json({ message: "Authentication failed: User not found." });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed: Incorrect password." });
        }

        // Authentication successful
        const token = jwt.sign(
            { username: user.name, accountNumber: user.accountNumber }, 
            "this_secret_should_be_longer_than_it_is", 
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Authentication successful",
            token: token,
            name: user.name
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed due to a server error." });
    }
});



export default router

