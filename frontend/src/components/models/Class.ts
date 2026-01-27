export interface Class {
  id: number;
  name: string;
  stream: string;
  level: string;
  teacher: string;
  rating: number;
  enrolled: number;
  price: number;
  paid: boolean;
  duration: string;
  description: string;
  topics: string[];
  examDate: string;
  classType: string;
}

export interface CardDetails {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

export interface BankDetails {
  accountNumber: string;
  bankName: string;
  branch: string;
}

export interface MobileDetails {
  provider: string;
  mobileNumber: string;
  pin: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export interface MobileProvider {
  id: string;
  name: string;
}