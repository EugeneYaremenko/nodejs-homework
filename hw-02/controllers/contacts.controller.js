const contacts = require("../models/contacts.json");
const Joi = require("joi");
const NotFoundError = require("../errors/NotFoundError");

class ContactsController {
  getContacts(req, res) {
    return res.status(200).json(contacts);
  }

  getById = (req, res) => {
    const contactIndex = this.validateContactById(req.params);

    return res.status(200).json(contacts[contactIndex]);
  };

  addContact(req, res) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({ message: "missing required name field" });
    }

    const createContact = {
      id: contacts.length + 2,
      ...req.body,
    };

    contacts.push(createContact);

    return res.status(201).send({ message: "contact created" });
  }

  removeContact = (req, res) => {
    const contactIndex = this.validateContactById(req.params);

    contacts.splice(contactIndex, 1);

    return res.status(200).send({ message: "contact deleted" });
  };

  updateContact = (req, res) => {
    const contactIndex = this.validateContactById(req.params);

    if (contactIndex === -1) {
      throw new NotFoundError();
    }

    const updeteUser = {
      ...contacts[contactIndex],
      ...req.body,
    };

    contacts[contactIndex] = updeteUser;

    return res.status(200).json(updeteUser);
  };

  validateContactById(params) {
    const { contactId } = params;
    const queryId = parseInt(contactId);

    const contactIndex = contacts.findIndex(({ id }) => id === queryId);

    if (contactIndex === -1) {
      throw new NotFoundError();
    }

    return contactIndex;
  }
}

module.exports = new ContactsController();
