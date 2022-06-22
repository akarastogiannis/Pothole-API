require('dotenv').config()

const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.sequelize.sync()
    .then(() => {
        console.log("Synced to db.");
    })
    .catch((err) => {
        console.log("Failed to sync to db " + err.message);
    });


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

// Require all the routes for "/api/v1/users"
require("./routes/pothole.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
