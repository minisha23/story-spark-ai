import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import toast, { Toaster } from "react-hot-toast";
import { WandSparkles, BookOpen, UsersRound } from "lucide-react";
import logo from "../../assets/logoNew.png";
import SSInput from "../ui-component/ss-input/ss-input";
import SSButton from "../ui-component/ss-button/ss-button";
import RedirectComponent from "../redirect.component";
import { useLoginUserMutation, useGoogleLoginMutation } from "../../redux/apis/auth.api";
import { storeUserInfo, getUserInfo } from "../../services/auth.service";
import { USER_ROLE } from "../../constants/role";

type Inputs = {
  email: string;
  password: string;
};

const LoginComponent = () => {
  const [loginUser] = useLoginUserMutation();
  const [googleLogin] = useGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ mode: "onChange" });

  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsBusy(true);
    try {
      const res = await loginUser({ ...data }).unwrap();
      if (res.data.accessToken) {
        toast.success("User logged in successfully!");
        storeUserInfo({
          accessToken: res.data.accessToken,
        });
        setIsLoggedIn(true);
      }
    } catch {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    setIsBusy(true);
    try {
      const res = await googleLogin({
        token: credentialResponse.credential,
      }).unwrap();

      if (res.data.accessToken) {
        toast.success("User logged in successfully with Google!");
        storeUserInfo({
          accessToken: res.data.accessToken,
        });
        setIsLoggedIn(true);
      }
    } catch {
      toast.error("Failed to login with Google. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  const handleGoogleLoginError = () => {
    toast.error("Google login failed. Please try again.");
  };

  if (isLoggedIn) {
    const userInfo = getUserInfo();
    const isDashboardUser =
      userInfo?.role === USER_ROLE.ADMIN || userInfo?.role === USER_ROLE.SUPER_ADMIN;

    return (
      <RedirectComponent
        defaultPath={isDashboardUser ? "/dashboard" : "/explore"}
      />
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 relative overflow-hidden text-slate-900 dark:text-slate-100">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 box-border px-4">
        
        {/* Left Side: Brand Marketing & Features Showcase */}
        <div className="flex flex-col gap-6 text-left hidden lg:flex">
          <div className="flex justify-start mb-2">
            <Link to="/" className="inline-block transition-transform duration-200 active:scale-95">
              <img 
                src={logo} 
                alt="Story Spark AI" 
                className="h-14 w-auto object-contain brightness-100 dark:brightness-110"
              />
            </Link>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Turns Ideas into
            <br /> 
            unforgettable stories
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
            AI-powered storytelling platform designed to help you create, connect, and inspire.
          </p>

          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 p-4 shadow-sm">
              <div className="p-3 rounded-xl bg-violet-500/10 shrink-0">
                <WandSparkles className="text-violet-600 dark:text-violet-400 h-6 w-6"/>
              </div>
              <div>
                <h4 className="font-bold text-base">Smart Writing</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">AI engine that deeply co-authors and understands narrative ideas.</p>
              </div>
            </div>

            <div className="flex items-center gap-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 p-4 shadow-sm">
              <div className="p-3 rounded-xl bg-violet-500/10 shrink-0">
                <BookOpen className="text-violet-600 dark:text-violet-400 h-6 w-6"/>
              </div>
              <div>
                <h4 className="font-bold text-base">Endless Creativity</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Generates layered story directions that captivate and anchor lore grids.</p>
              </div>
            </div>

            <div className="flex items-center gap-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 p-4 shadow-sm">
              <div className="p-3 rounded-xl bg-violet-500/10 shrink-0">
                <UsersRound className="text-violet-600 dark:text-violet-400 h-6 w-6"/>
              </div>
              <div>
                <h4 className="font-bold text-base">Built for Everyone</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Tailored structural workflows optimized for writers, creators, and dreamers.</p>
              </div>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 p-5 rounded-2xl bg-white/50 dark:bg-slate-900/30 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium shadow-inner">
            Create, edit, and generate engaging multiple story variations from a single context prompt matrix. Perfect for checking alternatives on the future of interactive digital fiction layers.
          </div>
        </div>

        {/* Right Side: Authentication Panel Card Container */}
        <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/50 rounded-[2rem] p-6 sm:p-10 shadow-2xl overflow-hidden box-border">
          <div className="mb-6 flex justify-start lg:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            >
              <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" />
              Back to Home
            </Link>
          </div>

          <div className="lg:hidden text-center mb-6">
            <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 drop-shadow-sm">
              STORY SPARK AI
            </h2>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-left tracking-tight">
            Welcome Back
          </h3>

          <form
            className="space-y-5 w-full min-w-0 overflow-hidden box-border"
            onSubmit={handleSubmit(onSubmit)}
          >
            <SSInput
              label="Email address"
              name="email"
              type="email"
              placeholder="Enter your email"
              required={true}
              icon="fi fi-rr-envelope"
              register={register}
              validation={{ required: "Email is required" }}
              error={errors.email}
            />

            <div>
              <SSInput
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required={true}
                icon="fi fi-rr-lock"
                register={register}
                validation={{ required: "Password is required" }}
                error={errors.password}
              />
              <div className="flex justify-end pt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <SSButton text="Sign In" type="submit" isLoading={isBusy} />
            </div>
          </form>

          {/* Custom Form Divider */}
          <div className="relative my-8 w-full box-border">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 text-slate-400 dark:text-slate-500 font-semibold tracking-wide">
                Or
              </span>
            </div>
          </div>

          {/* Social Identity OAuth Block Container */}
          <div className="flex justify-center list-none w-full box-border">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
          </div>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
            >
              Sign up for free
            </Link>
          </p>
        </div>

      </div>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default LoginComponent;