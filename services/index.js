//libreria qeu nos ayuda a hacer queries de graphql
import { graphql } from "graphql"
import {request,gql} from "graphql-request"


const graphQLAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT
export const getPost = async()=>{
  const query= gql`
  query MyQuery {
    postsConnection {
      edges {
        node {
          createdAt
          slug
          title
          excerpt
          featuredImage {
            url
          }
          author {
            bio
            name
            id
            photo {
              url
            }
          }
          categories {
            name
            slug
          }
        }
      }
    }
  }
  `
  //se crea el graphQLAPI que e suna variable de estado
  const result = await request(graphQLAPI,query)

  return result.postsConnection.edges;
}

//en graphQl tambien podemos hacer querys que traigan funciones y parametros

export const getPostDetails = async(slug)=>{
  const query= gql`
  query getpostDetails($slug:String!) {
    post(where:{slug:$slug}){
      createdAt
      slug
      title
      excerpt
      featuredImage {
        url
      }
      author {
        bio
        name
        id
        photo {
          url
        }
      }
      categories {
        name
        slug
      }
      content{
        raw
      }
    } 
  
  }
  `
  //se crea el graphQLAPI que e suna variable de estado y aqui se manda el slug como tercer parametro
  const result = await request(graphQLAPI,query,{slug})

  return result.post;
}








//se crea un query para cada funcionalidad distinta dependiendo de los datos que buscamos
// query para para traer los recent post 
//engrpahQL tambien hay funciones para traer datos dependiendo de un criterio de busqueda
export const getRecentPost = async ()=>{
  const query = gql ` 
    query GetPostDetails(){
      posts(
        orderBy: createdAt_ASC
        last:3  
      ){
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `
  const result = await request(graphQLAPI,query)

  return result.posts;
}


//query que recibe parametros 
//los parametros del query van tambien en la funcion
export const getSimilarPosts = async (categories,slug)=>{
  const query = gql ` 
   query GetPostDetails($slug: String!,$categories:[String!]){
      posts(
        where:{slug_not:$slug, AND:{categories_some:{slug_in:$categories}}}
        last:3
      ){
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
   }
  `
  const result = await request(graphQLAPI,query,{categories,slug})

  return result.posts;
}

//query para traer categorias

export const getCategories = async()=>{
  const query = gql ` 
    query GetCategories{
      categories{
        name 
        slug
      }
    }
  `
  const result = await request(graphQLAPI,query)

  return result.categories;
}


//NOTE query para MANDAR  comentarios a gaphs cms
//NOTE vamos a mandar una http request a nuestro propio backend creado aqui mismo en la carpeta de API ese backend va a mandar a graphcms los comentarios
export const submitComment = async(obj) =>{
  const result = await fetch('/api/comments',{
    method:"POST",
    headers:{
      'Content-type':'application/json'
    },
    body:JSON.stringify(obj)
  })

  return result.json()
}

//NOTE query para traer todos los comentarios de un post
//NOTE comments(where:{post:{slug:$slug}}) quiere decir que mandes un query donde busques el comment donde post tenga ese slug
export const getComments = async(slug)=>{
  const query = gql ` 
    query GetComments($slug:String!){
      comments(where:{post:{slug:$slug}}){
        name
        createdAt
        comment
      }
    }
  `
  const result = await request(graphQLAPI,query,{slug})

  return result.comments;
}

export const getCategoryPost = async (slug) => {
  const query = gql`
    query GetCategoryPost($slug: String!) {
      postsConnection(where: {categories_some: {slug: $slug}}) {
        edges {
          cursor
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const result = await request(graphQLAPI, query, { slug });

  return result.postsConnection.edges;
};