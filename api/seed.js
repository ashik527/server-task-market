const { MongoClient } = require("mongodb");

module.exports = async (req, res) => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("freelanceMarketplace");
  const tasks = db.collection("tasks");

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
    const result = await tasks.insertMany(sampleTasks);
    res.status(200).json({ message: "Seeded", insertedCount: result.insertedCount });
  } catch (error) {
    res.status(500).json({ error: "Seeding failed" });
  } finally {
    await client.close();
  }
};