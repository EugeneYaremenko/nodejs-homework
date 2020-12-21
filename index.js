const yargs = require("yargs");
const contacts = require("./contacts");

const argv = yargs
  .string("action")
  .number("id")
  .string("name")
  .string("email")
  .string("phone")
  .alias("action", "a")
  .alias("name", "n")
  .alias("email", "e")
  .alias("phone", "p").argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contacts.listContacts();
      break;

    case "get":
      contacts.getContactById(id);
      break;

    case "add":
      contacts.addContact(name, email, phone);
      break;

    case "remove":
      contacts.removeContact(id);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
