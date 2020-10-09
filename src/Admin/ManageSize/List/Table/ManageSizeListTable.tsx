import React, {useContext, useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import gql from 'graphql-tag';
import {Icon, Table, Tooltip, Pagination, Row, Col} from 'antd';
import {RiftLink} from 'rift-router';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-apollo-hooks';

import AppStore from '../../../../shared/stores/App.store';
import SizeStore from '../../../../shared/stores/Size.store';
import PaginateInfo from '../../../../shared/components/PaginateInfo/PaginateInfo';

import './ManageSizeListTable.less';
import {SizeEnum} from '../../../../shared/enums/Size.enum';

const GET_LIST = gql`
  query($input: GenericFilterInput) {
    ProductSizeList(input: $input) {
      total
      items {
        id
        labelSize {
          type
        }
        measureLwh {
          amount(unit: inches)
        }
        lwhLargerThanEqual
        measureWeightMin {
          amount(unit: pounds)
        }
        measureWeightMax {
          amount(unit: pounds)
        }
        measureTotalLinearMin {
          amount(unit: inches)
        }
        measureTotalLinearMax {
          amount(unit: inches)
        }
        measureLabourLoadingSingle {
          amount(unit: minutes)
        }
        measureLabourLoadingMultiple {
          amount(unit: minutes)
        }
        measureLabourUnloadingSingle {
          amount(unit: minutes)
        }
        measureLabourUnloadingMultiple {
          amount(unit: minutes)
        }
      }
    }
  }
`;
const ManageSizeListTable = observer((props: any) => {
  const appStore = useContext(AppStore);
  const sizeStore = useContext(SizeStore);
  const {t} = useTranslation('app');
  const [mappedData, setMappedData] = useState([]);
  const [count, setCount] = useState(0);
  const {pageSize, page, orderBy} = props.input;
  orderBy[0].orderType = 'ASC';

  const {data, error, loading, refetch} = useQuery(GET_LIST, {
    suspend: false,
    variables: {
      input: {
        page,
        pageSize,
        order: orderBy,
      },
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    appStore.setIsLoading(true);
    const onCompleted = result => {
      appStore.setIsLoading(false);
      const {items, total} = result.ProductSizeList;
      let number = (page - 1) * pageSize;
      const mappedDataTmp = items.map(item => {
        number += 1;
        const {
          id,
          labelSize,
          measureLwh,
          lwhLargerThanEqual,
          measureWeightMin,
          measureWeightMax,
          measureTotalLinearMin,
          measureTotalLinearMax,
          measureLabourLoadingSingle,
          measureLabourLoadingMultiple,
          measureLabourUnloadingSingle,
          measureLabourUnloadingMultiple,
        } = item;
        return {
          id,
          key: number,
          type: labelSize.type,
          weightMin: measureWeightMin.amount,
          weightMax: measureWeightMax.amount,
          lwhValue: measureLwh.amount,
          lwhLargerThanEqual,
          totalLinearInchesMin: measureTotalLinearMin.amount,
          totalLinearInchesMax: measureTotalLinearMax.amount,
          labourLoadingSingleMinute: measureLabourLoadingSingle.amount,
          labourLoadingMultipleMinute: measureLabourLoadingMultiple.amount,
          labourUnloadingSingleMinute: measureLabourUnloadingSingle.amount,
          labourUnloadingMultipleMinute: measureLabourUnloadingMultiple.amount,
          labelSize,
          measureLwh,
          measureWeightMin,
          measureWeightMax,
          measureTotalLinearMin,
          measureTotalLinearMax,
          measureLabourLoadingSingle,
          measureLabourLoadingMultiple,
          measureLabourUnloadingSingle,
          measureLabourUnloadingMultiple,
        };
      });
      sizeStore.setItemsSize(mappedDataTmp);
      setMappedData(mappedDataTmp);
      setCount(total);
      props.updateCountList(total);
    };

    const onError = paramError => {
      appStore.setIsLoading(false);
      return <div>{paramError}</div>;
    };

    if (onCompleted || onError) {
      if (onCompleted && !loading && !error) {
        onCompleted(data);
      } else if (onError && !loading && error) {
        onError(error);
      }
    }
  }, [loading, data, error]);

  // to re-fetch data
  const reFetchData = () => {
    refetch({
      input: {
        page,
        pageSize,
        order: orderBy,
      },
    });
  };

  useEffect(() => {
    reFetchData();
  }, [props.input]);

  const showSingleMultiple2LinesTo = (item, action) => {
    if (item) {
      let single;
      let multiple;
      switch (action) {
        case 'loading':
          single = item.labourLoadingSingleMinute;
          multiple = item.labourLoadingMultipleMinute;
          break;
        case 'unloading':
          single = item.labourUnloadingSingleMinute;
          multiple = item.labourUnloadingMultipleMinute;
          break;
        case 'total':
          single = item.labourLoadingSingleMinute + item.labourUnloadingSingleMinute;
          multiple = item.labourLoadingMultipleMinute + item.labourUnloadingMultipleMinute;
          break;
        default:
          single = 0;
          multiple = 0;
          break;
      }
      return (
        <div
          style={{
            alignItems: 'left',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>Single: {single}</span>
          <span>Multiple: {multiple}</span>
        </div>
      );
    } else {
      return '';
    }
  };
  const showRangeLinearInchesLbs = item => {
    if (item && item.totalLinearInchesMax) {
      const start = item.totalLinearInchesMin || 0;
      const end = item.totalLinearInchesMax;
      return (
        <div
          style={{
            alignItems: 'left',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>
            <span>
              {parseFloat((Math.round(start * 100) / 100).toString()).toFixed(2)} -{' '}
              {parseFloat((Math.round(end * 100) / 100).toString()).toFixed(2)}
            </span>
          </span>
        </div>
      );
    } else {
      return '';
    }
  };
  const showRangeWeightLbs = item => {
    if (item && item.weightMax) {
      const start = item.weightMin || 0;
      const end = item.weightMax;
      return (
        <div
          style={{
            alignItems: 'left',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <span>
            {parseFloat((Math.round(start * 100) / 100).toString()).toFixed(2)} -{' '}
            {parseFloat((Math.round(end * 100) / 100).toString()).toFixed(2)}
          </span>
        </div>
      );
    } else {
      return '';
    }
  };
  const columns = [
    {
      title: t('labelKeyKeywordSizes'),
      width: '5%',
      render: item => {
        switch (item.type) {
          case SizeEnum.TYPE_SMALL:
            return <span style={{marginBottom: 0}}>S</span>;
          case SizeEnum.TYPE_MEDIUM:
            return <span style={{marginBottom: 0}}>M</span>;
          case SizeEnum.TYPE_LARGE:
            return <span style={{marginBottom: 0}}>L</span>;
          case SizeEnum.TYPE_HUGE:
            return <span style={{marginBottom: 0}}>H</span>;
          default:
            return <span style={{marginBottom: 0}}></span>;
        }
      },
    },
    {
      title: t('labelWeight'),
      width: '8%',
      render: item => showRangeWeightLbs(item),
    },
    {
      title: t('labelLinearInchesSum'),
      width: '10%',
      render: item => showRangeLinearInchesLbs(item),
    },
    {
      title: t('labelLWHInches'),
      width: '10%',
      render: item => {
        if (item && item.lwhValue) {
          return (
            <div
              style={{
                alignItems: 'left',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span>
                {item.lwhLargerThanEqual ? '>=' : '<='}{' '}
                {parseFloat((Math.round(item.lwhValue * 100) / 100).toString()).toFixed(2)}
              </span>
            </div>
          );
        } else {
          return '';
        }
      },
    },
    {
      title: t('labelEstimateLaborMinuteLoading'),
      width: '10%',
      render: item => showSingleMultiple2LinesTo(item, 'loading'),
    },
    {
      title: t('labelEstimateLaborMinuteUnLoading'),
      width: '10%',
      render: item => showSingleMultiple2LinesTo(item, 'unloading'),
    },
    {
      title: t('labelTotalEstimateLaborMinutePerDelivery'),
      width: '10%',
      render: item => showSingleMultiple2LinesTo(item, 'total'),
    },
    {
      title: t('labelAction'),
      width: '5%',
      render: item => (
        <span>
          {appStore.hasPermissions(appStore.permissions, ['ProductSizeUpdate']) && (
            <React.Fragment>
              <RiftLink to={`/admin/size/${item.id}`} className="manage-size-list-table__pointer">
                <Tooltip title={t('labelEdit')}>
                  <Icon type="edit" style={{fontSize: '18px'}} theme="twoTone" twoToneColor="#0275d8" />
                </Tooltip>
              </RiftLink>
            </React.Fragment>
          )}
        </span>
      ),
    },
  ];

  const onPageChange = newPage => {
    props.updateConfig({page: newPage});
  };

  return (
    <div style={{overflow: 'hidden', overflowX: 'auto'}} className="manage-size-list-table">
      <div style={{minWidth: 1070}}>
        <Table
          className={'table'}
          pagination={false}
          columns={columns}
          dataSource={mappedData}
          size="middle"
          locale={{emptyText: <span>{`${t('msgThereAreNo')} ${t('labelManageSizes')} ${t('msgToDisplay')}.`}</span>}}
        />
        <Row type="flex" justify="start" align="top" style={{marginBottom: 10}}>
          <Col xs={24} sm={24} md={12} lg={16} xl={16} className="manage-size-list-table__pagination-info">
            {count > 0 ? <PaginateInfo page={page} pageSize={pageSize} count={count} /> : null}
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            {count > pageSize ? (
              <Pagination
                className="ant-table-pagination"
                total={count}
                current={page}
                pageSize={pageSize}
                onChange={onPageChange}
              />
            ) : null}
          </Col>
        </Row>
      </div>
    </div>
  );
});

export default ManageSizeListTable;
