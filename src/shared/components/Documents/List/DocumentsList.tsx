import React, {useContext, useEffect, useState} from 'react';
import {Card, Col, Button, Divider, Icon, Row, Table, Tag, Tooltip} from 'antd';
import {useTranslation} from 'react-i18next';
import {useRouter} from 'rift-router';
import {observer} from 'mobx-react-lite';

import HeadTitle from '../../HeadTitle/HeadTitle';
import AppStore from '../../../stores/App.store';
import DocumentsStore from '../../../stores/documents.store';
import driverModel from '../../../models/Driver.model';
import vehicleModel from '../../../models/Vehicle.model';
import {DocumentStatusEnum} from '../../../enums/DocumentStatus.enum';
import {DocumentTypeEnum} from '../../../enums/DocumentType.enum';

import './DocumentsList.less';

import DocumentsView from '../View/DocumentsView';
import DocumentsUpdate from '../Update/DocumentsUpdate';

const DocumentList: React.FC = observer(() => {
  const appStore = useContext(AppStore);
  const documentsStore = useContext(DocumentsStore);
  const {t} = useTranslation('app');
  const [mappedData, setMappedData] = useState([]);
  const router = useRouter();
  const [title, setTitle] = useState('');

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [documentsStore.isUpdateList]);

  const getData = async () => {
    try {
      appStore.setIsLoading(true);
      if (router && router.params && router.params.id && router.params.type) {
        appStore.setIsEditing(true);
        const input = {
          id: router.params.id,
        };
        const typeOfDoc = router.params.type === 'driver';
        const typeModel: any = typeOfDoc ? driverModel : vehicleModel;
        const typeGet: any = typeOfDoc ? 'DriverGet' : 'VehicleGet';
        const item: any = await typeModel.getDocuments(input);
        const {id: idParent, documents, basicProfile, vin} = item.data[typeGet];
        setTitle(typeOfDoc ? basicProfile.fullName : vin);
        documentsStore.setParentId(idParent);
        documentsStore.setParentType(typeOfDoc);
        let number = 0;
        const mappedDataTmp = documents.map(doc => {
          number += 1;
          const {id, type, status, ...file} = doc;
          return {
            id,
            key: number,
            type: type || '',
            status: status || '',
            url: typeOfDoc ? file.uploadFile.publicUrl : file.file.publicUrl,
          };
        });
        setMappedData(mappedDataTmp);
      }
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      // handleCatch(e, {}, {});
    }
  };

  const onCancelForm = () => {
    // change later for router.goBack..
    appStore.setIsEditing(false);
    // router.to(type ? '/admin/driver' : '/admin/vehicleinsurance');
    window.history.back();
  };

  const openViewDocument = (idDoc, url, status) => {
    documentsStore.setDocumentId(idDoc);
    documentsStore.setUrl(url);
    documentsStore.setStatusSelected(status);
    appStore.setIsOpenModalForm(true);
  };

  const openUpdateDocument = (idDoc, url) => {
    documentsStore.setDocumentId(idDoc);
    documentsStore.setUrl(url);
    documentsStore.setIsOpenModalUpdateForm(true);
  };

  const columns = [
    {
      title: t('labelNoDot'),
      dataIndex: 'key',
      width: '5%',
    },
    {
      title: t('labelDocumentType'),
      dataIndex: 'type',
      width: '17%',
      sorter: true,
      render: (item: any) => {
        switch (item) {
          case DocumentTypeEnum.TYPE_DRIVER_LICENCE_FRONT:
            return t('labelDriverLicense');
          case DocumentTypeEnum.TYPE_DRIVER_PHOTO:
            return t('labelDriverPhoto');
          case DocumentTypeEnum.TYPE_VEHICLE_REGISTRATION_STICKER:
            return t('labelVehicleRegistrationStickerTx');
          case DocumentTypeEnum.TYPE_INSURANCE_POLICY_PDF:
            return t('labelInsurancePolicyPDF');
          case DocumentTypeEnum.TYPE_VEHICLE_IMAGE:
            return t('labelVehicleImage');
          case DocumentTypeEnum.TYPE_VEHICLE_PHOTO:
            return t('labelVehicleImage');
          case DocumentTypeEnum.TYPE_INSURANCE_CERTIFICATE_PICTURE_FILE:
            return t('labelInsuranseCertificatePictureFile');
          case DocumentTypeEnum.TYPE_VEHICLE_IDENTIFICATION_NUMBER:
            return t('labelVehicleIndentificationNumberVIN');
          default:
            return t('labelVehicleRegistrationImage');
        }
      },
    },
    {
      title: t('labelStatus'),
      dataIndex: 'status',
      width: '11%',
      sorter: true,
      render: (item: any) => {
        switch (item) {
          case DocumentStatusEnum.STATUS_PENDING:
            return <Tag color="blue">{t('labelPending')}</Tag>;
          case DocumentStatusEnum.STATUS_ASSESSING:
            return <Tag color="orange">{t('labelAssessing')}</Tag>;
          case DocumentStatusEnum.STATUS_CLEAR:
            return <Tag color="green">{t('labelClear')}</Tag>;
          case DocumentStatusEnum.STATUS_DISAPPROVED:
            return <Tag color="red">{t('labelDisapproved')}</Tag>;
          default:
            return <Tag color="blue">{t('labelPending')}</Tag>;
        }
      },
    },
    {
      title: t('labelAction'),
      width: '10%',
      render: item => (
        <span>
          {appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN']) && (
            <Tooltip title={t('labelView')}>
              <Icon
                type="check-circle"
                style={{fontSize: '18px', marginRight: '5px'}}
                className="documents-list-table__pointer"
                theme="twoTone"
                twoToneColor="#0275d8"
                onClick={() => openViewDocument(item.id, item.url, item.status)}
              />
            </Tooltip>
          )}
          {appStore.hasPermissions(appStore.permissions, ['DocumentDriverUpdate']) && (
            <Tooltip title={t('labelUpload')}>
              <Icon
                type="upload"
                style={{fontSize: '18px', color: '#0275d8'}}
                className="documents-list-table__pointer"
                onClick={() => openUpdateDocument(item.id, item.url)}
              />
            </Tooltip>
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="documents-list-table">
      <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Card bordered={false} className="gutter-row">
            <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <HeadTitle icon={'file-text'} title={`${t('labelDocumentsList')} ${title}`} />
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}></Col>
            </Row>
            <Divider />
            <div style={{overflow: 'hidden', overflowX: 'auto'}} className="documents-list-table">
              <div style={{minWidth: 1070}}>
                <Table
                  className={'table'}
                  pagination={false}
                  columns={columns}
                  dataSource={mappedData}
                  size="middle"
                  locale={{
                    emptyText: <span>{`${t('msgThereAreNo')} ${t('labelDocuments')} ${t('msgToDisplay')}`}</span>,
                  }}
                />
              </div>
              <Button type="primary" className="documents-list-table__button-back" onClick={() => onCancelForm()}>
                {t('labelBack')}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      <DocumentsView />
      <DocumentsUpdate />
    </div>
  );
});

export default DocumentList;
