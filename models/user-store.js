import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("users");

export const userStore = {
  async getAllUsers () {
    await db.read();
    return db.data.users;
  },

  async addUser (user) {
    await db.read();
    user._id = v4();
    db.data.users.push(user);
    await db.write();
    return user;
  },

  // Checks if the user has only updated certain fields
  async updateUser (loggedInUser, updatedProfile) {
    if (updatedProfile.firstName !== "") {
      loggedInUser.firstName = updatedProfile.firstName;
    }
    if (updatedProfile.lastName !== "") {
      loggedInUser.lastName = updatedProfile.lastName;
    }
    if (updatedProfile.email !== "") {
      loggedInUser.email = updatedProfile.email;
    }
    if (updatedProfile.password !== "") {
      loggedInUser.passwod = updatedProfile.password;
    }
    await db.write();
  },

  async getUserById (id) {
    await db.read();
    return db.data.users.find((user) => user._id === id);
  },

  async getUserByEmail (email) {
    await db.read();
    return db.data.users.find((user) => user.email === email);
  },

  async deleteUserById (id) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    db.data.users.splice(index, 1);
    await db.write();
  },

  async deleteAll () {
    db.data.users = [];
    await db.write();
  }
};
