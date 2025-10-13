import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { completeOnboarding } from '../../services/onboarding';
import { onboardingSteps } from './constants';
import { StepProps, OnboardingFormData } from './types';

// Define the form schema
const onboardingSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  industry: z.string().min(1, 'Industry is required'),
  size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']),
  website: z.string().url('Please enter a valid website URL'),
  primaryGoal: z.enum(['customer_support', 'sales_automation', 'lead_generation', 'product_recommendations', 'other']),
  expectedVolume: z.enum(['low', 'medium', 'high']),
  currentSolution: z.string().optional()
});

const OnboardingFlow: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema) as any,
    mode: 'onChange'
  });

  const { mutate: submitOnboarding, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Onboarding submission failed:', error);
    }
  });

  const onSubmit = (data: OnboardingFormData) => {
    submitOnboarding(data);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto pt-16 pb-24 px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.title}
                className={`flex items-center ${
                  index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="hidden sm:block ml-2">{step.title}</div>
              </div>
            ))}
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full bg-gray-200 h-1">
                <div
                  className="bg-blue-600 h-1 transition-all duration-500"
                  style={{ width: `${(currentStep / (onboardingSteps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            <div className="bg-white rounded-xl shadow-xl p-8">
              <h2 className="text-2xl font-bold mb-2">{onboardingSteps[currentStep].title}</h2>
              <p className="text-gray-600 mb-8">{onboardingSteps[currentStep].description}</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {currentStep === 0 && (
                  <WelcomeStep />
                )}

                {currentStep === 1 && (
                  <CompanyStep register={register} errors={errors} />
                )}

                {currentStep === 2 && (
                  <UseCaseStep register={register} errors={errors} />
                )}

                {currentStep === 3 && (
                  <IntegrationStep register={register} errors={errors} />
                )}

                {currentStep === 4 && (
                  <CustomizationStep register={register} errors={errors} />
                )}

                <div className="flex justify-between pt-6">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className={`px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 ${
                      currentStep === 0 ? 'invisible' : ''
                    }`}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {currentStep === onboardingSteps.length - 1 ? 'Complete Setup' : 'Continue'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const WelcomeStep: FC = () => (
  <div className="text-center">
    <img
      src="/onboarding/welcome.svg"
      alt="Welcome"
      className="w-64 mx-auto mb-8"
    />
    <p className="text-lg text-gray-600">
      We're excited to have you here! Let's get your AI assistant set up and ready to help your customers.
    </p>
  </div>
);

const CompanyStep: FC<StepProps> = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Company Name</label>
      <input
        {...register('companyName')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {errors.companyName && (
        <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
      )}
    </div>
    {/* Add other company fields */}
  </div>
);

const UseCaseStep: FC<StepProps> = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Primary Goal</label>
      <select
        {...register('primaryGoal')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="customer_support">Customer Support Automation</option>
        <option value="sales_automation">Sales Automation</option>
        <option value="lead_generation">Lead Generation</option>
        <option value="product_recommendations">Product Recommendations</option>
        <option value="other">Other</option>
      </select>
      {errors.primaryGoal && (
        <p className="mt-1 text-sm text-red-600">{errors.primaryGoal.message}</p>
      )}
    </div>
    {/* Add other use case fields */}
  </div>
);

const IntegrationStep: FC<StepProps> = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Website URL</label>
      <input
        {...register('website')}
        type="url"
        placeholder="https://yourstore.com"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      />
      {errors.website && (
        <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
      )}
    </div>
    {/* Add other integration fields */}
  </div>
);

const CustomizationStep: FC<StepProps> = ({ register, errors }) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Expected Volume</label>
      <select
        {...register('expectedVolume')}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        <option value="low">Low (1-100 conversations/month)</option>
        <option value="medium">Medium (100-1000 conversations/month)</option>
        <option value="high">High (1000+ conversations/month)</option>
      </select>
      {errors.expectedVolume && (
        <p className="mt-1 text-sm text-red-600">{errors.expectedVolume.message}</p>
      )}
    </div>
    {/* Add other customization fields */}
  </div>
);

export default OnboardingFlow; 