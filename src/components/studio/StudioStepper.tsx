import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

export interface StepConfig {
  id: number;
  label: string;
  isValid: boolean;
}

interface StudioStepperProps {
  steps: StepConfig[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

const StudioStepper: React.FC<StudioStepperProps> = ({
  steps,
  currentStep,
  onStepChange,
}) => {
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const currentStepElement = stepRefs.current[currentStep];
    if (currentStepElement) {
      currentStepElement.focus();
    }
  }, [currentStep]);

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      onStepChange(stepIndex);
    } else if (stepIndex === currentStep + 1) {
      const currentStepConfig = steps[currentStep];
      if (currentStepConfig.isValid) {
        onStepChange(stepIndex);
      }
    }
  };

  const getStepStatus = (stepIndex: number): 'completed' | 'active' | 'upcoming' | 'blocked' => {
    if (stepIndex < currentStep) {
      return 'completed';
    } else if (stepIndex === currentStep) {
      return 'active';
    } else if (stepIndex === currentStep + 1 && steps[currentStep].isValid) {
      return 'upcoming';
    } else {
      return 'blocked';
    }
  };

  return (
    <nav aria-label="Studio workflow steps" className="w-full">
      <ol className="flex items-center justify-center space-x-2">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isClickable = status === 'completed' || (status === 'upcoming' && index === currentStep + 1);
          const isCurrent = status === 'active';

          return (
            <li key={step.id} className="flex items-center">
              <button
                ref={(el) => (stepRefs.current[index] = el)}
                onClick={() => handleStepClick(index)}
                disabled={!isClickable && !isCurrent}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${step.id}: ${step.label}`}
                className={`group flex items-center ${
                  !isClickable && !isCurrent ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                      status === 'completed'
                        ? 'border-green-600 bg-green-600 text-white'
                        : status === 'active'
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : status === 'upcoming'
                        ? 'border-gray-300 bg-white text-gray-500 group-hover:border-blue-400'
                        : 'border-gray-200 bg-gray-100 text-gray-400'
                    }`}
                  >
                    {status === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`ml-3 text-sm font-medium ${
                      status === 'active'
                        ? 'text-blue-600'
                        : status === 'completed'
                        ? 'text-gray-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`mx-4 h-0.5 w-16 transition-colors duration-200 ${
                    index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Step {currentStep + 1} of {steps.length}: {steps[currentStep].label}
      </div>
    </nav>
  );
};

export default StudioStepper;
