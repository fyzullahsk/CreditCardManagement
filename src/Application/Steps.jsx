import React, { useState } from 'react';

export default function Steps({ children }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <div>
      {React.cloneElement(children[currentStep], { onNext: handleNext })}
    </div>
  );
}
