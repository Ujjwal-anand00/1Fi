import type { ImageSourcePropType } from 'react-native';

export type ProductImage = {
  type?: 'placeholder' | 'uri' | 'asset';
  label?: string;
  backgroundColor?: string;
  uri?: string;
  source?: ImageSourcePropType;
};

export type ProductVariant = {
  id: string;
  type: string;
  label: string;
  value: string;
  available: boolean;
  price: number;
  configuration?: string;
  color?: string;
};

export type EmiPlan = {
  id: string;
  durationMonths: number;
  tenure?: number;
  monthlyAmount: number;
  totalAmount: number;
  totalPayable?: number;
  interestRate: number;
  processingFee: number;
  available: boolean;
  isNoCost?: boolean;
};

export type ProductSpecification = {
  key: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  image: ProductImage;
  price: number;
  category: string;
  variants: ProductVariant[];
  emiPlans: EmiPlan[];
  details: string[];
  specifications?: ProductSpecification[];
};
