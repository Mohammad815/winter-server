const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ns6st.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      console.log("database connected success")

      const database = client.db('winter_clothes');
      const productsCollection = database.collection('products');

      //add ProductCollection
      app.post("/AddProduct", async (req, res) => {
         console.log(req.body);
        const result = await productsCollection.insertOne(req.body);
        res.send(result);
     });

        // get all products
        app.get("/allProducts", async (req, res) => {
            const result = await productsCollection.find({}).toArray();
            res.send(result);
        });

        // single Product
        app.get("/singleProduct/:id", async (req, res) => {
          
          const result = await productsCollection
          .find({ _id: ObjectId(req.params.id) })
          .toArray();
          res.send(result[0]);
           console.log(result);
      });

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello Winter shop!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})