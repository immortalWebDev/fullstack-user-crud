// Increase default Jest timeout from 5 seconds to 20 seconds
// Why? Because starting in-memory MongoDB can take time.
// Without this, Jest may fail with timeout error.
jest.setTimeout(20000);

// supertest allows us to make fake HTTP requests to our Express app
// It works like Postman, but inside our test code.
const request = require("supertest");

// mongoose is needed to connect and disconnect from MongoDB
// We use it to connect to our in-memory database
const mongoose = require("mongoose");

// MongoMemoryServer creates a fake MongoDB server in RAM (not real database)
// This helps us test without touching real data
const { MongoMemoryServer } = require("mongodb-memory-server");

// We declare variables outside so they are accessible everywhere
// app will store our Express app
// mongoServer will store our fake MongoDB instance
let app;
let mongoServer;

// beforeAll runs once BEFORE all tests start
// We use this to prepare our testing environment
beforeAll(async () => {

  // Tell Node that we are running in test mode
  // This can be useful if we want different behavior in testing
  process.env.NODE_ENV = "test";

  // JWT needs a secret to generate/verify tokens
  // We give a fake secret here for testing
  process.env.JWT_SECRET = "testsecret";

  // Create a brand new fake MongoDB server in memory
  mongoServer = await MongoMemoryServer.create();

  // Get the connection string (URI) of that fake database
  const uri = mongoServer.getUri();

  // Tell our app to use this fake database
  process.env.MONGO_URI = uri;

  // Import our Express app (NOT server.js)
  // app.js only defines routes and middleware
  // It does NOT start listening on a port
  app = require("../app");

  // Connect mongoose to the fake database
  // Now our test environment has its own database
  await mongoose.connect(uri);
});


// afterAll runs once AFTER all tests finish
// We use this to clean up resources
afterAll(async () => {

  // Disconnect mongoose from database
  // If we don't do this, Jest may hang
  await mongoose.disconnect();

  // Stop the in-memory MongoDB server
  // This removes the fake database completely
  await mongoServer.stop();
});


// describe groups related tests together
// Here we are testing GET /api/users route
describe("GET /api/users (No Token)", () => {

  // 'it' defines one single test case
  // This test checks what happens when no token is sent
  it("should return 401 if no token provided", async () => {

    // Send a GET request to /api/users
    // We are NOT sending any cookie/token here
    const res = await request(app).get("/api/users");

    // We expect the response status to be 401 (Unauthorized)
    // Because this route is protected by middleware
    expect(res.statusCode).toBe(401);

    // We also expect the error message to match what middleware returns
    expect(res.body.message).toBe("Not authorized, no token");
  });
});

/*


*/