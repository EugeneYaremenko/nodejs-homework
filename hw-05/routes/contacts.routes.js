const express = require("express");
const router = express.Router();
const ContactsController = require("../controllers/contacts.controller.js");

router.get("/", ContactsController.getContacts);
router.get("/:id", ContactsController.validateId, ContactsController.getById);
router.post(
  "/",
  ContactsController.validateCreateContact,
  ContactsController.addContact
);
router.delete(
  "/:id",
  ContactsController.validateId,
  ContactsController.removeContact
);
router.patch(
  "/:id",
  ContactsController.validateId,
  ContactsController.validateUpdateContact,
  ContactsController.updateContact
);

module.exports = router;
