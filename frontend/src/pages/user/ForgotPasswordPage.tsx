import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { authApis } from "../../services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      await authApis.forgotPassword({ email });
      toast.success("If an account exists, a reset OTP has been sent.");

      navigate("/reset-password", {
        state: { email },
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border p-8 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>

        <p className="text-gray-500 mb-6">
          Enter your registered email address and we'll send you an OTP to reset
          your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black text-white py-3 font-medium disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send Reset OTP"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-sm font-medium hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
