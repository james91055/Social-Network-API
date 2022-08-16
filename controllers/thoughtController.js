const { User, Thought } = require("../models");

module.exports = {
  // Function to get all of the Thoughts by invoking the find() method with no arguments.
  // Then we return the results as JSON, and catch any errors. Errors are sent as JSON with a message and a 500 status code
  getThoughts(req, res) {
    Thought.find()
      .then((Thoughts) => res.json(Thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Gets a single Thought using the findOneAndUpdate method. We pass in the ID of the Thought and then respond with it, or an error if not found
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((Thought) =>
        !Thought
          ? res.status(404).json({ message: "No Thought with that ID" })
          : res.json(Thought)
      )
      .catch((err) => res.status(507).json(err));
  },
  // Creates a new Thought. Accepts a request body with the entire Thought object.
  // Because Thoughts are associated with Users, we then update the User who created the thought and add the ID of the Thought to the Thoughts array
  createThought(req, res) {
    Thought.create(req.body)
      .then((Thought) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { Thoughts: Thought._id } },
          { new: true }
        );
      })
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought created, but found no user with that ID",
            })
          : res.json("Created the Thought 🎉")
      )
      .catch((err) => {
        console.log(err);
        res.status(507).json(err);
      });
  },
  // Updates and Thought using the findOneAndUpdate method. Uses the ID, and the $set operator in mongodb to inject the request body. Enforces validation.
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((Thought) =>
        !Thought
          ? res.status(404).json({ message: "No Thought with this id!" })
          : res.json(Thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Deletes an Thought from the database. Looks for an thought by ID.
  // Then if the thought exists, we look for any users associated with the thought based on he thought ID and update the Thoughts array for the User.
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((Thought) =>
        !Thought
          ? res.status(404).json({ message: "No Thought with this id!" })
          : User.findOneAndUpdate(
              { Thoughts: req.params.thoughtId },
              { $pull: { Thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Thought created but no user with this id!",
            })
          : res.json({ message: "Thought successfully deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },
  // Adds a reaction to an Thought. This method is unique in that we add the entire body of the reaction rather than the ID with the mongodb $addToSet operator.
  addReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((Thought) =>
        !Thought
          ? res.status(404).json({ message: "No Thought with this id!" })
          : res.json(Thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove Thought reaction. This method finds the Thought based on ID. It then updates the reactions array associated with the thought in question by removing it's reactionId from the reactions array.
  removeReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((Thought) =>
        !Thought
          ? res.status(404).json({ message: "No Thought with this id!" })
          : res.json(Thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
