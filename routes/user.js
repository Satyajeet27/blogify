const { Router } = require("express");
const User = require("../model/user");
const { createHmac } = require("crypto");

const router = Router();

router
  .route("/login")
  .get((req, resp) => {
    resp.render("login");
  })
  .post(async (req, resp) => {
    const { email, password } = req.body;
    // let test = password;
    // console.log(req.body);
    // const result = await User.findOne({ email });
    // console.log(result.salt);
    // const hashingUserProvidedPassword = createHmac("sha256", result.salt)
    //   .update(password)
    //   .digest("hex");
    // console.log(hashingUserProvidedPassword);
    // if (!result.password == hashingUserProvidedPassword)
    //   return resp.send("wrong password");
    const result = await User.matchPassword(email, password);
    console.log(result);
    if (!result) return resp.send("wrong password");
    return resp.redirect("/");
  });

router
  .route("/signup")
  .get((req, resp) => {
    resp.render("signup");
  })
  .post(async (req, resp) => {
    const { fullname, email, password } = req.body;
    const data = await User.create({ fullname, email, password });
    return resp.redirect("/");
  });

module.exports = router;
