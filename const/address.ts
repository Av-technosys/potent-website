export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export interface AddressFormData {
  id?: number | string;
  fullName: string;
  phone: string;
  street: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface AddressFormErrors {
  fullName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export function validateAddress(data: Partial<AddressFormData>): {
  isValid: boolean;
  errors: AddressFormErrors;
} {
  const errors: AddressFormErrors = {};

  const fullName = (data.fullName || "").trim();
  if (!fullName) {
    errors.fullName = "Full name is required";
  }

  const phone = (data.phone || "").replace(/\D/g, "");
  if (!phone) {
    errors.phone = "Phone number is required";
  } else if (phone.length !== 10) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }

  const street = (data.street || "").trim();
  if (!street) {
    errors.street = "House/flat no. and street are required";
  }

  const city = (data.city || "").trim();
  if (!city) {
    errors.city = "City is required";
  }

  const state = (data.state || "").trim();
  if (!state) {
    errors.state = "Please select a state";
  }

  const pincode = (data.pincode || "").replace(/\D/g, "");
  if (!pincode) {
    errors.pincode = "PIN code is required";
  } else if (pincode.length !== 6) {
    errors.pincode = "Enter a valid 6-digit PIN code";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

