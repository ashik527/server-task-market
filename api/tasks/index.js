const { MongoClient } = require("mongodb");

module.exports = async (req, res) => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("freelanceMarketplace");
  const tasks = db.collection("tasks");

  if (req.method === "GET") {
    try {
      const result = await tasks.find().toArray();
      res.status(200).json(result);
    } catch {
      res.status(500).json({ error: "Failed to fetch tasks." });
    }
  }

  if (req.method === "POST") {
    try {
      const result = await tasks.insertOne(req.body);
      res.status(201).json({ insertedId: result.insertedId });
    } catch {
      res.status(500).json({ error: "Failed to add task." });
    }
  }

  await client.close();
};

module.exports = serverless(app);