// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//NOTE cualquier archivo creado dentro de la carpeta API es tratado como endpoint y no como una pagina
//import {} from "../../services"

import { GraphQLClient,gql } from "graphql-request";
const graphQLAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

//IDEA se trabaja como en node con req,res

export default async function comments(req,res){
  const {name,email,slug,comment} = req.body
  const graphQLCLient = new GraphQLClient(graphQLAPI,{
    //IDEA aqui necesitamos un token de grpahCMS
    headers:{
      authorization: ` Bearer ${process.env.GRAPHCMS_TOKEN}`
    }
  })
  //NOTE Mutation query
  //REVIEW aqui estamos conectado el name email y comment a un post espcifico con  un usuario conectado
  //REVIEW recuerda revisar si estan conectados los post con los comentarios en graphCMS
  const query = gql`
    mutation CreateComment($name:String!,$email:String!,$comment:String!,$slug:String!){
  
      createComment(data:{name:$name,email:$email,comment:$comment,post:{connect:{slug:$slug}}}){id}
    }
  
  ` 
  //IDEA para ddebugear mejor las prome

  try {
    const result = await graphQLCLient.request(query,req.body)
    //NOTE con esto se manda al frontend de regreso
    return res.status(200).send(result)
  } catch (error) {
    console.log(error);
  }
}


//NOTE los comentarios llegan a graphCMS para que  lleguen como drafts


//FIX ERROR JSON BODY Could not be decoded
//FIX para arrelgar ese error se tiene que poner el header de applciation/json en el fetchq ue envia datos a graphCMS