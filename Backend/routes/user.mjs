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
    const namePattern = /^[a-zA-Z0-9]+$/; // Whitelists alphanumeric names
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; // Minimum 8 characters, one number, one special character, and one capital letter

    // Sanitize input to avoid XSS and NoSQL injection
    const fullName = sanitize(req.body.fullName);
    const username = sanitize(req.body.username);
    const idNumber = sanitize(req.body.idNumber);
    const accountNumber = sanitize(req.body.accountNumber);
    const password = sanitize(req.body.password);
    const confirmPassword = sanitize(req.body.confirmPassword);

    // Input validation
    if (!namePattern.test(username)) {
        return res.status(400).send("Invalid username.");
    }
    if (!passwordPattern.test(password)) {
        return res.status(400).send("Password must be at least 8 characters, include one number, one special character, and one capital letter.");
    }
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match.");
    }

    try {
        // Hash the password with salt
        const hashedPassword = await bcrypt.hash(password, 12);

        // Prepare new user document
        let newUser = {
            fullName,
            username,
            idNumber,
            accountNumber,
            password: hashedPassword
        };

        // Insert the new user into the database
        const collection = await db.collection("users");
        const result = await collection.insertOne(newUser);
        console.log(password);
        res.send(result).status(204);
        res.status(201).json({ message: "User registered successfully." });
        res.redirect("/login");
        
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
// hello i am radhya
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

        res.redirect("/dashboard");
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed due to a server error." });
    }
});


//radhya doing test
export default router

