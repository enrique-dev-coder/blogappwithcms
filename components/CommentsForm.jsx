
import React,{useState,useEffect, useRef} from 'react';
import {submitComment} from "../services"

//form para mandar datos a graphCMS
const CommentsForm = ({slug}) => {
  const [error,setError] = useState(false);
  const [localStorage,setlocalStorage] = useState(null)
  const [showSuccessMessage,setShowSuccessMesage] = useState(false);
  //no se necesitan guardar los valores del formulario en el estado, solo una referencia que mande todo a graphcms
  const commentEl=useRef();
  const nameEl=useRef();
  const emailEl=useRef();
  const storeDataEl=useRef();

  //IDEA useffect para cargar los datos en local Storage solo cuando se carge la pagina

  useEffect(()=>{
    nameEl.current.value = window.localStorage.getItem('name')
    emailEl.current.value = window.localStorage.getItem('email')
  },[])


  const handleCommentSubmission =()=>{
      setError(false)
      //revisar errores en el fromulario
      //!commentEl.current.value revisar si no hay ref
      
      //  if(!commentEl.current.value || !nameEl.current.value || emailEl.current.value )
      // destructuring para sacar el valor
      const {value:comment} = commentEl.current; // es igual que commnetEl.current.value
      const {value:name}= nameEl.current;
      const {value:email} = emailEl.current
      const {checked:storeData} = storeDataEl.current

      if(!comment || !name || !email){
        setError(true);
        return;
      }

      //formar el objeto de comentario
      const commentObj={
        name,
        email,
        comment,
        slug
      }
      //si es true el checked de la ref de storeDataEl entonces guarda ese dato en el local storage en forma de objeto
      //REVIEW em nextjs tienes que usar el window.localStorage
      if(storeData){
        window.localStorage.setItem("name",name)
        window.localStorage.setItem("email",email)
      }else{
        window.localStorage.removeItem("name",name)
        window.localStorage.removeItem("email",email)
      }
      //para subir comentarios es necesario agregar una nueva query
      //NOTE promesa(por esperar data de la api) que devuelve una respuestas que cambia a true el estado para que aparezca el mensaje
      submitComment(commentObj)
        .then((res)=>{setShowSuccessMesage(true)
        //IDEA desaparecer el mensaje despues de 3 segundos
        setTimeout(()=>{
          setShowSuccessMesage(false)
        },3000)
      })
  }


  return(
    <div className='bg-white shadow-lg rounded-lg p-8 pb-12 mb-8'>
        <h3 className='text-xl mb-8 font-semibold border-b pb-4'>Leave a Reply </h3>
        <div className='grid grid-cols-1 gap-4 mb-4'>
          <textarea 
            ref={commentEl} 
            className='p-4 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
            placeholder='Comment'
            name="comment"
          />
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4'>
          <input 
            type="text" 
            ref={nameEl}
            className='py-2 px-2 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
            placeholder='Name'
            name="name"
          />
          <input 
            type="text" 
            ref={emailEl}
            className='py-2 px-2 outline-none w-full rounded-lg focus:ring-2 focus:ring-gray-200 bg-gray-100 text-gray-700'
            placeholder='Email'
            name="email"
          />
        </div>
          {/**este elemento va a guardar datos en el local storage para cuando alguien comente algo  */}
        <div className='grid grid-cols-1 gap-4 mb-4'>
          <div>
            <input 
              ref={storeDataEl} 
              type="checkbox" 
              id="StoreData"
              value="true"
            />
            <label
              className='text-gray-500 cursor-pointer ml-2'
              htmlFor='storeData'
            > Save my email and name for the next time I comment</label>
          </div>
        </div>
        {error && <p className='text-xs text-red-500'>All fields are required.</p>}
        <div className='mt-8'>
          <button  
            type='button' 
            onClick={handleCommentSubmission}
            className='transition duration-500 ease hover:bg-indigo-900 inline-block bg-pink-600 text-lg rounded-full text-white px-8 py-3 cursor-pointer'
          >
            Post Comment
          </button>
          {showSuccessMessage && <span className='text-xl float-right font-semibold mt-3 text-green-500'>Comment submitted</span>}
        </div>
    </div>
  )
};

export default CommentsForm;
