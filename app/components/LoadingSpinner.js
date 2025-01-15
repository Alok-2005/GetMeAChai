import React from 'react'
// import {motion} from "framer-motion"
import "./loader.css"
const LoadingSpinner = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900  flex items-center justify-center relative overflow-hidden '>
      <div>
        {/* <motion.div
        className="w-16 h-16 border-4 border-t-4 border-t-gray-800 border-gray-200 rounded-full "
        animate={{rotate:360}}
        transition={{duration:1,repeat:Infinity,ease:"linear"}}
        >

        </motion.div> */}
<div class="terminal-loader">
  <div class="terminal-header">
    <div class="terminal-title">Status</div>
    <div class="terminal-controls">
      <div class="control close"></div>
      <div class="control minimize"></div>
      <div class="control maximize"></div>
    </div>
  </div>
  <div class="text">Loading...</div>
</div>

      </div>
    </div>
  )
}

export default LoadingSpinner
