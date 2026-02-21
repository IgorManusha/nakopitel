const express = require("express");
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Sample route
app.get("/api", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
