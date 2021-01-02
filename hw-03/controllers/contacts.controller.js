const Joi = require("joi");
const contactModel = require("../models/contacts.model");
const {
  Types: { ObjectId },
} = require("mongoose");

const NotFoundError = require("../errors/NotFoundError");

class ContactsController {
  async getContacts(req, res, next) {
    try {
      const contacts = await contactModel.find();
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const contactId = req.params.id;

      const contact = await contactModel.findById(contactId);

      if (!contact) {
        return new NotFoundError();
      }

      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  async addContact(req, res) {
    try {
      const contact = await contactModel.create(req.body);

      return res.status(201).send({ message: "contact created" });
    } catch (err) {
      next(err);
    }
  }

  async removeContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const deleteContact = await contactModel.findByIdAndDelete(contactId);

      if (!deleteContact) {
        throw new NotFoundError();
      }

      return res.status(200).send({ message: "contact deleted" });
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const contactId = req.params.id;

      const contactToUpdate = await contactModel.findByIdAndUpdate(
        contactId,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );

      if (!contactToUpdate) {
        throw new NotFoundError();
      }

      return res.status(200).send({ message: "contact updated" });
    } catch (err) {
      next(err);
    }
  }

  validateId(req, res, next) {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      throw new NotFoundError();
    }

    next();
  }

  validateCreateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string().required(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  validateUpdateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });

    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }
}

module.exports = new ContactsController();
