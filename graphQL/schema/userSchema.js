const {
   GraphQLInt,
   GraphQLString,
   GraphQLObjectType
} = require("graphql");

const schema = new GraphQLObjectType({
   name:"user",
   fields:{
      id: {
         type:GraphQLInt
      },
      name:{
         type:GraphQLString
      },
      username:{
         type: GraphQLString
      },
      password:{
         type: GraphQLString
      },
      email:{
         type:GraphQLString
      },
      phone_no:{
         type:GraphQLString
      }
   }
})

module.exports = { user_schema : schema }