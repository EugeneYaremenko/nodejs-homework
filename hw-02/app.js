const express = require("express");
const cors = require("cors");
const contactsRoutes = require("./routes/contacts.routes");

const PORT = 3000;

class Server {
  constructor() {
    this.server = null;
  }

  start() {
    this.server = express();
    this.initMiddlewares();
    this.initRoutes();
    this.listen();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors());
  }

  initRoutes() {
    this.server.use("/api/contacts", contactsRoutes);
  }

  listen() {
    this.server.listen(PORT, () => {
      console.log("Started listening on port", PORT);
    });
  }
}

module.exports = Server;
