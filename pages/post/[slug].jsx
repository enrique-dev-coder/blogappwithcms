import React from 'react';
import {getPost,getPostDetails} from "../../services"

import {PostDetail,Categories,PostWidget,Author,Comments,Loader,CommentsForm} from "../../components"
import{useRouter} from "next/router"

const PostDetails = ({post}) => {
 // console.log(post);
 const router= useRouter()
 if(router.isFallback){
   return <Loader/>
 }
  return(
    <div className='container mx-auto px-10 mb-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='col-span-1 lg:col-span-8 '>
          <PostDetail post={post}/>
          <Author author={post.author}/>
          <CommentsForm slug={post.slug}/>
          <Comments slug={post.slug}/>
        </div>
        <div className='col-span-1 lg:col-span-4 '>
          <div className='relative lg:sticky top-8'>
            <PostWidget slug={post.slug} categories={post.categories.map((category)=>category.slug)}/>
            <Categories/>
          </div>
        </div>
      </div>
    </div>

  ) 
};

export default PostDetails;

//vamos a recibir el slug dependiendo del url
//el param 
//cuando tenemos urls cambiantes se tiene que agregar el getStaticPaths
export async function getStaticProps({params}){
  const data = await getPostDetails(params.slug)
  //console.log(params)
  return {
    props:{post:data}
  }
}

//funcion para que la 

export async function getStaticPaths(){
  //aqui vamos a traer todos los post
  const posts = await getPost()
  //los pathas van a llevar un array de las rutas que iran sinedo generados como para que la app sepa todods los caminos generados
  return{
    paths: posts.map(({node:{slug}})=>({params:{slug}})),
    fallback:true
  }

}

//NOTE el fallback es para que nextjs genere contenido al momento en vez de cada deploy