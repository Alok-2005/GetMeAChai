import React from 'react'

const Footer = () => {
  const currYear=new Date().getFullYear()
  return (
    <footer className='bg-blue-950 text-white  px-4 min-h-16 flex items-center justify-center mt-3'>
     <p className='text-center '>CopyRight &copy; {currYear} Fund Your projects with Chai</p>
    </footer>
  )
}

export default Footer
