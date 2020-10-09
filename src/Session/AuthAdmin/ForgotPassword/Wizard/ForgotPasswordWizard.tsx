import React from 'react';

import WizardTemplate from '../../../../shared/components/WizardComponent/WizardTemplate';
import StepOneForgotForm from './StepOne/StepOneForgotForm';
import StepTwoForgotForm from './StepTwo/StepTwoForgotForm';
import {observer} from 'mobx-react-lite';

const ForgotPasswordWizard: React.FC = observer(() => {
  const initSteps = [
    {
      id: 1,
      title: '',
      content: <StepOneForgotForm />,
    },
    {
      id: 2,
      title: '',
      content: <StepTwoForgotForm />,
    },
  ];
  return <WizardTemplate initSteps={initSteps} isUseSteps={false} isUseTitle={false} />;
});

export default ForgotPasswordWizard;
