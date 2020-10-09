import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Elements, StripeProvider, injectStripe} from 'react-stripe-elements';
import {notification, Spin} from 'antd';
import './StripeHOC.less';
const apiKey = `${process.env.REACT_APP_STRIPE_APIKEY}`;
const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};
const StripeHOC = (WrappedComponent: any) => {
  const {t} = useTranslation('app');
  const InjectedStriped = injectStripe(WrappedComponent);
  const StripeWrapper = (props): JSX.Element => {
    const [gatewayKey, setGatewayKey] = useState('');
    const initStripe = () => {
      setGatewayKey(apiKey);
    };
    useEffect(() => {
      if (!document.getElementById(`stripe-js`)) {
        const script = document.createElement(`script`);
        script.type = `text/javascript`;
        script.id = 'stripe-js';
        script.src = `https://js.stripe.com/v3/`;
        script.async = true;
        const headScript = document.getElementsByTagName(`script`)[0];
        (headScript as any).parentNode.insertBefore(script, headScript);
        script.addEventListener(`load`, initStripe);
      }
      if (!document.getElementById(`stripe-js`)) {
        openNotificationWithIcon('error', t('labelErrorStripe'), t('errorMsgStripeServices'));
        return;
      }
      setGatewayKey(apiKey);
    }, [gatewayKey]);
    return (
      <>
        {gatewayKey ? (
          <StripeProvider apiKey={gatewayKey}>
            <Elements locale="en">
              <InjectedStriped {...props} />
            </Elements>
          </StripeProvider>
        ) : (
          <Spin />
        )}
      </>
    );
  };

  return StripeWrapper;
};
export default StripeHOC;
