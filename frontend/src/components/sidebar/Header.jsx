import React from 'react'
import { IoMdAdd } from "react-icons/io";


const Header = () => {
  return (
    <div>

        {/* logo */}
        <div>
             <h1 className='text-2xl font-semibold text-center py-5 text-[#ffffff]'>Doc<span className='text-[#0588df]'>Lens</span>.ai</h1>
        </div>

        {/* new chat */}
        <div className='flex items-center gap-2 font-semibold rounded-lg w-65 mx-auto bg-[#0588df] text-white px-3 py-2'>
            <span>
                <IoMdAdd />
            </span>
                <button>New Conversation</button>
        </div>
    </div>
  )
}

export default Header