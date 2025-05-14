const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");
const app = express();


mongoose
  .connect("mongodb://localhost:27017/renovationDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Connection error:", err));

// Session Middleware 
app.use(
  session({
    secret: "6b7c42796ec9e19bd9a13df6829d2493265a494454519cd809c769ef308305cc",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
      maxAge: 3600000,
    },
  })
);

// Body Parsing Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Authentication middleware
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  next();
};

// Protected route
app.get("/estimateCost.html", requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, "estimateCost.html"));
});

// Static files middleware
app.use(express.static(path.join(__dirname, "/")));

// Routes
app.get("/check-auth", (req, res) => {
  res.json({ loggedIn: !!req.session.user });
});

// Registration Route
app.post("/signup", async (req, res) => {
  try {
    const {
      "signup-username": username,
      "signup-email": email,
      "signup-password": password,
      "signup-confirm-password": confirmPassword,
    } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).send("All fields are required");
    }

    if (password !== confirmPassword) {
      return res.status(400).send("Passwords do not match");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.redirect("/login.html");
  } catch (error) {
    console.error("Registration error:", error);
    if (error.code === 11000) {
      return res.status(400).send("Username/email already exists");
    }
    res.status(500).send("Registration failed");
  }
});


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Username and password required");
    }

    const user = await User.findOne({ username });
    if (!user) return res.status(401).send("Invalid credentials");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send("Invalid credentials");

    req.session.user = { id: user._id, username: user.username };
    res.redirect("/estimateCost.html");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Login failed");
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error("Logout error:", err);
    res.redirect("/login.html");
  });
});


const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
});
const User = mongoose.model("User", userSchema);


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
