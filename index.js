const express = require("express");
const {graphqlHTTP} = require("express-graphql");
const { root } = require("./graphQL/query/userQuery");
const { sqlExecuteQuery } = require("./utils/db");
const app = express();


app.use(express.json());
app.use("/graphql",graphqlHTTP({
   schema:root,
   graphiql:true
}));

app.listen(3000,(req,res) => {
   console.info(`Server started at http://localhost:3000`);
})
