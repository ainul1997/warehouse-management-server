const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
// app.use(cors());
const corsConfig = {
    origin: true,
    credentials: true,
}
app.use(cors(corsConfig))
app.options('*', cors(corsConfig))
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x2yhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productionCollection = client.db('warehouse').collection('production');
        const servicesCollection = client.db('warehouse').collection('services');
        app.get('/production', async (req, res) => {
            console.log('query', req.query);
            const size = parseInt(req.query.size);

            const query = {};
            const cursor = productionCollection.find(query);
            const production = await cursor.skip(size).limit(size).toArray();
            res.send(production);
        });
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/production/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productionCollection.findOne(query);
            res.send(product);
        })

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(port, () => {
    console.log('Listening to port', port)
});

