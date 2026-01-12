const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await prisma.user.create({
      data: { name, email },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
});
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});
app.get("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch user",
      error: error.message,
    });
  }
});
app.put("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, email } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
});
app.delete("/users/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.user.delete({
      where: { id },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
