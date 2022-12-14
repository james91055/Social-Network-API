const connection = require("../config/connection");
const { Thought, User } = require("../models");
const { getRandomName, getRandomThoughts, getRandomEmail } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  // Drop existing thoughts
  await Thought.deleteMany({});

  // Drop existing users
  await User.deleteMany({});

  const emails = getRandomEmail(20);

  const thoughtsGen = getRandomThoughts(20);
  // Create empty array to hold the users
  const users = [];
  // Create empty array to hold the thoughts
  const thoughts = [];
  // Loop 20 times -- add students to the users array
  for (let i = 0; i < 20; i++) {
    // Get some random thought objects using a helper function that we imported from ./data

    const username = getRandomName();
    thoughts.push({
      thoughtText: thoughtsGen[i].thoughtText,
      username,
      reactions: thoughtsGen[i].reactions[0],
    });

    users.push({
      username,
      thoughts: thoughtsGen[i].thoughtText,
      email: emails[i],
    });
  }

  await User.collection.insertMany(users);

  // Add thoughts to the collection and await the results
  await Thought.collection.insertMany(thoughts);

  // Log out the seed data to indicate what should appear in the database
  console.table(users);
  console.table(thoughts);
  console.info("Seeding complete! 🌱");
  process.exit(0);
});
