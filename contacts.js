const fs = require("fs").promises;
const path = require("path");
const { v4: id } = require("uuid");

const contactsPath = path.join(__dirname, "/db/contacts.json");

async function listContacts() {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf8");
    const parsedContactsList = JSON.parse(contactsList);

    return console.table(parsedContactsList);
  } catch (error) {
    return console.log("Something went wrong:", error);
  }
}

async function getContactById(contactId) {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf8");
    const parsedContactsList = JSON.parse(contactsList);

    const contactToGet = parsedContactsList.filter(
      ({ id }) => id === contactId.toString()
    );

    if (contactToGet.length === 0) {
      return console.log(`Contact with id: ${contactId} is missing`);
    }

    return console.log(contactToGet);
  } catch (error) {
    return console.log("Something went wrong:", error);
  }
}

async function removeContact(contactId) {
  try {
    const contactsList = await fs.readFile(contactsPath, "utf8");
    const parsedContactsList = JSON.parse(contactsList);

    const updatedContactsList = parsedContactsList.filter(
      ({ id }) => id !== contactId.toString()
    );

    if (parsedContactsList.length === updatedContactsList.length) {
      return console.log(`Contact with id ${contactId} is missing in list`);
    }

    await fs.writeFile(
      contactsPath,
      JSON.stringify(updatedContactsList),
      "utf8"
    );

    const contactsListAfterRemove = await fs.readFile(contactsPath, "utf8");

    return console.table(JSON.parse(contactsListAfterRemove));
  } catch (error) {
    return console.log("Something went wrong:", error);
  }
}

async function addContact(name, email, phone) {
  const newContact = { id: id(), name, email, phone };

  try {
    const contactsList = await fs.readFile(contactsPath, "utf8");
    const parsedContactsList = JSON.parse(contactsList);

    const nameToAdd = parsedContactsList.find(
      (contact) => contact.name.toLowerCase() === name.toLowerCase()
    );
    const emailToAdd = parsedContactsList.find(
      (contact) => contact.email.toLowerCase() === email.toLowerCase()
    );
    const phoneToAdd = parsedContactsList.find(
      (contact) => contact.phone === phone
    );

    if (nameToAdd || emailToAdd || phoneToAdd) {
      return console.log("The contact with same data already exists");
    }
    if (!nameToAdd && !emailToAdd && !phoneToAdd) {
      console.log(`New contact ${name} succesfully added to the list`);
    }

    const updatedContactsList = JSON.stringify([
      ...parsedContactsList,
      newContact,
    ]);

    await fs.writeFile(contactsPath, updatedContactsList, "utf8");

    const contactsListAfterAdding = await fs.readFile(contactsPath, "utf8");

    return console.table(JSON.parse(contactsListAfterAdding));
  } catch (error) {
    return console.log("Something went wrong:", error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
