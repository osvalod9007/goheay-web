import React, {useState} from 'react';
import {Modal, Radio, Spin} from 'antd';
import {useTranslation} from 'react-i18next';

import openNotificationWithIcon from '../OpenNotificationWithIcon/OpenNotificationWithIcon';

type ExportProps = {
  visible: boolean;
  listConfig: any;
  setExportModal: (data: boolean) => void;
  exportTo: any;
  exportToFile: (data: any) => void;
};

const ModalExport = (props: ExportProps) => {
  const {t} = useTranslation('app');
  const RadioGroup = Radio.Group;
  const [exportModal, setExportModal] = useState({
    visible: props.visible,
    format: 'XLSX',
  });
  const [isLoading, setIsLoading] = useState(false);

  const exportFile = async () => {
    try {
      setIsLoading(true);
      const {format} = exportModal;
      const {page, where, orderBy} = props.listConfig;
      const filter: any = [];
      if (where && where[0].value !== '') {
        filter.push(where[0]);
      }
      if (where && where[1]) {
        filter.push(where[1]);
      }
      // const keywordIncluded = where[0].value !== '' ? true : false;
      const headers = props.exportTo.headers.map(e => {
        return {
          key: e.key,
          title: t(`${e.title}`),
        };
      });
      const exp = {...props.exportTo, ...{format, title: t(`${props.exportTo.title}`), headers}};
      const input = {
        page: 0,
        pageSize: 0,
        order: orderBy,
        export: exp,
        where: filter,
        // ...(keywordIncluded && {where}),
      };
      const url = await props.exportToFile(input);
      setTimeout(() => {
        const response: any = {
          file: url,
        };
        // server sent the url to the file!
        // now, let's download:
        window.open(response.file, '_blank');
        // you could also do:
        // window.location.href = response.file;
      }, 100);
      setIsLoading(false);
      props.setExportModal(false);
      openNotificationWithIcon('success', t('msgFileDownloadSuccess'), '');
    } catch (e) {
      openNotificationWithIcon('error', t('msgFileDownloadFailed'), '');
    }
  };

  return (
    <div className="modal-export">
      <Modal
        title={`${t('labelExport')}`}
        visible={props.visible}
        onCancel={() => props.setExportModal(false)}
        onOk={exportFile}
        okText={t('labelOk')}
        cancelText={t('labelCancel')}
        okButtonProps={{disabled: isLoading}}
        cancelButtonProps={{disabled: isLoading}}
      >
        <Spin spinning={isLoading} size="large">
          <h4>{`${t('msgSelectToExport')}`}</h4>
          <div>
            <span style={{marginRight: 15}}> {t('labelType')}:</span>
            <RadioGroup
              onChange={e => setExportModal({...exportModal, ...{format: e.target.value}})}
              value={exportModal.format}
              id={'modal-export-radio'}
            >
              <Radio value="XLSX">xlsx</Radio>
              <Radio value="PDF">pdf</Radio>
            </RadioGroup>
          </div>
        </Spin>
      </Modal>
    </div>
  );
};

export default ModalExport;
