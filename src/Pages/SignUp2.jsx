import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import a from '../assets/newsbg.png';
import { useRegisterMutation } from '../Redux/post';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ReporterName: '',
    email: '',
    contactNo: '',
    address: '',
    AadharCardImage: null,
    ReporterProfile: null,
  });

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "contactNo") {
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly.length <= 10) {
        setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      }
    } else if (name === "AadharCardImage" || name === "ReporterProfile") {
      if (files[0].size > 5 * 1024 * 1024) {
        alert("File too large. Max 5MB allowed.");
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formToSend = new FormData();
    formToSend.append("ReporterName", formData.ReporterName);
    formToSend.append("email", formData.email);
    formToSend.append("contactNo", formData.contactNo);
    formToSend.append("address", formData.address);
    formToSend.append("AadharCardImage", formData.AadharCardImage);
    formToSend.append("ReporterProfile", formData.ReporterProfile);

    try {
      const response = await register(formToSend).unwrap();
      console.log("Registration Success:", response);
      navigate('/', { state: { message: response.message } });
    } catch (err) {
      console.error("Registration Failed:", err?.data?.error || err.message);
    }
  };

  const handleNavigateToSignIn = () => {
    navigate('/');
  };

  const isFormValid =
    formData.ReporterName.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.contactNo.length === 10 &&
    formData.address.trim() !== '' &&
    formData.AadharCardImage !== null &&
    formData.ReporterProfile !== null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen font-marathi">
      {/* Left Panel */}
      <div className="flex-1 h-64 md:h-auto relative">
        <img
          src={a}
          alt="News background"
          className="absolute inset-0 w-full h-full object-cover bg-[#12294A]"
        />
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-6">
        <h1 className="text-5xl font-normal text-red-600 mb-4 text-center w-full">
          शुभ प्रभात
        </h1>
        <h2 className="text-2xl font-normal text-[#0F2248] mb-6 text-center w-full">
          SIGN UP
        </h2>

        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          {/* Name */}
          <input
            type="text"
            name="ReporterName"
            placeholder="Name"
            value={formData.ReporterName}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />

          {/* Contact No */}
          <input
            type="text"
            name="contactNo"
            placeholder="Contact No"
            value={formData.contactNo}
            onChange={handleChange}
            required
            inputMode="numeric"
            pattern="\d{10}"
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
          />

          {/* Reporter Profile Image */}
          <div className="w-full">
            <label className="block mb-1 text-[#0F2248] font-medium">Reporter Profile Image</label>
            <input
              type="file"
              name="ReporterProfile"
              accept="image/*"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#0F2248] file:text-white
                hover:file:bg-[#0c1b3a]"
            />
          </div>

          {/* Aadhar Card Image */}
          <div className="w-full">
            <label className="block mb-1 text-[#0F2248] font-medium">Aadhar Card Image</label>
            <input
              type="file"
              name="AadharCardImage"
              accept="image/*"
              onChange={handleChange}
              required
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-[#0F2248] file:text-white
                hover:file:bg-[#0c1b3a]"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className={`py-2 px-4 bg-[#0F2248] text-white rounded-full text-lg font-normal transition ${
                isLoading || !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-[#0c1b3a]"
              }`}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm text-center">
              {error?.data?.error}
            </p>
          )}

          {/* Already have account */}
          <p className="cursor-pointer text-center">
            Already Have Account?
            <span
              className="text-red-600 cursor-pointer hover:underline ml-1"
              onClick={handleNavigateToSignIn}
            >
              Sign In
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
