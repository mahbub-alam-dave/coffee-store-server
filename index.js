const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
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