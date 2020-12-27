const express = require("express");
const router = express.Router();
const ContactsController = require("../controllers/contacts.controller.js");

router.get("/", ContactsController.getContacts);
router.get("/:contactId", ContactsController.getById);
router.post("/", ContactsController.addContact);
router.delete("/:contactId", ContactsController.removeContact);
router.patch("/:contactId", ContactsController.updateContact);

module.exports = router;
