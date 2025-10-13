import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { useAnimation } from '../../contexts/AnimationContextHooks';

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.FC<{ onNext: () => void; onBack: () => void }>;
}

interface OnboardingWizardProps {
  steps: Step[];
  onComplete: () => void;
  onSkip?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  steps,
  onComplete,
  onSkip,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const { getAnimationVariant } = useAnimation();

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    setCompletedSteps(new Set([...completedSteps, currentStep.id]));
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        variants={getAnimationVariant('scale')}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{currentStep.title}</CardTitle>
              {onSkip && (
                <Button variant="ghost" onClick={onSkip}>
                  Skip Tutorial
                </Button>
              )}
            </div>
            <div className="flex items-center mt-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      completedSteps.has(step.id)
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : index === currentStepIndex
                        ? 'border-primary-500 text-primary-500'
                        : 'border-gray-300 text-gray-300'
                    }`}
                  >
                    {completedSteps.has(step.id) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-1 ${
                        completedSteps.has(step.id)
                          ? 'bg-primary-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p className="text-gray-500 dark:text-gray-400">
                {currentStep.description}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                variants={getAnimationVariant('fade')}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <currentStep.component onNext={handleNext} onBack={handleBack} />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isFirstStep}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {isLastStep ? 'Complete' : 'Next'}
                {!isLastStep && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 