const { MongoClient, ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  const { id } = req.query;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("freelanceMarketplace");
  const tasks = db.collection("tasks");

  try {
    if (req.method === "GET") {
      const task = await tasks.findOne({ _id: new ObjectId(id) });
      if (!task) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(task);
    }

    if (req.method === "PUT") {
      const result = await tasks.updateOne(
        { _id: new ObjectId(id) },
        { $set: req.body }
      );
      return res.status(200).json(result);
    }

    if (req.method === "DELETE") {
      const result = await tasks.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).json(result);
    }
  } catch {
    res.status(500).json({ error: "Something went wrong." });
  } finally {
    await client.close();
  }
};