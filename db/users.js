const client = require("./client");
const bcrypt = require('bcrypt')
const SALT_COUNT = 10;
// database functions

// user functions
async function createUser({ username, password }) {
  console.log("Creating user...")

  const hashedPassword = await bcrypt.hash(password, SALT_COUNT)
  // let userToAdd = {username, hashedPassword }

  try {
    const {rows: [user] } = await client.query(`
      INSERT INTO users (username, password)
      values ($1, $2)
      returning *;
    `, [username, hashedPassword]);

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
  
}

async function getUser({ username, password }) {

  const user = await getUserByUsername(username);
  // console.log(username);
  // console.log("getting user");
  // console.log(user);
  const hashedPassword = user.password;

  let passwordsMatch = await bcrypt.compare(password, hashedPassword) 
  if (passwordsMatch) {
    delete user.password;
    return user;
    // return the user object (without the password)
  } else {
    console.error("passwords do not match");
    return; 
  }
}

async function getUserById(userId) {
  try{
    const {rows: [user]} = await client.query(`
    SELECT * FROM users
    WHERE id = $1
    `, [userId]
    )
    console.log("attempting to get user by username", user);
    delete user.password;
    return user;
} catch (error) {
  console.error("Cannot get user by username");
  throw error;
}

}

async function getUserByUsername(userName) {
  // first get the user
  try {
    const {rows} = await client.query(`
      SELECT *
      FROM users
      WHERE username = $1;
    `, [userName]);
    // if it doesn't exist, return null
    if (!rows || !rows.length) return null;
    // if it does:
    // delete the 'password' key from the returned object
    const [user] = rows;
    // delete user.password;
    return user;
  } catch (error) {
    console.error(error)
  }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
