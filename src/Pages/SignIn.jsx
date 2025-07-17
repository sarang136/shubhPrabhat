import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddPostMutation, useVerifyMutation } from "../Redux/post";
import a from "../assets/newsbg.png";
import { toast } from "react-toastify";

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [reporterId, setReporterId] = useState("");
  const location = useLocation();
  const message = location.state || {};

  const [addPost, { isLoading: verifyEmailLoading, error: verifyError }] = useAddPostMutation();
  const [verify, { isLoading: isLoginLoading, error: loginError }] = useVerifyMutation();

  const isEmailValid = email.includes("@") && email.includes(".com");

  const handleVerify = async () => {
    try {
      const response = await addPost({ email }).unwrap();
      toast.success(response.message || "OTP sent");
      if (response?.reporterId) {
        setReporterId(response.reporterId);
      }
    } catch (err) {
      console.error("OTP send failed:", err);
      alert("Failed to send OTP. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await verify({ email, otp, reporterId }).unwrap();
      toast.success(response.message || "Successfully Logged In");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Failed:", err);
      alert("Something went wrong. Please check your OTP and try again.");
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length <= 4) setOtp(value);
  };

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
      <div className="flex-1 flex flex-col justify-center items-center bg-white px-6 py-12 gap-8">
      
         <div className="text-5xl font-bold text-red-600  flex justify-center text-center w-full gap-8 ">
         <img className="h-[100px]" src="./main-logo.jpg"/>
        </div>
        <h2 className="text-2xl font-bold text-[#0F2248] mb-6 text-center w-full">
          REPORTER  LOGIN
        </h2>
    
        {message?.message && (
          <p className="text-sm text-gray-500 p-2 text-center w-full">
            {message.message}
          </p>
        )}

        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6">
          {/* Email input + Verify OTP */}
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 pr-28 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
            />
            <button
              type="button"
              onClick={handleVerify}
              disabled={!isEmailValid || verifyEmailLoading}
              className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-green-600 text-white text-sm rounded-full transition ${
                !isEmailValid || verifyEmailLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
            >
              {verifyEmailLoading ? "Verifying..." : "Verify"}
            </button>
          </div>

          {/* OTP and Login button */}
          {reporterId && (
            <>
              <input
                type="text"
                inputMode="numeric"
                maxLength={4}
                placeholder="OTP"
                value={otp}
                onChange={handleOtpChange}
                required
                className="w-full h-12 px-4 border border-[#0F2248] rounded-full text-[#0F2248] placeholder-[#667085] focus:outline-none focus:ring-2 focus:ring-[#0F2248]"
              />

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoginLoading || otp.length !== 4}
                  className={`py-2 px-4 bg-[#0F2248] text-white rounded-full text-lg font-medium transition ${
                    isLoginLoading || otp.length !== 4
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#0c1b3a]"
                  }`}
                >
                  {isLoginLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </>
          )}

          {/* Error message */}
          {(verifyError || loginError) && (
            <p className="text-red-600 text-sm text-center">
              {verifyError ? "Failed to send OTP." : "Login failed. Please try again."}
            </p>
          )}

          <p className="cursor-pointer text-center">
            Don’t have an account?{" "}
            <span
              className="text-red-600 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
