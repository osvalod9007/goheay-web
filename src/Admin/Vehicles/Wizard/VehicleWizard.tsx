import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import {useRouter} from 'rift-router';

import AppStore from '../../../shared/stores/App.store';
import StepOneForm from './StepOne/StepOneForm';
import StepTwoForm from './StepTwo/StepTwoForm';
import StepThreeForm from './StepThree/StepThreeForm';
import WizardTemplate from '../../../shared/components/WizardComponent/WizardTemplate';

const VehicleWizard = observer(props => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [headTitle, setHeadTitle] = useState(t('labelAddVehicle'));
  const headIcon = useState('car');
  const router = useRouter();
  const initSteps = [
    {
      id: 1,
      title: t('labelVehicleInfo'),
      content: <StepOneForm />,
    },
    {
      id: 2,
      title: t('labelVehicleFeatures'),
      content: <StepTwoForm />,
    },
    {
      id: 3,
      title: t('labelDrivingRequirements'),
      content: <StepThreeForm />,
    },
  ];

  useEffect(() => {
    getData();
    return () => {
      appStore.setIsLoading(false);
      appStore.setIsEditing(false);
    };
  }, []);

  const getData = () => {
    try {
      const params: any = router;
      if (params && params.params && params.params.vehicleId) {
        appStore.setIsEditing(true);
        setHeadTitle(t('labelEditVehicle'));
      }
    } catch (e) {
      // console.log(e);
    }
  };
  return (
    <WizardTemplate
      initSteps={initSteps}
      headTitle={headTitle}
      headIcon={headIcon}
      isUseSteps={true}
      isUseTitle={true}
    />
  );
});
export default VehicleWizard;
