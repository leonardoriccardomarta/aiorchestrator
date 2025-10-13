import { UseFormRegister, FieldErrors } from 'react-hook-form';

export interface OnboardingFormData {
  companyName: string;
  industry: string;
  size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+';
  website: string;
  primaryGoal: 'customer_support' | 'sales_automation' | 'lead_generation' | 'product_recommendations' | 'other';
  expectedVolume: 'low' | 'medium' | 'high';
  currentSolution?: string;
}

export interface StepProps {
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}