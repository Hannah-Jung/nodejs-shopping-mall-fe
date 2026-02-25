export const currencyFormat = (
  value: number | string | null | undefined,
): string => {
  if (value === undefined || value === null) return "0.00";

  const numberValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numberValue)) return "0.00";

  return numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export function cc_expires_format(string: string): string {
  return string
    .replace(/[^0-9]/g, "")
    .replace(/^([2-9])$/g, "0$1")
    .replace(/^(1{1})([3-9]{1})$/g, "0$1/$2")
    .replace(/^0{1,}/g, "0")
    .replace(/^([0-1]{1}[0-9]{1})([0-9]{1,2}).*/g, "$1/$2");
}

export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};
