import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getProfile, loginUser, reset } from "./authSlice"
import { useNavigate, Link } from "react-router-dom"

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isLoading, isError, token, error } = useSelector(
    (state) => state.auth
  )

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { email, password } = formData
  const [formError, setFormError] = useState("")

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      setFormError("Email and password are required")
      return
    }

    setFormError("")
    dispatch(loginUser({ email, password }))
    .unwrap()
    .then(()=>{
      dispatch(getProfile())
    })
  }

  // Redirect after login
  useEffect(() => {
    if (token) {
      navigate("/")
    }

    return () => {
      dispatch(reset())
    }
  }, [token, navigate, dispatch])

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
            <h2 className="text-xl font-bold text-gray-800">CRM Login</h2>
          </div>

          <h2 className="hidden md:block text-2xl font-bold text-gray-800 mb-2">
            CRM Login
          </h2>
          <p className="text-gray-600 mb-6">Sign in to your account</p>

          {/* Error Messages */}
          {(formError || isError) && (
            <div className="mb-4 p-3 rounded-lg text-sm font-medium bg-red-100 text-red-700 border border-red-300">
              {formError || error || "Invalid credentials"}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={handleChange}
              className="w-full shadow-md p-2 outline-none rounded"
              autoComplete="email"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className="w-full shadow-md p-2 outline-none rounded"
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium transition duration-150 ease-in-out ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-pink-500 hover:underline font-medium"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login