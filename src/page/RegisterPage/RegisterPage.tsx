import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import "./style/register.style.css";
import "../LoginPage/style/login.style.css";
import {
  registerUser,
  clearErrors,
  checkEmailAvailability,
} from "../../features/user/userSlice";
import { useAppDispatch, useAppSelector } from "../../features/hooks";
import { cn } from "@/lib/utils";

const refinedNameRegex = /^\p{L}([\s'-]?\p{L})*$/u;

const signUpSchema = z
  .object({
    email: z
      .string()
      .catch("")
      .pipe(z.string().trim())
      .pipe(
        z.string().superRefine((val, ctx) => {
          if (val.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Email is required",
            });
            return;
          }
          if (/\s/.test(val)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Email cannot contain spaces",
            });
            return;
          }
          const ok = z.string().email().safeParse(val);
          if (!ok.success) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Please enter a valid email address",
            });
          }
        }),
      ),

    firstName: z
      .string()
      .catch("")
      .pipe(
        z
          .string()
          .trim()
          .min(1, "First name is required")
          .max(255, "First name is too long")
          .regex(refinedNameRegex, "Please enter a valid first name")
          .refine((val) => (val.match(/\s/g) || []).length <= 1, {
            message: "Please enter a valid first name",
          }),
      ),

    lastName: z
      .string()
      .catch("")
      .pipe(
        z
          .string()
          .trim()
          .min(1, "Last name is required")
          .max(255, "Last name is too long")
          .regex(refinedNameRegex, "Please enter a valid last name")
          .refine((val) => (val.match(/\s/g) || []).length <= 1, {
            message: "Please enter a valid last name",
          }),
      ),

    password: z
      .string()
      .catch("")
      .pipe(
        z
          .string()
          .trim()
          .min(1, "Password is required")
          .refine((val) => !val.includes(" "), {
            message: "Spaces are not allowed in the password",
          })
          .refine(
            (val) =>
              val.length >= 8 &&
              /[A-Z]/.test(val) &&
              /[a-z]/.test(val) &&
              /\d/.test(val) &&
              /[^a-zA-Z0-9]/.test(val),
            { message: "Please enter a valid password" },
          ),
      ),

    confirmPassword: z
      .string()
      .catch("")
      .pipe(z.string().trim().min(1, "Please confirm your password")),

    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormData = z.infer<typeof signUpSchema>;

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { registrationError, loading } = useAppSelector((state) => state.user);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    setError,
    formState: { errors, isValid, touchedFields },
    trigger,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    shouldUnregister: false,
  });

  const [passwordFieldFocused, setPasswordFieldFocused] = React.useState(false);
  const passwordValue = watch("password") ?? "";
  const showPasswordChecklist =
    passwordFieldFocused || (touchedFields.password && !!errors.password);

  const passwordChecks = {
    minLength: passwordValue.length >= 8,
    hasUppercase: /[A-Z]/.test(passwordValue),
    hasLowercase: /[a-z]/.test(passwordValue),
    hasNumber: /\d/.test(passwordValue),
    hasSpecial: /[^a-zA-Z0-9]/.test(passwordValue),
    noSpaces: !passwordValue.includes(" "),
  };

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  React.useEffect(() => {
    if (confirmPassword && password && confirmPassword !== password) {
      trigger("confirmPassword");
    }
  }, [confirmPassword, password, trigger]);

  const handleEmailBlur = async (
    e: React.FocusEvent<HTMLInputElement>,
    field: { onBlur: () => void; onChange: (value: string) => void },
  ) => {
    const rawValue = e.target.value;
    const trimmed = rawValue.trim();
    e.target.value = trimmed;

    field.onChange(trimmed);
    setValue("email", trimmed, { shouldValidate: true });

    field.onBlur();

    const isEmailValid = await trigger("email");
    if (!isEmailValid || !trimmed) return;

    try {
      await dispatch(checkEmailAvailability(trimmed)).unwrap();
    } catch (payload) {
      const msg =
        (payload as { message?: string })?.message ??
        "This email is already registered";
      setError("email", { type: "manual", message: msg });
    }
  };

  const onSubmit = (data: SignUpFormData) => {
    dispatch(
      registerUser({
        email: data.email.trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        password: data.password.trim(),
        navigate,
      }),
    );
  };

  React.useEffect(() => {
    if (registrationError) {
      const subscription = watch(() => {
        dispatch(clearErrors());
      });
      return () => subscription.unsubscribe();
    }
  }, [registrationError, watch, dispatch]);

  return (
    <div className="login-area flex w-full justify-center bg-background pt-8 pb-12">
      <Card className="login-form-card w-full max-w-md rounded-none pt-6">
        <CardHeader>
          <CardTitle className="text-center">SIGN UP</CardTitle>
        </CardHeader>
        <CardContent>
          {registrationError && (
            <div className="error-message mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {registrationError}
            </div>
          )}
          <form id="register-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                {" "}
                <Label htmlFor="email">
                  {" "}
                  Email <span className="text-destructive">*</span>{" "}
                </Label>{" "}
                <div className="relative">
                  {" "}
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
                          touchedFields.email &&
                            !errors.email &&
                            "border-green-500",
                        )}
                        aria-invalid={!!errors.email}
                        data-invalid={!!errors.email}
                      />
                    )}
                  />{" "}
                  {touchedFields.email && !errors.email && (
                    <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}{" "}
                </div>{" "}
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="firstName">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First Name"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={() => {
                          field.onBlur();
                          const trimmed = (field.value ?? "").trim();
                          if (trimmed !== (field.value ?? "")) {
                            setValue("firstName", trimmed, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        className={cn(
                          "w-full",
                          errors.firstName && "border-red-500",
                          touchedFields.firstName &&
                            !errors.firstName &&
                            "border-green-500",
                        )}
                        aria-invalid={!!errors.firstName}
                        data-invalid={!!errors.firstName}
                      />
                    )}
                  />
                  {touchedFields.firstName && !errors.firstName && (
                    <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lastName">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last Name"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={() => {
                          field.onBlur();
                          const trimmed = (field.value ?? "").trim();
                          if (trimmed !== (field.value ?? "")) {
                            setValue("lastName", trimmed, {
                              shouldValidate: true,
                            });
                          }
                        }}
                        className={cn(
                          "w-full",
                          errors.lastName && "border-red-500",
                          touchedFields.lastName &&
                            !errors.lastName &&
                            "border-green-500",
                        )}
                        aria-invalid={!!errors.lastName}
                        data-invalid={!!errors.lastName}
                      />
                    )}
                  />
                  {touchedFields.lastName && !errors.lastName && (
                    <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-600">
                    {errors.lastName.message}
                  </p>
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
                          onBlur={(e) => {
                            field.onBlur();
                            setPasswordFieldFocused(false);
                          }}
                          onFocus={() => setPasswordFieldFocused(true)}
                          className={cn(
                            "w-full pr-10",
                            errors.password && "border-red-500",
                            touchedFields.password &&
                              !errors.password &&
                              "border-green-500",
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
                  {touchedFields.password && !errors.password && (
                    <CheckCircle2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500 pointer-events-none" />
                  )}
                </div>
                {showPasswordChecklist && (
                  <ul className="flex flex-col gap-1 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
                    <li className="flex items-center gap-2">
                      {passwordChecks.minLength ? (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-red-600" />
                      )}
                      <span>At least 8 characters</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordChecks.hasUppercase ? (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-red-600" />
                      )}
                      <span>At least one uppercase letter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordChecks.hasLowercase ? (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-red-600" />
                      )}
                      <span>At least one lowercase letter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordChecks.hasNumber ? (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-red-600" />
                      )}
                      <span>At least one number</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordChecks.hasSpecial ? (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-red-600" />
                      )}
                      <span>At least one special character</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {passwordChecks.noSpaces ? (
                        <Check className="h-4 w-4 shrink-0 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 shrink-0 text-red-600" />
                      )}
                      <span>No spaces allowed</span>
                    </li>
                  </ul>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          className={cn(
                            "w-full pr-10",
                            errors.confirmPassword && "border-red-500",
                            touchedFields.confirmPassword &&
                              !errors.confirmPassword &&
                              "border-green-500",
                          )}
                          aria-invalid={!!errors.confirmPassword}
                          data-invalid={!!errors.confirmPassword}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </>
                    )}
                  />
                  {touchedFields.confirmPassword && !errors.confirmPassword && (
                    <CheckCircle2 className="absolute right-10 top-1/2 h-4 w-4 -translate-y-1/2 text-green-500 pointer-events-none" />
                  )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Controller
                    name="terms"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked === true);
                          trigger("terms");
                        }}
                        aria-invalid={!!errors.terms}
                        data-invalid={!!errors.terms}
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="cursor-pointer font-normal">
                    Accept Terms & Conditions{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-600">{errors.terms.message}</p>
                )}
              </div>
              <Button
                type="submit"
                form="register-form"
                className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white"
                disabled={!!loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    Please wait...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center gap-2 pb-8">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-foreground underline-offset-4 hover:text-[#F97316] hover:underline transition-colors"
            >
              Sign In
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
