const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  console.log("Creating user...")

  try {
    const {rows: [user] } = await client.query(`
      INSERT INTO users (username, password)
      values ($1, $2)
      returning *;
    `, [username, password]);

    // ON CONFLICT (username) DO NOTHING
    // this is optional maybe

    console.log(user);
    console.log("User created");

    delete user.password;
    return user;

  } catch (error) {
    console.error("Cannot create user");
    throw error;
  }
  
};

async function getUser({ username, password }) {

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
