import { Award, ChartColumnBig, FolderPlus, ShieldCheck, SquareUser } from 'lucide-react'
import { LiaCommentSolid } from "react-icons/lia";
import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaEdit, FaRegEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const { user } = useSelector(store => store.auth);
  
  // Debug log to check user role
  console.log('Sidebar - User:', user);
  console.log('Sidebar - User Role:', user?.role);
  console.log('Sidebar - Is Admin:', user?.role === 'admin');
  
  return (
    <div className='hidden mt-10 fixed md:block border-r-2 dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600 0 w-[300px] p-10 space-y-2 h-screen z-10 overflow-y-auto'>
      {/* <h1 className='text-xl font-semibold text-gray-700 cursor-pointer hover:bg-gray-800 p-2 text-center rounded-md hover:text-white'>Your Blogs</h1> */}
      {/* <h2 className='text-xl font-semibold cursor-pointer'>Comments</h2> */}
      {/* <h1 className='text-xl font-semibold cursor-pointer hover:bg-gray-800 p-2 text-center rounded-md hover:text-white'>Write a Blog</h1>
      <h1 className='text-xl font-semibold cursor-pointer hover:bg-gray-800 p-2 text-center rounded-md hover:text-white'>Profile</h1> */}

      <div className='text-center pt-10 px-1 space-y-2'>
        <NavLink to='/dashboard/profile' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-2 rounded-2xl w-ful`}>
          <SquareUser />
          <span>Profile</span>
        </NavLink>
        <NavLink to='/dashboard/your-blog' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-2 rounded-2xl w-ful`}>
          <ChartColumnBig />
          <span>Your Blogs</span>
        </NavLink>
        <NavLink to='/dashboard/achievements' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-2 rounded-2xl w-ful`}>
          <Award/>
          <span>Achievements</span>
        </NavLink>
        <NavLink to='/dashboard/comments' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-2 rounded-2xl w-ful`}>
          <LiaCommentSolid />
          <span>Comments</span>
        </NavLink>
        <NavLink to='/dashboard/write-blog' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-2 rounded-2xl w-ful`}>
          <FaRegEdit/>
          <span>Create Blog</span>
        </NavLink>
        
        {/* Admin Only Section */}
        {user?.role === 'admin' && (
          <>
            <div className="border-t border-gray-300 dark:border-gray-600 my-4"></div>
            <NavLink to='/dashboard/admin' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-2 rounded-2xl w-ful`}>
              <ShieldCheck />
              <span>Admin Panel</span>
            </NavLink>
          </>
        )}
      </div>

    </div>
  )
}

export default Sidebar
