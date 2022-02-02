import Head from 'next/head'
import {PostCard,PostWidget,Categories} from '../components'
import {getPost} from "../services"

//en el caso de psot card esta recibiendo como propiedad un array
export default function Home({posts}) {
  return (
    <div className="container mx-auto px-10 mb-8">
      <Head>
        <title>CMS Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='lg:col-span-8 col-span-1'>
          {
            posts.map((post,index)=>(
                <PostCard post={post.node} key={post.title}/>
            ))
          }
        </div>
        <div className='lg:col-span-4 col-span-1'>
          <div className=' lg:sticky relative top-8'>
            <PostWidget/>
            <Categories/>
          </div>
        </div>
      </div>
    </div>
  )
}


//Crear funcion que traiga los datos como propiedad del componente
//estas funciones nomas se pueden usar con paginas no con componentes, para cargar data en componentes 
export async function getStaticProps(){
  const posts = (await getPost()) || [];
  return {
    props:{posts}
  }
}