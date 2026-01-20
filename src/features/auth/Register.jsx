import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { registerUser, reset } from "./authSlice"
import { useNavigate, Link } from "react-router-dom"

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "", // Fixed the missing initialization
  })

  const [formError, setFormError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isSuccess, isError, isLoading: authLoading, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (formError) setFormError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Form validation
    if (!form.name || !form.email || !form.password || !form.password_confirmation) {
      setFormError("All fields are required")
      return
    }
    
    if (form.password !== form.password_confirmation) {
      setFormError("Passwords do not match")
      return
    }
    
    if (form.password.length < 4) {
      setFormError("Password must be at least 4 characters long")
      return
    }
    
    setFormError("")
    dispatch(registerUser(form))
  }

  useEffect(() => {
    setIsLoading(authLoading)
  }, [authLoading])

  useEffect(() => {
    if (isSuccess) {
      dispatch(reset())
      navigate("/login")
    }
  }, [isSuccess, dispatch, navigate])

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat bg-gray-100 px-4 py-8"
      style={{ backgroundImage: `url('./images/register-img.png')` }}
    >
      <div className="bg-white bg-opacity-90 shadow-lg rounded-lg flex flex-col md:flex-row w-full max-w-[1000px] overflow-hidden">
        {/* LEFT SECTION */}
        <div className="hidden md:flex w-full md:w-1/3 bg-gray-200 p-8 flex-col">
          <div className="img-box">
            <img src="./images/logo-crm.png" alt="logo" className="w-100" />
          </div>
          <p className="mt-4 text-gray-600 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
            velit omnis ut ratione quia magnam nihil...
          </p>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-full md:w-2/3 p-8">
          <div className="md:hidden flex flex-col items-center mb-4">
            <img src="./images/logo-crm.png" alt="logo" className="w-50 mb-2" />
            <h2 className="text-xl font-bold text-gray-800">Create Account</h2>
          </div>

          <h2 className="hidden md:block text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600 mb-6">Sign up for a new account</p>

          {/* Error Messages */}
          {(formError || isError) && (
            <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-red-100 text-red-700 border border-red-300">
              {formError || error || "Registration failed"}
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-green-100 text-green-700 border border-green-300">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full shadow-md p-2 outline-none rounded"
              autoComplete="name"
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full shadow-md p-2 outline-none rounded"
              autoComplete="email"
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full shadow-md p-2 outline-none rounded"
              autoComplete="new-password"
              required
            />
            
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full shadow-md p-2 outline-none rounded"
              autoComplete="new-password"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-500 hover:underline font-medium"
              >
                Login here
              </Link>
            </p>
          </div>

          {/* Terms and Conditions */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By registering, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register