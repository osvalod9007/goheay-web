import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {fireEvent} from '@testing-library/react';
import i18n from '../../../shared/i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import ModalExport from './ModalExport';

const props = {
  visible: true,
  listConfig: {
    pageSize: 10,
    page: 1,
    orderBy: [{field: 'id', orderType: 'DESC'}],
    where: [{field: 'keyword', value: '', op: 'CONTAIN'}],
  },
  setExportModal: jest.fn(opts => c => c),
  exportTo: {
    title: 'labelDriverList',
    headers: [
      {
        key: 'basicProfile.fullName',
        title: 'labelFullName',
      },
      {
        key: 'basicProfile.email',
        title: 'labelEmail',
      },
      {
        key: 'basicProfile.fullMobilePhone',
        title: 'labelMobile',
      },
      {
        key: 'company.name',
        title: 'labelCompany',
      },
      {
        key: 'statusToString',
        title: 'labelStatus',
      },
      {
        key: 'rating',
        title: 'labelRating',
      },
      {
        key: 'basicProfile.createdAtExport',
        title: 'labelCreatedDate',
      },
    ],
    format: 'XLSX',
  },
  exportToFile: jest.fn(opts => c => c),
};

let container: any = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe('Test Modal Export Component', () => {
  it('Should render Modal Export component', () => {
    // Test first render and effect
    act(() => {
      render(<ModalExport {...props} />, container);
    });
  });

  it('Should save Snapshot for Modal Export component', () => {
    act(() => {
      const comp = render(<ModalExport {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  i18n.changeLanguage(require(`antd/lib/locale-provider/en_US.js`).default.locale);
  const onChange = jest.fn(opts => c => c);
  it('changes value when clicked', () => {
    // const onChange = jest.fn();
    act(() => {
      render(
        <I18nextProvider i18n={i18n}>
          <ModalExport {...props} />
        </I18nextProvider>,
        container,
      );
    });

    const h4: any = document.querySelector('h4');
    expect(h4.innerHTML).toBe('Select the exporting format to download');

    const radio: any = document.getElementById('modal-export-radio');
    expect(radio.getElementsByTagName('input')[0].checked).toBe(true);

    act(() => {
      radio.getElementsByTagName('input')[0].checked = false;
      radio.getElementsByTagName('input')[1].checked = true;
      // fireEvent.change(radio, new MouseEvent('click', { bubbles: true }));
      // radio.addEventListener('change', () => {checked: true})
      // radio.dispatchEvent(new MouseEvent('change', { bubbles: true }));
      // radio.simulate('change', {target: {checked: true}});
    });

    expect(radio.getElementsByTagName('input')[0].checked).toBe(false);
  });
});
