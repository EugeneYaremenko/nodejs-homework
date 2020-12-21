const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);
    console.table(parsedContacts);

    return parsedContacts;
  } catch (err) {
    console.log(err);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);
    const findContactId = await parsedContacts.find(
      ({ id }) => id === contactId
    );

    if (findContactId) {
      console.table(findContactId);
    }

    if (!findContactId) {
      console.log("Contact not found");
    }
  } catch (err) {
    console.log(err);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);
    const removeContact = await parsedContacts.filter(
      ({ id }) => id !== contactId
    );

    if (removeContact) {
      fsPromises.writeFile(contactsPath, JSON.stringify(removeContact));
      listContacts()
      console.log("success");
    }

    if (!removeContact) {
      console.log("Contact not found");
    }
  } catch (err) {
    console.log(err);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await fsPromises.readFile(contactsPath, "utf-8");
    const parsedContacts = JSON.parse(contacts);

    const contact = {
      id: parsedContacts.length + 2,
      name,
      email,
      phone,
    };

    fsPromises.writeFile(
      contactsPath,
      JSON.stringify([...parsedContacts, contact])
    );
    listContacts()
    console.log("success");
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
