const Joi = require("joi");
const bcryptjs = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const https = require("https");
const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { AvatarGenerator } = require("random-avatar-generator");
const UnauthorizedError = require("../errors/UnauthorizedError");

class UserController {
  constructor() {
    this._constFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  async _createUser(req, res, next) {
    try {
      const { password, username, email } = req.body;

      const passwordHash = await bcryptjs.hash(password, this._constFactor);

      const existingUser = await userModel.findUserByEmail(email);

      const generator = new AvatarGenerator();
      const userAvatar = await generator.generateRandomAvatar();

      if (existingUser) {
        return res
          .status(400)
          .send({ message: "User with such email already exists" });
      }

      const user = await userModel.create({
        username,
        email,
        password: passwordHash,
        avatarURL: userAvatar,
      });

      const file = fs.createWriteStream(`public/images/${user._id}.svg`);
      https.get(userAvatar, function (res) {
        res.pipe(file);
      });

      await this.sendVerificationEmail(user);

      return res.status(201).json({
        id: user._id,
        username: user.username,
        email: user.email,
        avatarURL: user.avatarURL,
      });
    } catch (err) {
      next(err);
    }
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }

      const user = await userModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("User not authorized");
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async signIn(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);

      if (!user || user.status !== "Verified") {
        return res.status(400).send({ message: "Authentication failed" });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).send({ message: "Authentication failed" });
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60, //two days
      });

      await userModel.updateToken(user._id, token);

      return res.status(200).json({
        token: token,
        user: {
          email: email,
          subscription: "free",
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;

      await userModel.updateToken(user._id, null);

      return res.status(204).send({ message: "user logout" });
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const currentUser = await userModel.findById(userId);

      return res.status(200).json({
        email: currentUser.email,
        subscription: currentUser.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateUserAvatar(req, res, next) {
    try {
      const { _id: userId } = req.user;

      const userToUpdate = await userModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            avatarURL: `http://localhost:${process.env.PORT}/images/${req.file.filename}`,
          },
        },
        {
          new: true,
        }
      );

      if (!userToUpdate) {
        throw new UnauthorizedError("User not authorized");
      }

      res.json({ avatarURL: userToUpdate.avatarURL });
    } catch (err) {
      next(err);
    }
  }

  async sendVerificationEmail(user) {
    try {
      const verificationToken = uuid.v4();

      await userModel.createVerificationToken(user._id, verificationToken);

      await sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email,
        from: process.env.NODEMAILER_USER,
        subject: "Email verification",
        text: "Please varificate your email",
        html: `<p>Please varificate your <a href="http://localhost:${process.env.PORT}/users/auth/verify/${verificationToken}"><strong>email</strong></a></p>`,
      };

      await sgMail.send(msg);

      console.log("Email send");
    } catch (err) {
      console.log(err);
    }
  }

  async verifiEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      console.log(req.params);

      const userToVerify = await userModel.findByVerificationToken(
        verificationToken
      );

      if (!userToVerify) {
        throw new NotFoundError("User not found");
      }

      await userModel.verifyUser(userToVerify._id);

      return res.status(200).send("You're user successfully verified");
    } catch (err) {
      next(err);
    }
  }

  validateSingIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = signInRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  validateCreateUser(req, res, next) {
    const validationRules = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }
}

module.exports = new UserController();
