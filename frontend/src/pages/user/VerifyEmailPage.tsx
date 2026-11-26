import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Mail, ArrowRight, Loader2, ShoppingBag } from "lucide-react";
import { authApis } from "../../services/auth";
import { toast } from "sonner";

export const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!/^\d{6}$/.test(otp)) {
      setErrorMsg("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);

      await authApis.verifyEmail({ email, otp });

      toast.success("Email verified successfully!");
      navigate("/login", { replace: true });
    } catch (err: any) {
      console.log("err", err);

      setErrorMsg(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsResending(true);
      setErrorMsg("");

      await authApis.resendOtp({ email });

      toast.success("A new OTP has been sent to your email");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Unable to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-alt px-4">
        <p className="text-text-primary font-semibold mb-4">
          No email address found. Please register first.
        </p>
        <Link to="/register" className="text-primary font-bold hover:underline">
          Go to registration
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary text-white shadow-lg mb-4"
        >
          <ShoppingBag className="w-8 h-8" />
        </Link>

        <h2 className="text-3xl font-extrabold text-text-primary">
          Verify your email
        </h2>

        <p className="mt-2 text-sm text-text-secondary">
          We've sent a 6-digit verification code to
        </p>

        <p className="text-sm font-bold text-text-primary mt-1">{email}</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-surface py-8 px-6 sm:px-10 rounded-3xl border border-border shadow-md">
          {errorMsg && (
            <div className="mb-5 p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                Verification code
              </label>

              <div className="relative rounded-xl border border-border focus-within:ring-2 focus-within:ring-primary transition-all">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail className="w-4 h-4" />
                </div>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl bg-transparent text-sm tracking-[0.4em] text-text-primary placeholder:text-text-muted placeholder:tracking-normal focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Verifying...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-text-secondary mb-3">
              Didn't receive the code?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="text-sm font-bold text-primary hover:text-primary-dark disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend OTP"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-border text-center">
            <Link
              to="/login"
              className="text-xs font-bold text-primary hover:text-primary-dark"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
