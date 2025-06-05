const { MongoClient, ObjectId } = require("mongodb");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { taskId, ...bid } = req.body;

  if (!taskId || !bid.userEmail) {
    return res.status(400).json({ error: "Invalid bid data" });
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("freelanceMarketplace");
  const tasks = db.collection("tasks");

  try {
    const result = await tasks.updateOne(
      { _id: new ObjectId(taskId) },
      { $push: { bids: bid } }
    );
    res.status(200).json(result);
  } catch {
    res.status(500).json({ error: "Failed to place bid." });
  } finally {
    await client.close();
  }
};