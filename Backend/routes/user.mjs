import express from "express";
import db from "../db/conn.mjs";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();

var bruteforce = new ExpressBrute(store);

//sign up
router.post("/signup", async (req, res) =>{
    const namePattern = /^[a-zA-Z0-9]+$/; // Whitelists alphanumeric names
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least 1 letter and 1 number

    if (!namePattern.test(req.body.name) || !passwordPattern.test(req.body.password)) {
        return res.status(400).send("Invalid input data.");
    }

    const password = bcrypt.hash(req.body.password, 10);
    let newDocument = {
        name: req.body.name,
        password: (await password).toString(),
    };
    let collection = await db.collection("users");
    let result = await collection.insertOne(newDocument);
    console.log(password);
    res.send(result).status(204);
});


// Login
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;

    // Input validation using RegEx
    const namePattern = /^[a-zA-Z0-9]+$/; // Whitelist for alphanumeric names
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Minimum 8 characters, at least 1 letter and 1 number

    if (!namePattern.test(name) || !passwordPattern.test(password)) {
        return res.status(400).json({ message: "Invalid input data." });
    }

    console.log(name + " " + password);

    try {
        const collection = db.collection("users");
        const user = await collection.findOne({ name });

        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Authentication successful
        const token = jwt.sign(
            { username: user.name }, // Use user's name for the token payload
            "this_secret_should_be_longer_than_it_is", 
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Authentication successful",
            token: token,
            name: user.name // Return the authenticated user's name
        });

        console.log("Your new token is", token);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});


export default router

