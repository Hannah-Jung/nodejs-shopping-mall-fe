import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppDispatch, useAppSelector } from "@/features/hooks";
import { updateUserProfile } from "@/features/user/userSlice";
import { formatPhoneNumber } from "@/utils/number";
import { US_STATES } from "@/constants/us-states.constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentForm from "@/page/PaymentPage/component/PaymentForm";
import { ErrorField, getFieldStyle } from "@/common/component/FormElements";
import { formFilters } from "@/utils/formUtils";
import { useNavigate } from "react-router-dom";

const profileSchema = z.object({
  contact: z.string().min(12, "Enter a valid phone number (12 digits)"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(1, "Please select a state"),
  zip: z.string().length(5, "Zip code must be 5 digits"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const initialCardValue = {
  cvc: "",
  expiry: "",
  focus: "" as any,
  name: "",
  number: "",
};

const formatExpiry = (value: string) => {
  const v = value.replace(/\D/g, "");

  if (/^[2-9]$/.test(v)) {
    return `0${v}/`;
  }

  return v.replace(/^(\d{2})(\d)/, "$1/$2").substr(0, 5);
};

const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim()
    .substr(0, 19);
};

const MyProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAppSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardValue, setCardValue] = useState(initialCardValue);
  const [cardErrors, setCardErrors] = useState({
    number: false,
    name: false,
    expiry: false,
  });

  useEffect(() => {
    if (user) {
      setValue("contact", user.contact || "");
      setValue("address", user.address || "");
      setValue("addressLine2", user.addressLine2 || "");
      setValue("city", user.city || "");
      setValue("zip", user.zip || "");

      if (user.state) {
        setValue("state", user.state, { shouldDirty: false });
      }
    }
  }, [user, setValue]);

  const onContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    if (formatted.length <= 12) {
      setValue("contact", formatted, { shouldValidate: true });
    }
  };

  const onCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = formFilters.alphabetic(e.target.value);
    setValue("city", cleaned, { shouldValidate: true, shouldDirty: true });
  };

  const onZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = formFilters.numeric(e.target.value);
    if (val.length <= 5) {
      setValue("zip", val, { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleCardUpdate = () => {
    const newErrors = {
      number: cardValue.number.length < 19,
      name: cardValue.name.trim().length < 2,
      expiry: cardValue.expiry.length < 5,
    };

    setCardErrors(newErrors);
    if (Object.values(newErrors).some((v) => v)) {
      return;
    }
    const updateData = {
      ...watch(),
      paymentInfo: {
        cardName: cardValue.name,
        cardNumber: cardValue.number.replace(/\s/g, ""),
        expiry: cardValue.expiry,
      },
    };
    dispatch(updateUserProfile(updateData));
    setIsModalOpen(false);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile(data)).unwrap();

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Update failed:", error);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleModalOpen = (open: boolean) => {
    setIsModalOpen(open);
    if (open && user?.paymentInfo) {
      setCardValue({
        cvc: "",
        expiry: formatExpiry(user.paymentInfo.expiry || ""),
        focus: "",
        name: user.paymentInfo.cardName || "",
        number: formatCardNumber(user.paymentInfo.cardNumber || ""),
      });
    } else if (!open) {
      setCardValue(initialCardValue);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider border-b pb-2 text-zinc-800">
          Personal Information
        </h2>
        <div className="grid sm:grid-cols-2 gap-6 p-6 bg-zinc-50/50 border border-zinc-100 rounded-sm">
          <div className="space-y-1">
            <Label className="text-[10px] font-black text-zinc-400 uppercase">
              First Name
            </Label>
            <Input
              value={user?.firstName}
              disabled
              className="bg-white border-zinc-200 font-bold opacity-60 cursor-not-allowed"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[10px] font-black text-zinc-400 uppercase">
              Last Name
            </Label>
            <Input
              value={user?.lastName}
              disabled
              className="bg-white border-zinc-200 font-bold opacity-60 cursor-not-allowed"
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <Label className="text-[10px] font-black text-zinc-400 uppercase">
              Email
            </Label>
            <Input
              value={user?.email}
              disabled
              className="bg-white border-zinc-200 font-bold opacity-60 cursor-not-allowed"
            />
          </div>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider border-b pb-2 text-zinc-800">
          Shipping Address
        </h2>
        <div className="grid grid-cols-1 gap-y-5">
          <div className="flex flex-col">
            <Label
              className={cn(
                "text-[10px] font-black uppercase mb-1",
                errors.address && "text-red-500",
              )}
            >
              Address Line 1
            </Label>
            <Input
              {...register("address")}
              value={watch("address")}
              placeholder="Street Address"
              className={getFieldStyle(!!errors.address)}
              onChange={(e) =>
                setValue("address", e.target.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
            <ErrorField message={errors.address?.message} />
          </div>

          <div className="grid grid-cols-2 gap-x-5">
            <div className="flex flex-col">
              <Label className="text-[10px] font-black uppercase mb-1">
                Address Line 2 (Optional)
              </Label>
              <Input
                {...register("addressLine2")}
                value={watch("addressLine2")}
                placeholder="Apt, Suite, etc."
                className={getFieldStyle(false)}
                onChange={(e) =>
                  setValue("addressLine2", e.target.value, {
                    shouldDirty: true,
                  })
                }
              />
            </div>
            <div className="flex flex-col">
              <Label
                className={cn(
                  "text-[10px] font-black uppercase mb-1",
                  errors.city && "text-red-500",
                )}
              >
                City
              </Label>
              <Input
                {...register("city")}
                value={watch("city")}
                placeholder="City"
                className={getFieldStyle(!!errors.city)}
                onChange={onCityChange}
              />
              <ErrorField message={errors.city?.message} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-5">
            <div className="flex flex-col">
              <Label
                className={cn(
                  "text-[10px] font-black uppercase mb-1",
                  errors.state && "text-red-500",
                )}
              >
                State
              </Label>
              <Select
                key={watch("state") || "empty"}
                onValueChange={(v) =>
                  setValue("state", v, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                value={watch("state")}
              >
                <SelectTrigger
                  className={cn(
                    getFieldStyle(!!errors.state),
                    "h-auto min-h-[48px]",
                  )}
                >
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent
                  className="bg-white border border-zinc-200 shadow-xl overflow-y-auto max-h-[300px]"
                  position="popper"
                  sideOffset={5}
                >
                  {US_STATES.map((s) => (
                    <SelectItem key={s.code} value={s.code}>
                      {s.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorField message={errors.state?.message} />
            </div>
            <div className="flex flex-col">
              <Label
                className={cn(
                  "text-[10px] font-black uppercase mb-1",
                  errors.zip && "text-red-500",
                )}
              >
                Zip Code
              </Label>
              <Input
                {...register("zip")}
                value={watch("zip")}
                maxLength={5}
                placeholder="Zip"
                className={getFieldStyle(!!errors.zip)}
                onChange={onZipChange}
              />
              <ErrorField message={errors.zip?.message} />
            </div>
          </div>

          <div className="flex flex-col">
            <Label
              className={cn(
                "text-[10px] font-black uppercase mb-1",
                errors.contact && "text-red-500",
              )}
            >
              Contact Number
            </Label>
            <Input
              {...register("contact")}
              value={watch("contact")}
              placeholder="000-000-0000"
              className={getFieldStyle(!!errors.contact)}
              onChange={onContactChange}
            />
            <ErrorField message={errors.contact?.message} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-black uppercase tracking-wider border-b pb-2 text-zinc-800">
          Payment Method
        </h2>
        <div className="p-6 border border-dashed border-zinc-200 rounded-sm flex items-center justify-between bg-zinc-50/30 transition-colors hover:bg-zinc-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-zinc-200 rounded-sm flex items-center justify-center text-[10px] font-black text-zinc-500 uppercase">
              Card
            </div>
            <div>
              <p className="text-xs font-black text-zinc-800 uppercase leading-none mb-1">
                {user?.paymentInfo?.cardNumber
                  ? `**** **** **** ${user.paymentInfo.cardNumber.slice(-4)}`
                  : "No Card Saved"}
              </p>
              <p className="text-[10px] font-bold text-zinc-400 uppercase leading-none">
                Expires: {user?.paymentInfo?.expiry || "--/--"}
              </p>
            </div>
          </div>
          <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="text-[10px] font-black uppercase h-8 border-zinc-300 px-6 hover:bg-black hover:text-white transition-all"
              >
                {user?.paymentInfo?.cardNumber ? "Edit" : "Add Card"}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px] bg-white rounded-none border-none p-6 sm:p-10 outline-none overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-tight text-center">
                  Update Card Info
                </DialogTitle>
              </DialogHeader>

              <div
                className="w-full py-4 sm:py-8 [&>div]:flex [&>div]:flex-col sm:[&>div]:flex-row [&>div]:gap-6 sm:[&>div]:gap-10 [&>div]:items-center sm:[&>div]:items-start [&>div]:justify-center"
                key={isModalOpen ? "open" : "closed"}
              >
                <PaymentForm
                  handleInputFocus={(e) =>
                    setCardValue({ ...cardValue, focus: e.target.name as any })
                  }
                  cardValue={cardValue}
                  handlePaymentInfoChange={(e) => {
                    const { name, value } = e.target;
                    let formattedValue = value;

                    if (name === "number")
                      formattedValue = formatCardNumber(value);
                    if (name === "expiry") formattedValue = formatExpiry(value);
                    if (name === "name")
                      formattedValue = value
                        .replace(/[0-9!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~]/g, "")
                        .toUpperCase();

                    setCardErrors((prev) => ({ ...prev, [name]: false }));
                    setCardValue({ ...cardValue, [name]: formattedValue });
                  }}
                  errors={cardErrors}
                  showCvc={false}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="order-2 sm:order-1 flex-1 h-12 rounded-none font-black uppercase border-zinc-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCardUpdate}
                  className="order-1 sm:order-2 flex-1 h-12 bg-black text-white rounded-none font-black uppercase hover:bg-[#F97316] transition-colors"
                >
                  Save Card
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Button
        type="submit"
        className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white font-black uppercase h-14 text-sm tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="animate-spin mr-2" />
        ) : (
          "Save All Changes"
        )}
      </Button>
    </form>
  );
};

export default MyProfile;
