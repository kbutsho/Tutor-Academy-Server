const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0xxko.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const tutorCollection = client.db("tutorAcademy").collection("tutorCollections");
    const reviewCollection = client.db("tutorAcademy").collection("reviewCollections");
    const HiredCollection = client.db("tutorAcademy").collection("HiredCollections");
    const AdminCollection = client.db("tutorAcademy").collection("AdminCollections");

    //add tutor as a product
    app.post('/addTutor', (req, res) => {
        const newTutor = req.body;
        tutorCollection.insertOne(newTutor)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    //get tutor as a product
    app.get('/tutors', (req, res) => {
        tutorCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    });
    //delete tutor as a product
    app.delete('/deleteTutor/:id', (req, res) => {
        tutorCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
          .then(result => {
            res.send(result.deletedCount > 0);
          })
      })
    // add review
    app.post('/addReview', (req, res) => {
        const newTutor = req.body;
        reviewCollection.insertOne(newTutor)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    //get review
    app.get('/reviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items);
            })
    });
    // place order 
    app.post('/AddHired', (req, res) => {
        const newTutor = req.body;
        HiredCollection.insertOne(newTutor)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    //add admin
    app.post('/addAdmin', (req, res) => {
        const newAdmin = req.body;
        AdminCollection.insertOne(newAdmin)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });
    // get admin
    app.get('/getAdmin', (req, res) => {
        AdminCollection.find()
            .toArray((err, items) => {
                res.send(items);
            });
    });
    // get order
    app.post('/orders', (req, res) => {
        const email = req.body.email;
        AdminCollection.find({ email: email })
            .toArray((err, admins) => {
                // const filter = {};
                if (admins.length === 0) {

                    var filter = { email: email }
                }
                HiredCollection.find(filter)
                    .toArray((err, documents) => {
                        res.send(documents);
                    })
            })
    });
    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;
        AdminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    })
   
    console.log("Database Connected");
});
app.get('/', (req, res) => {
    res.send('Database Root')
});
app.listen(process.env.PORT || 5000)