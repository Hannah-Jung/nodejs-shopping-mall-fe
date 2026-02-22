import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import "./style/login.style.css";
import { loginWithEmail, clearErrors } from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(3, "Password must be at least 3 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loginError, loading } = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isValid, touchedFields },
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
    shouldUnregister: false,
  });

  const handleEmailBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    field: { onBlur: () => void; onChange: (value: string) => void },
  ) => {
    const trimmed = e.target.value.trim();
    e.target.value = trimmed;
    setValue("email", trimmed, { shouldValidate: true });
    field.onChange(trimmed);
    field.onBlur();
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (loginError) {
      const subscription = watch((value, { name, type }) => {
        if (
          name === "password" &&
          value.password &&
          value.password.length > 0
        ) {
          dispatch(clearErrors());
        }
        if (name === "email" && value.email && value.email.length > 0) {
          dispatch(clearErrors());
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [loginError, watch, dispatch]);

  useEffect(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(
        loginWithEmail({
          email: data.email.trim(),
          password: data.password,
        }),
      ).unwrap();
    } catch (error) {
      setValue("password", "", { shouldValidate: false });
      document.getElementById("password")?.focus();
    }
  };

  const handleGoogleLogin = async (googleData: unknown) => {
    void googleData;
  };

  return (
    <div className="login-area flex w-full justify-center bg-background pt-8 pb-12">
      <Card className="login-form-card w-full max-w-sm rounded-none pt-6">
        <CardHeader>
          <CardTitle className="text-center">LOGIN</CardTitle>
        </CardHeader>
        <CardContent>
          {loginError && (
            <div className="mb-4 rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive">
              {loginError}
            </div>
          )}

          <form id="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={(e) => handleEmailBlur(e, field)}
                        className={cn(
                          "w-full",
                          errors.email && "border-red-500",
                        )}
                        aria-invalid={!!errors.email}
                        data-invalid={!!errors.email}
                      />
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className={cn(
                            "w-full pr-10",
                            errors.password && "border-red-500",
                          )}
                          aria-invalid={!!errors.password}
                          data-invalid={!!errors.password}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => setShowPassword((p) => !p)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </>
                    )}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-2 pb-8">
          <Button
            type="submit"
            form="login-form"
            className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white"
            disabled={!!loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                Please wait...
              </>
            ) : (
              "Login"
            )}
          </Button>
          <div className="google-login-wrap w-full [&_.abc]:!hidden">
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Login Failed")}
                useOneTap={false}
              />
            </GoogleOAuthProvider>
          </div>
          <div className="text-sm text-muted-foreground pt-4">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/register"
              className="font-semibold text-foreground underline-offset-4 hover:text-[#F97316] hover:underline transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
