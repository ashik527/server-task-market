const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'https://b11a10-task-market.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.use(express.json());

// MongoDB client
const client = new MongoClient(process.env.MONGODB_URI);

// Router
const router = express.Router();

async function run() {
  try {
    await client.connect();
    console.log("MongoDB connected");

    const db = client.db("freelanceMarketplace");
    const taskCollection = db.collection("tasks");

    // Seed data
    router.get("/seed", async (req, res) => {
      const sampleTasks = [
        {
          title: "Build a React portfolio site",
          category: "Web Development",
          description: "Need a responsive portfolio website using React and Tailwind.",
          budget: 150,
          deadline: "2025-06-10",
          userEmail: "client1@example.com",
          userName: "Client One"
        },
        {
          title: "Design a logo for a startup",
          category: "Design",
          description: "Looking for a minimalist logo for our new SaaS brand.",
          budget: 80,
          deadline: "2025-06-15",
          userEmail: "client2@example.com",
          userName: "Client Two"
        },
        {
          title: "Write SEO articles for a tech blog",
          category: "Writing",
          description: "3 articles, 800+ words, SEO-optimized, tech-related topics.",
          budget: 100,
          deadline: "2025-06-05",
          userEmail: "client3@example.com",
          userName: "Client Three"
        },
        {
          title: "Create Facebook ad creatives",
          category: "Marketing",
          description: "I need 5 engaging Facebook ads with copy and visuals.",
          budget: 120,
          deadline: "2025-06-20",
          userEmail: "client4@example.com",
          userName: "Client Four"
        },
        {
          title: "Fix bugs in existing React app",
          category: "Web Development",
          description: "App has bugs in routing and state management. Need urgent fix.",
          budget: 200,
          deadline: "2025-06-08",
          userEmail: "client5@example.com",
          userName: "Client Five"
        },
        {
          title: "Design a landing page",
          category: "Design",
          description: "Modern, clean design for a product launch landing page.",
          budget: 90,
          deadline: "2025-06-18",
          userEmail: "client6@example.com",
          userName: "Client Six"
        }
      ];

      try {
        const result = await taskCollection.insertMany(sampleTasks);
        res.send({ message: "Seeded successfully", insertedCount: result.insertedCount });
      } catch (error) {
        res.status(500).send({ error: "Seeding failed" });
      }
    });

    // CRUD Routes
    router.post("/tasks", async (req, res) => {
      try {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.send({ insertedId: result.insertedId });
      } catch {
        res.status(500).send({ error: "Failed to add task." });
      }
    });

    router.get("/tasks", async (req, res) => {
      try {
        const tasks = await taskCollection.find().toArray();
        res.send(tasks);
      } catch {
        res.status(500).send({ error: "Failed to fetch all tasks." });
      }
    });

    router.get("/tasks/featured", async (req, res) => {
      try {
        const tasks = await taskCollection
          .find({ deadline: { $exists: true } })
          .sort({ deadline: 1 })
          .limit(6)
          .toArray();
        res.send(tasks);
      } catch {
        res.status(500).send({ error: "Failed to fetch featured tasks." });
      }
    });

    router.get("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const task = await taskCollection.findOne({ _id: new ObjectId(id) });
        if (!task) {
          return res.status(404).send({ error: "Task not found." });
        }
        res.send(task);
      } catch {
        res.status(500).send({ error: "Failed to fetch task by ID." });
      }
    });

    router.put("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        res.send(result);
      } catch {
        res.status(500).send({ error: "Failed to update task." });
      }
    });

    router.delete("/tasks/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const result = await taskCollection.deleteOne({ _id: new ObjectId(id) });
        res.send(result);
      } catch {
        res.status(500).send({ error: "Failed to delete task." });
      }
    });

    router.post("/tasks/:id/bid", async (req, res) => {
      try {
        const taskId = req.params.id;
        const bid = req.body;
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(taskId) },
          { $push: { bids: bid } }
        );
        res.send(result);
      } catch {
        res.status(500).send({ error: "Failed to place bid." });
      }
    });

    // Apply router under /api
    app.use("/api", router);

    // Root route
    app.get("/", (req, res) => {
      res.send("Server is running");
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

run().catch(console.dir);

// Start server

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});