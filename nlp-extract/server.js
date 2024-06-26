const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nlp = require("compromise");
const path = require("path");

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/extract", (req, res) => {
  const text = req.body.text;
  const doc = nlp(text);

  // Extract nouns and filter out "I"
  let food = doc.match("#Noun").out("array");
  food = food.filter((word) => word.toLowerCase() !== "i");

  // Join the filtered words back into a single string
  food = food.join(" ");

  res.json({ food: food });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
