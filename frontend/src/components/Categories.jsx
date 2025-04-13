import React from 'react'
import { assets, categories } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {

  const {navigate} = useAppContext()

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
        {
          categories.map((category,index) => (
            (
              <div key={index} style={{backgroundColor:category.bgColor}} onClick={()=>{navigate(`products/${category.path.toLowerCase()}`)}} className='group cursor-pointer py-2 px-3 mb-5 gap-2 rounded flex flex-col justify-center items-center'>
                <img src={category.image} alt="" className='group-hover:scale-105 transition max-w-28' />
                <p className='text-sm font-medium'>{category.text}</p>
              </div>
            )
          ))
        }

      </div>
    </div>
  )
}

export default Categories
