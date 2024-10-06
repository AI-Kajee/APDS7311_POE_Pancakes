import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import checkauth from "../check-auth.mjs";

const router = express.Router();

// Get all the records
router.get("/", async (req, res) => {
  let collection = await db.collection("posts");
  let results = await collection.find({}).toArray();
  res.status(200).send(results);
});

// Create a new record
router.post("/upload", checkauth, async (req, res) => {
  let newDocument = {
    user: req.body.user,
    content: req.body.content,
    image: req.body.image,
  };
  let collection = await db.collection("posts");
  let result = await collection.insertOne(newDocument);
  res.status(204).send(result);
});

// Update a record by id
router.patch("/:id", checkauth, async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates = {
    $set: {
      name: req.body.name,
      comment: req.body.comment,
    },
  };
  let collection = await db.collection("posts");
  let result = await collection.updateOne(query, updates);
  res.status(200).send(result);
});

// Get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("posts");
  let query = { _id: new ObjectId(req.params.id) };
  let result = await collection.findOne(query);
  if (!result) res.status(404).send("Not found");
  else res.status(200).send(result);
});

// Delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const collection = db.collection("posts");
  let result = await collection.deleteOne(query);
  res.status(200).send(result);
});

// Payment route
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
  
    const paymentData = {
      amount,
      currency,
      provider,
      accountHolder,
      accountNumber,
      reference,
      swiftCode,
    };
  
    try {
      console.log('Received payment data:', paymentData);
      let collection = await db.collection("payments");
      let result = await collection.insertOne(paymentData);
      console.log('Payment processed successfully:', result);
      res.status(201).send({ message: "Payment processed successfully", result });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).send({ message: "Error processing payment. Please try again later." });
    }
  });
  

export default router;