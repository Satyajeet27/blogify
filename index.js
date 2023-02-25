const { urlencoded } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const userRoute = require("./routes/user");

const PORT = 8000;
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1:27017/blogify").then(() => {
  console.log("MongoDb connected");
});

const app = express();
app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));
app.use(urlencoded({ extended: false }));

app.use("/user", userRoute);

app.get("/", (req, resp) => {
  resp.render("home");
});

app.listen(PORT, () => {
  console.log("server connected on port: ", PORT);
});
