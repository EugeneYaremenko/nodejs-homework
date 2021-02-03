const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const contactsRoutes = require("./routes/contacts.routes");
const userRoutes = require("./routes/user.routes");

/* 
POST  http://localhost:3000/users/auth/register
PUT   http://localhost:3000/users/auth/login
PATCH http://localhost:3000/users/auth/logout
GET   http://localhost:3000/users/auth/verify/:verificationToken
PATCH http://localhost:3000/users/avatars
GET   http://localhost:3000/users/current
*/

/* 
GET   http://localhost:3000/api/contacts
GET   http://localhost:3000/api/:id
PATCH  http://localhost:3000/api/:id
DELETE http://localhost:3000/api/:id
*/

require("dotenv").config();

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.initDatabase();
    this.listen();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use(express.static("public"));
    this.server.use("/api/contacts", contactsRoutes);
    this.server.use("/users/", userRoutes);
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });

      console.log("Database connection successful");
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }

  listen() {
    this.server.listen(process.env.PORT, () => {
      console.log("Started listening on port", process.env.PORT);
    });
  }
}

module.exports = Server;
