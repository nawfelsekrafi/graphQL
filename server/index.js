const express = require('express')
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express()

// allows cross orign requests

app.use(cors());

mongoose.connect('mongodb+srv://nawfel-sekrafi:nawfel@cluster0.5syvp.mongodb.net/Cluster0?retryWrites=true&w=majority');
mongoose.connection.once('open', () => {
    console.log('connected to database 😏');
});

// express-graphql make a server and an endpoint .. 
// this is a middle ware to handle it all

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));


app.listen(4000, ()=>{
    console.log("App is running, Listening for requests on port 4000 ");
})