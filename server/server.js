const fs = require('fs')
const cors = require('cors');
const {gql,ApolloServer} = require('apollo-server-express')
const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const db = require('./db');

const port = 9000;
const jwtSecret = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(cors(),express.json() ,expressJwt({
  secret: jwtSecret,
  credentialsRequired: false
}));
const context = ({req}) => ({user:req.user && db.users.get(req.user.sub)}); 
const typeDefs = gql(fs.readFileSync('./schema.graphql',{encoding:"utf8"}))
const resolvers =require('./resolvers')
const server = new ApolloServer({typeDefs,resolvers,context})
server.applyMiddleware({app,path:'/graphql'}  )

app.post('/login', (req, res) => {
  const {email, password} = req.body;
  const user = db.users.list().find((user) => user.email === email);
  if (!(user && user.password === password)) {
    res.sendStatus(401);
    return;
  }
  const token = jwt.sign({sub: user.id}, jwtSecret);
  res.send({token});
});


app.listen(port, () => console.info(`Server started on port ${port}`));
