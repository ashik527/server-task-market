const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

module.exports = function (db) {
  const taskCollection = db.collection("tasks");

  
  router.post("/", async (req, res) => {
    try {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send({ insertedId: result.insertedId });
    } catch (err) {
      res.status(500).send({ error: "Failed to add task." });
    }
  });


  router.get("/featured", async (req, res) => {
    try {
      const tasks = await taskCollection
        .find({ deadline: { $exists: true } })
        .sort({ deadline: 1 })
        .limit(6)
        .toArray();
      res.send(tasks);
    } catch (err) {
      res.status(500).send({ error: "Failed to fetch featured tasks." });
    }
  });

 
  router.get("/", async (req, res) => {
    try {
      const tasks = await taskCollection.find().toArray();
      res.send(tasks);
    } catch (err) {
      res.status(500).send({ error: "Failed to fetch all tasks." });
    }
  });


  router.post("/:id/bid", async (req, res) => {
    try {
      const taskId = req.params.id;
      const bid = req.body;

      const result = await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $push: { bids: bid } }
      );

      res.send(result);
    } catch (err) {
      console.error("Bid error:", err);
      res.status(500).send({ error: "Failed to place bid." });
    }
  });

  
  router.put("/:id", async (req, res) => {
    try {
      const taskId = req.params.id;
      const updatedData = req.body;

      const result = await taskCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: updatedData }
      );

      res.send(result);
    } catch (err) {
      console.error("Update task error:", err);
      res.status(500).send({ error: "Failed to update task." });
    }
  });

  
  router.get("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const task = await taskCollection.findOne({ _id: new ObjectId(id) });

      if (!task) {
        return res.status(404).send({ error: "Task not found." });
      }

      res.send(task);
    } catch (err) {
      res.status(500).send({ error: "Failed to fetch task by ID." });
    }
  });

  return router;
};
