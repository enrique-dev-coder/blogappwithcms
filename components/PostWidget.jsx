import React,{useState,useEffect} from 'react';
import moment from 'moment';
import Link from 'next/link';
//El truco de este componente es que tenemos que de alguna manera saber que articulo estamos viendo para que te cambie los posts relacionados
//el use effect lo quieres para que esa funcion corra cada que se carge el componente y te traiga diferentes datos 
//funciones de la query de graphQl
//funcion para traer los datos de los post recientes
//el use effect va a cambair cuando cambie el slug [slug]
import {getRecentPost,getSimilarPosts} from "../services"



const PostWidget = ({categories,slug}) => {
  const [relatedPosts,setRelatedPost] = useState([])
  useEffect(()=>{
    if (slug) {
      getSimilarPosts(categories,slug).then((result)=>setRelatedPost(result))
    } else{
      getRecentPost().then((result)=>setRelatedPost(result))
    }
  },[slug])
  return (
    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pb-4'>
        {slug ? "Related Post" : "Recent Posts"}
      </h3>
      {
        relatedPosts.map((post)=>(
            <div key={post.title} className='flex items-center w-full mb-4'>
              <div className='w-16 flex-none'>
                <img 
                  src={post.featuredImage.url}
                  alt={post.title}
                  height="60px"
                  width="60px"
                  className='align-middle rounded-full'
                />
              </div>
              <div className='flex-grow ml-4'>
                <p className='text-gray-500  text-xs'>
                 {moment(post.createdAt).format("MMM DD,YYYY")}
                </p>
                <Link href={`/post/${post.slug}`} key={post.title}>
                  {post.title}
                </Link>
              </div>
            </div>
        ))
      }
    </div>
  )
};

export default PostWidget;
