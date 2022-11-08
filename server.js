const express = require("express");
const cors = require("cors");
require("dotenv").config();
app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
