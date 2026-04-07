export type PreQualifyFormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  annualPersonalIncome: string;
  annualHouseholdIncome: string;
  creditScoreRange: string;
  hasExistingBusiness: string;
  businessName: string;
  businessType: string;
  yearsInBusiness: string;
  monthlyRevenueRange: string;
  consentSoftPull: boolean;
  consentSms: boolean;
  consentAgree: boolean;
};

export const initialPreQualifyForm: PreQualifyFormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  streetAddress: "",
  city: "",
  state: "",
  country: "United States",
  postalCode: "",
  annualPersonalIncome: "",
  annualHouseholdIncome: "",
  creditScoreRange: "",
  hasExistingBusiness: "",
  businessName: "",
  businessType: "",
  yearsInBusiness: "",
  monthlyRevenueRange: "",
  consentSoftPull: false,
  consentSms: false,
  consentAgree: false,
};
