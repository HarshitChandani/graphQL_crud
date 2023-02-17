const {GraphQLList,GraphQLObjectType, GraphQLSchema,GraphQLString,GraphQLInt} = require("graphql");
const { sqlExecuteQuery } = require("../../utils/db");
const { user_schema } = require("../schema/userSchema");

const query = new GraphQLObjectType({
   name:"Root",
   fields:{
      getAllUsers:{
         type: new GraphQLList(user_schema),
         async resolve(parent,args){
            const response = await sqlExecuteQuery('SELECT id,name,username,password,email,phone_no FROM [dbo].[user] ORDER BY id');
            const data = response.recordsets[0];
            return data;
         }
      },
      getUser:{
         type: new GraphQLList(user_schema),
         args:{
            id:{type: GraphQLInt},
            username:{ type: GraphQLString}
         },
         async resolve (parent,args){
            let joinStr;
            if (args.hasOwnProperty('id')){
               joinStr = `id = ${args.id}`;
            }  
            else if (args.hasOwnProperty('username')){
               joinStr = `username = '${args.username}'`;
            }    
            else{
               args.hasOwnProperty('id') && args.hasOwnProperty('username'); 
               joinStr = `id = ${args.id} and username = '${args.username}'`;
            }
            const queryStr = `SELECT id,name,username,password,email,phone_no FROM [dbo].[user] WHERE ${joinStr}`
            const data = await sqlExecuteQuery(queryStr);
            return data.recordsets[0];
         }
      }
   }
})

const Mutations = new GraphQLObjectType({
   name:"mutation",
   fields:{
      addUser:{
         type: user_schema,
         args:{
            name:{type:GraphQLString},
            username:{type:GraphQLString},
            email:{type:GraphQLString},
            phone_no:{type:GraphQLString}
         },
         async resolve(parent,args){
            const strQuery = `
            INSERT INTO [dbo].[user](name,username,email,phone_no) 
            VALUES(
               '${args.name}',
               '${args.username}',
               '${args.email}',
               '${args.phone_no}'
            )`; 
            const data = await sqlExecuteQuery(strQuery);
            return data;
         }
      },
      deleteUser:{
         type:user_schema,
         args:{
            id: {type: GraphQLInt}
         },
         async resolve(parent,args){
            const strQuery = `DELETE [dbo].[user] WHERE id = ${args.id}`;
            const data = await sqlExecuteQuery(strQuery);
            console.log(data);
            if (data.rowsAffected[0] === 1){
               return {
                  isDeleted: true,
                  message:"Data has been deleted."
               }
            }
            else{
               return {
                  isDeleted:false,
                  message:"Internal Error"
               }
            }
         }
      },
      // pending
      updateUser:{
         type: user_schema,
         args:{
            id:{type:GraphQLInt}
         },
         resolve(parents,args){
            let queryStr = 'UPDATE [dbo].[user] SET ';
            return 'Hello'
         }
      }
   }
})

module.exports = {
   root:new GraphQLSchema({query:query,mutation:Mutations})
}