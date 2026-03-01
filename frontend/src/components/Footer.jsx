import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribing, setSubscribing] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email')
      return
    }

    try {
      setSubscribing(true)
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/v1/newsletter/subscribe`, { email })
      if (res.data.success) {
        toast.success(res.data.message)
        setEmail('')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to subscribe')
    } finally {
      setSubscribing(false)
    }
  }

  return (
    <footer className='bg-gray-800 text-gray-200 py-10'>
      <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
        {/*  info */}
        <div className='mb-6 md:mb-0'>
            <Link to='/' className='flex gap-3 items-center'>
              <img src={Logo} alt="" className='invert w-12 h-12'/>
              <h1 className=' text-3xl font-bold'>BuildNotes</h1>
            </Link>
            <p className='mt-2'>Sharing insights, tutorials, and ideas on different topics.</p>
            <p className='mt-2 text-sm'>Lahore ,Pakistan</p>
            <p className='text-sm'>Email: info@blog.com</p>
            <p className='text-sm'>Phone: +92 xxxxxxxxxx</p>
        </div>
        {/* customer service link */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Quick Links</h3>
            <ul className='mt-2 text-sm space-y-2'>
                <li><Link to='/' className='hover:text-red-400'>Home</Link></li>
                <li><Link to='/blogs' className='hover:text-red-400'>Blogs</Link></li>
                <li><Link to='/about' className='hover:text-red-400'>About Us</Link></li>
                <li><Link to='/terms' className='hover:text-red-400'>Terms & Conditions</Link></li>
                <li><Link to='/privacy' className='hover:text-red-400'>Privacy Policy</Link></li>
            </ul>
        </div>
        {/* social media links */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Follow Us</h3>
            <div className='flex space-x-4 mt-2'>
                <FaFacebook className='cursor-pointer hover:text-red-400 transition'/>
                <FaInstagram className='cursor-pointer hover:text-red-400 transition'/>
                <FaTwitterSquare className='cursor-pointer hover:text-red-400 transition'/>
                <FaPinterest className='cursor-pointer hover:text-red-400 transition'/>
            </div>
        </div>
        {/* newsletter subscription */}
        <div>
            <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
            <p className='mt-2 text-sm'>Subscribe to get special offers, free giveaways, and more</p>
            <form onSubmit={handleSubscribe} className='mt-4 flex'>
                <input 
                type="email" 
                placeholder='Your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribing}
                className='w-full p-2 rounded-l-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
                />
                <button 
                  type='submit' 
                  disabled={subscribing}
                  className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center min-w-[100px]'
                >
                  {subscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Subscribe'}
                </button>
            </form>
        </div>
      </div>
      {/* bottom section */}
      <div className='mt-4 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>&copy; 2025 <span className='text-red-400'>BuildNotes</span>. All rights reserved</p>
        <p className='mt-2'>Designed & developed by <a href='https://www.linkedin.com/' target='_blank' rel='noopener noreferrer' className='text-red-400 hover:text-red-300 underline'>Irfan</a></p>
      </div>
    </footer>
  )
}

export default Footer