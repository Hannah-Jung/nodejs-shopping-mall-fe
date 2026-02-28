export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
  contact?: string;
  address?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string;
  paymentInfo?: {
    cardName?: string;
    cardNumber?: string;
    expiry?: string;
  };
}
