import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RiNavigationFill } from 'react-icons/ri'
import { useAuth } from '../contexts/AuthContext'
import { registerUser } from '../api/authApi'



const Signup = ({ user, setuser }) => {

  const navigate = useNavigate()

  const[error, setError] = useState(null)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const { login, register } = useAuth()


  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      console.log("FORM DATA:", formData)

      await register(formData)

      setFormData({
        email: "",
        password: ""
      })

      navigate("/")

    } catch (err) {
      console.log(err.response?.data?.detail)
      setError(err.response?.data?.detail || "Registration Failed!")
    }

  }


  return (
    <div className='h-screen w-full'>
      <div className='border rounded-lg w-1/2 mx-auto py-10'>
        <div className='text-center font-semibold text-3xl py-10'>Signup</div>
        <form
          onSubmit={(e) => { handleSubmit(e) }}
          action="" className='flex flex-col gap-5 px-10'>

          <label htmlFor="">Username:</label>
          <input
            type="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder='enter your username' id="" className='border outline-none rounded-md  py-2 px-2 ' />

          <label htmlFor="">Email Id:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder='enter your email' id="" className='border outline-none rounded-md  py-2 px-2 ' />

          <label htmlFor="">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            id="" className='border outline-none rounded-md  py-2 px-2 ' />

          <input type="submit" value="Login" className='bg-blue-800 cursor-pointer text-white rounded-md  py-2 px-2 ' />

          {error && (
            alert(error)
          )

          }

        </form>

        <div className='text-center'>
          <p>Already have an account? <Link className='text-blue-600 cursor-pointer' to={"/login"}>Login</Link></p>
        </div>

      </div>
    </div>
  )
}

export default Signup