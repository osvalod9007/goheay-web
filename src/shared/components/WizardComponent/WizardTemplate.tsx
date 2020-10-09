import React, {useContext, useEffect} from 'react';
import {Card, Col, Divider, Row, Steps} from 'antd';
import {observer} from 'mobx-react-lite';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import WizardStore from '../../stores/Wizard.store';

import './WizardTemplate.less';

const WizardTemplate = observer((props: any) => {
    const wizardStore = useContext(WizardStore);
    const Step = Steps.Step;
    const {initSteps, isUseTitle, isUseSteps} = props;
    useEffect(() => {
        wizardStore.wizardSteps(initSteps);
    }, [initSteps, wizardStore]);

    return (
        <div className="wizard-template">
            {isUseTitle ? (
                    <Card bordered={false} className="gutter-row">
                        <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <HeadTitle icon={props.headIcon} title={props.headTitle}/>
                                <Divider/>
                            </Col>
                        </Row>
                        {wizardStore.steps && wizardStore.steps.length > 0 && (
                            <div>
                                {isUseSteps && (
                                    <Steps current={wizardStore.current} style={{marginBottom: '25px'}}>
                                        {wizardStore.steps.map(item => (
                                            <Step key={item.id} title={item.title}/>
                                        ))}
                                    </Steps>
                                )}
                                <div>{wizardStore.steps[wizardStore.current].content}</div>
                            </div>
                        )}
                    </Card>
                ) :
                wizardStore.steps && wizardStore.steps.length > 0 && (
                    <div>
                        {isUseSteps && (
                            <Steps current={wizardStore.current} style={{marginBottom: '25px'}}>
                                {wizardStore.steps.map(item => (
                                    <Step key={item.id} title={item.title}/>
                                ))}
                            </Steps>
                        )}
                        <div>{wizardStore.steps[wizardStore.current].content}</div>
                    </div>
                )
            }
        </div>
    );
});

export default WizardTemplate;
