require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const User = require("./models/User");

connectDB(); //connection of server to db

const app = express(); //creates server instance (app is main controller of routes)

//This is middleware
//Without this, browser blocks requests from frontend (different domain).
app.use(cors());
app.use(express.json()); //Parses JSON body from request.

const PORT = process.env.PORT || 4000;

// ==========================
// READ ALL USERS
// ==========================
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==========================
// READ SINGLE USER
// ==========================
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Invalid ID format" });
  }
});

// ==========================
// CREATE USER
// ==========================
app.post("/users", async (req, res) => {
  try {
    console.log(req.body);
    console.log(res);
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(400).json({ message: error.message });
  }
});

// ==========================
// UPDATE USER
// ==========================
app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ==========================
// DELETE USER
// ==========================
app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
