const { Schema, model } = require("mongoose");
const { randomBytes, createHmac } = require("crypto");

const userSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      //   required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified) return;
  const salt = randomBytes(16).toString();
  const hashPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  console.log("salt", salt);
  console.log("hash", hashPassword);
  this.salt = salt;
  this.password = hashPassword;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("user not found");
  const hashedPassword = user.password;
  const userProvidedPassword = createHmac("sha256", user.salt)
    .update(password)
    .digest("hex");
  if (hashedPassword !== userProvidedPassword)
    throw new Error("Password incorrect ");
  //   console.log(user);
  return { ...user._doc, password: undefined, salt: undefined };
});

const User = model("user", userSchema);

module.exports = User;
