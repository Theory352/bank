const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS for all routes
const corsOptions = {
  origin: "*", // Allow requests from any origin
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());


const {
  createNewAccount,
  deposit,
  withdraw,
  balance,
  transfer,
} = require("./db");

app.post("/create", (req, res) => {
  createNewAccount(req.body)
    .then((msg) => {
      res.json({ sts: "success", msg });
    })
    .catch((error) => {
      console.error("Error creating account:", error);
      res.status(500).json({ sts: "error", msg: "Internal Server Error" });
    });
});

app.put("/transfer", (req, res) => {
  transfer(req.body)
    .then((msg) => {
      res.json({ sts: "success", msg });
    })
    .catch((error) => {
      console.error("Error transferring:", error);
      res.status(500).json({ sts: "error", msg: "Internal Server Error" });
    });
});

app.put("/withdraw", (req, res) => {
  withdraw(req.body)
    .then((msg) => {
      res.json({ sts: "success", msg });
    })
    .catch((error) => {
      console.error("Error withdrawing:", error);
      res.status(500).json({ sts: "error", msg: "Internal Server Error" });
    });
});

app.put("/deposit", (req, res) => {
  deposit(req.body)
    .then((msg) => {
      res.json({ sts: "success", msg });
    })
    .catch((error) => {
      console.error("Error depositing:", error);
      res.status(500).json({ sts: "error", msg: "Internal Server Error" });
    });
});

app.get("/balance/:acId", (req, res) => {
  const acId = req.params.acId;
  balance(acId)
    .then((bal) => {
      res.json({ sts: "success", bal });
    })
    .catch((error) => {
      console.error("Error fetching balance:", error);
      res.status(500).json({ sts: "error", msg: "Internal Server Error" });
    });
});

const port = 9000;

app.listen(port, () => {
  console.log(`Banking App app listening on port ${port}`);
});
