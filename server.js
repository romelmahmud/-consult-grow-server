const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
app = express();

const PORT = process.env.PORT || 5000;
const URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function dbConnect() {
  try {
    await client.connect();
    console.log("Database connected");
  } catch (error) {
    console.log(error, error.message);
  }
}

dbConnect();

const Services = client.db("service-review").collection("services");
const Reviews = client.db("service-review").collection("reviews");

// Routes/EndPoints

// Create a service
app.post("/service", async (req, res) => {
  try {
    const result = await Services.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the product",
      });
    }
  } catch (error) {
    console.log(error, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Get All services
app.get("/service", async (req, res) => {
  try {
    const cursor = Services.find({});
    const services = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: services,
    });
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Get single service
app.get("/service/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Services.findOne({ _id: ObjectId(id) });

    res.send({
      success: true,
      data: service,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Create a review
app.post("/review", async (req, res) => {
  try {
    const result = await Reviews.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `Successfully created the ${req.body.name} with id ${result.insertedId}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't create the product",
      });
    }
  } catch (error) {
    console.log(error, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Get All reviews
app.get("/review", async (req, res) => {
  try {
    const cursor = Reviews.find({});
    const reviews = await cursor.toArray();

    res.send({
      success: true,
      message: "Successfully got the data",
      data: reviews,
    });
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Get single reviews
app.get("/review/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Reviews.findOne({ _id: ObjectId(id) });

    res.send({
      success: true,
      data: review,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Update single review
app.patch("/review/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Reviews.updateOne(
      { _id: ObjectId(id) },
      { $set: req.body }
    );

    if (result.matchedCount) {
      res.send({
        success: true,
        message: `successfully updated ${req.body.id}`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't update  the product",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Delete single review
app.delete("/review/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Reviews.findOne({ _id: ObjectId(id) });

    if (!review?._id) {
      res.send({
        success: false,
        error: "Review doesn't exist",
      });
      return;
    }

    const result = await Reviews.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: `Successfully deleted the ${review._id}`,
      });
    } else {
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Get All reviews for single service
app.get("/service/review/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const query = { service_id: id };

    const reviews = await Reviews.find(query).toArray();

    res.send({
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
