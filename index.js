const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const app =  express()
const port = process.env.PORT || 3000
require('dotenv').config()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.COFFEE_USER}:${process.env.COFFEE_PASS}@mydatabase.sr7puaa.mongodb.net/?retryWrites=true&w=majority&appName=MyDatabase`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {

    await client.connect();

    const coffeeStoreDB = client.db("coffeeStore").collection("coffees")
    const usersCollection = client.db("coffeeStore").collection("users")


    app.get("/coffees", async(req, res) => {
      const cursor = await coffeeStoreDB.find().toArray();
      res.send(cursor)
    })


    app.get('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeStoreDB.findOne(query)
      res.send(result)
    })

    app.post("/coffees", async(req, res) => {
      const newCoffee = req.body;
      const cursor = await coffeeStoreDB.insertOne(newCoffee)
      res.send(cursor)
    })

    app.put('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const query = {_id: new ObjectId(id)}
      const options = { upsert: true };
      const updatedDoc = {
        $set: updatedCoffee
      }
      const result = await coffeeStoreDB.updateOne(query, updatedDoc, options)
      res.send(result)
    })

    app.delete('/coffees/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeStoreDB.deleteOne(query)
      res.send(result)
    })


    // users injection in db

    app.get('/users', async(req, res) => {
      const users = await usersCollection.find().toArray()
      res.send(users)
    })
    app.post('/users', async(req, res) => {
      const users = req.body;
      const insertUserData = await usersCollection.insertOne(users)
      res.send(insertUserData)
    })

    app.patch('/users', async(req, res) => {
      const signInInfo = req.body;
      const filter = {email: signInInfo.email}
      const updatedArea = {
        $set: {
          lastSignInTime: signInInfo.lastSignInTime
        }
      }
      const result = await usersCollection.updateOne(filter, updatedArea);
      res.json(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await usersCollection.deleteOne(query)
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("Backend server connected")
})


app.listen(port, () => {
    console.log(`app is running on port ${port}`)
}) 