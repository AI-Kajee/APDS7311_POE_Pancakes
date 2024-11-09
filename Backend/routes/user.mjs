import express from "express";
import db from "../db/conn.mjs";
import {ObjectId} from "mongodb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExpressBrute from "express-brute";
import sanitize from 'mongo-sanitize';
import checkauth from "../check-auth.mjs"; 
import dotenv from 'dotenv';
dotenv.config();


const router = express.Router();
var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);
import crypto from 'crypto';


const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // This will use the key you saved in .env
const IV_LENGTH = 16; // AES block size for CBC mode

// Encrypt function
function encrypt(text) {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Decrypt function
function decrypt(encryptedData) {
  try {
    if (!encryptedData) {
      throw new Error('No data provided for decryption.');
    }

    const [ivHex, encryptedText] = encryptedData.split(':');
    if (!ivHex || !encryptedText) {
      throw new Error('Invalid encrypted data format.');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedBuffer = Buffer.from(encryptedText, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    let decrypted = decipher.update(encryptedBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error("Decryption error:", err);
    throw new Error('Failed to decrypt data.');
  }
}


// Protected route for Dashboard
router.get("/dashboard", checkauth, (req, res) => {
    res.status(200).json({ message: `Welcome to the dashboard, ${req.user.username}` });
});

// Protected route for Payment
router.get("/payment", checkauth, (req, res) => {
    res.status(200).json({ message: "Accessing payment page" });
});

router.get("/viewpayment", checkauth, (req, res) => {
    res.status(200).json({ message: "Accessing view payment page" });
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

     // Validate that username does not start with "adu" (case-insensitive)
    if (/^adu/i.test(username)) {
        return res.status(400).json({ message: "Username cannot start with 'adu' in any case combination." });
    }

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
      const collection = await db.collection("users");

      // Check if the account number already exists
      const existingUser = await collection.findOne({ accountNumber });
      if (existingUser) {
          return res.status(400).json({ message: "Account number already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("Hashed Password:", hashedPassword);
      let newUser = { fullName, username, idNumber, accountNumber, password: hashedPassword };
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



        // Check if the username starts with "ADU"
        if (/^ADU/i.test(username)) {
          const employeeCollection = db.collection("employees");
          const employee = await employeeCollection.findOne({ username });

          if (!employee) {
              console.error("Employee not found in employees collection");
              return res.status(401).json({ message: "Authentication failed: Employee not found." });
          }

          const passwordMatch = await bcrypt.compare(password, employee.password);
          if (!passwordMatch) {
              console.error("Incorrect password for employee");
              return res.status(401).json({ message: "Authentication failed: Incorrect password." });
          }

          // session string
          req.session.username = employee.username;

          const token = jwt.sign(
              { username: employee.username, accountNumber: employee.accountNumber, userRole: "employee" },
              "this_secret_should_be_longer_than_it_is",
              { expiresIn: "1h" }
          );

          return res.status(200).json({ message: "Authentication successful", token, name: employee.username });
      }






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
            { username: user.username, accountNumber: user.accountNumber, userRole: "user" }, 
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
    // Extract the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
    const decodedToken = jwt.verify(token, "this_secret_should_be_longer_than_it_is");
    const username = decodedToken.username;
    const currentDate = new Date();
    const date = currentDate.toLocaleDateString('en-US');

    // Encrypt sensitive data
    const encryptedAccountNumber = encrypt(accountNumber);
    const encryptedSwiftCode = encrypt(swiftCode);

    // Log encrypted values for debugging
    console.log('Encrypted Account Number:', encryptedAccountNumber);
    console.log('Encrypted Swift Code:', encryptedSwiftCode);

    // Payment data with status set to "Pending"
    const paymentData = {
      username,
      amount,
      currency,
      provider,
      accountHolder,
      accountNumber: encryptedAccountNumber, 
      swiftCode: encryptedSwiftCode,     
      reference,
      date,
      status: "Pending", // Default status
    };

    console.log('Payment data to insert:', paymentData);

    const collection = await db.collection("payments");
    const result = await collection.insertOne(paymentData);
    console.log('Payment processed successfully:', result);
    res.status(201).send({ message: "Payment processed successfully", result });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send({ message: "Error processing payment. Please try again later." });
  }
});

router.get("/hello", async (req, res) => {
  console.log("Hello World!");
  res.send("Hello World!");
});

router.get("/viewPayments", checkauth, async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer <token>"
    const decodedToken = jwt.verify(token, "this_secret_should_be_longer_than_it_is");
    const username = decodedToken.username;

    if (!username) {
      return res.status(400).send({ message: "Username is missing from the token." });
    }

    const collection = await db.collection("payments");
    const payments = await collection.find({ username }).toArray();

    console.log("Payments:", payments);
    payments.forEach(payment => {
      console.log("Encrypted Account Number:", payment.accountNumber);
      console.log("Encrypted Swift Code:", payment.swiftCode);
    });

    const safePayments = payments.map((payment) => ({
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      accountHolder: payment.accountHolder,
      accountNumber: decrypt(payment.accountNumber), // Decrypt here
      reference: payment.reference,
      swiftCode: decrypt(payment.swiftCode), // Decrypt here
      date: payment.date,
      status: payment.status, // Include status in the response
    }));

    res.status(200).send(safePayments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).send({ message: "Error fetching payments. Please try again later." });
  }
});


router.get("/viewPendingPayments", async (req, res) => {
  try {
    // Fetch payments from MongoDB where status is 'Pending'
    const collection = await db.collection("payments");
    const pendingPayments = await collection.find({ status: "Pending" }).toArray();

    if (!pendingPayments.length) {
      return res.status(404).send({ message: "No pending payments found." });
    }

    console.log("Pending Payments:", pendingPayments);
    pendingPayments.forEach(payment => {
      console.log("Encrypted Account Number:", payment.accountNumber);
      console.log("Encrypted Swift Code:", payment.swiftCode);
    });

    // Map payments to return safe data
    const safePendingPayments = pendingPayments.map((payment) => ({
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      accountHolder: payment.accountHolder,
      accountNumber: decrypt(payment.accountNumber), // Decrypt here
      reference: payment.reference,
      swiftCode: decrypt(payment.swiftCode), // Decrypt here
      date: payment.date,
      status: payment.status, // Include status in the response
    }));

    res.status(200).send(safePendingPayments);
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    res.status(500).send({ message: "Error fetching pending payments. Please try again later." });
  }
});










/*
// Route to manually add an employee
router.post("/addEmployee", async (req, res) => {
  const { fullname, username, idNumber, accountNumber, password } = req.body;

  // Validate required fields
  if (!fullname || !username || !idNumber || !accountNumber || !password) {
      return res.status(400).json({ message: "All fields are required." });
  }

  try {
      // Ensure username starts with "ADU"
      if (!/^ADU/i.test(username)) {
          return res.status(400).json({ message: "Employee username must start with 'ADU'." });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("Hashed Password:", hashedPassword);

      // Create the admin object
      const newEmployee = {
          fullname,
          username,
          idNumber,
          accountNumber,
          password: hashedPassword,
      };

      // Insert into the 'employees' collection
      const collection = await db.collection("employees"); 
      const result = await collection.insertOne(newEmployee);

      console.log("Employee added successfully:", result);
      res.status(201).json({ message: "Employee added successfully." });
  } catch (error) {
      console.error("Error adding employee:", error);
      res.status(500).json({ message: "Failed to add employee." });
  }
});
*/












//radhya doing test
export default router

