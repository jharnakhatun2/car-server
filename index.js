const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Welcome to Server `);
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.9b1wrmq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    //collection with mongodb
    const serviceCollection = client.db("carServices").collection("service");
    const orderCollection = client.db("carServices").collection("orders");
    const bookingCollection = client.db("carServices").collection("booking");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //orders api 
    app.get("/orders", async (req, res) => {
      let query = {};

      if(req.query.email){
        query = { 
          email: req.query.email
        }
      }

      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.post('/orders',async(req, res)=>{
      const order = req.body;
      const result = await orderCollection.insertOne(order);
      res.send(result);
    })

    app.delete('/orders/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={_id: ObjectId(id)};
        const result = await orderCollection.deleteOne(query);
        res.send(result);
    })

    //post appointment data from booking collection
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    })
    
    // //get appointment data from booking collection
    // app.get('/appointment', async (req, res) => {
    //   const query = {};
    //   const options = await bookingCollection.find(query).toArray();
    //   res.send(options);
    // })

  } 
  finally {

  }
}
run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
