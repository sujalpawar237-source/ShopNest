const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding");

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = await User.insertMany([
      {
        name: "Admin User",
        email: "admin@shopnest.com",
        password: hashedPassword,
        role: "admin",
        verified: true,
      },
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        password: hashedPassword,
        role: "user",
        verified: true,
      },
      {
        name: "Priya Verma",
        email: "priya@example.com",
        password: hashedPassword,
        role: "user",
        verified: true,
      },
    ]);

    const products = await Product.insertMany([
      {
        name: "Noise Cancelling Headphones",
        description:
          "Wireless over-ear headphones with active noise cancellation.",
        price: 6999,
        category: "Electronics",
        stock: 25,
        imageUrl:
          "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
        rating: 4.5,
        numReviews: 124,
      },
      {
        name: "Smart Fitness Watch",
        description:
          "Track heart rate, sleep, and workouts with 7-day battery life.",
        price: 3499,
        category: "Wearables",
        stock: 40,
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        rating: 4.3,
        numReviews: 88,
      },
      {
        name: "Minimalist Backpack",
        description: "Water-resistant daily backpack with laptop compartment.",
        price: 1999,
        category: "Fashion",
        stock: 60,
        imageUrl:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
        rating: 4.2,
        numReviews: 54,
      },
      {
        name: "Ceramic Coffee Mug Set",
        description: "Set of 4 premium ceramic mugs for tea or coffee.",
        price: 899,
        category: "Home",
        stock: 120,
        imageUrl:
          "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
        rating: 4.6,
        numReviews: 39,
      },
      {
        name: "Gaming Mechanical Keyboard",
        description: "RGB backlit keyboard with tactile switches.",
        price: 4599,
        category: "Electronics",
        stock: 30,
        imageUrl:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        rating: 4.4,
        numReviews: 71,
      },
    ]);

    await Order.insertMany([
      {
        user: users[1]._id,
        items: [
          {
            productId: products[0]._id,
            qty: 1,
            price: products[0].price,
          },
          {
            productId: products[3]._id,
            qty: 2,
            price: products[3].price,
          },
        ],
        totalAmount: products[0].price * 1 + products[3].price * 2,
        address: {
          fullName: "Rahul Sharma",
          street: "221B MG Road",
          city: "Pune",
          postalCode: "411001",
          country: "India",
        },
        paymentId: "pay_demo_1001",
        status: "delivered",
      },
      {
        user: users[2]._id,
        items: [
          {
            productId: products[2]._id,
            qty: 1,
            price: products[2].price,
          },
          {
            productId: products[4]._id,
            qty: 1,
            price: products[4].price,
          },
        ],
        totalAmount: products[2].price + products[4].price,
        address: {
          fullName: "Priya Verma",
          street: "45 Lake View",
          city: "Indore",
          postalCode: "452001",
          country: "India",
        },
        paymentId: "pay_demo_1002",
        status: "pending",
      },
    ]);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
