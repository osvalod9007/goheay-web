import React from 'react';

type PaginateInfoProps = {
  page: number;
  pageSize: number;
  count: number;
};

const PaginateInfo: React.FC<PaginateInfoProps> = (props: PaginateInfoProps) => {
  const {page, pageSize, count} = props;
  const cantOfPages = Math.ceil(count / pageSize);
  return (
    <span>
      Showing {(page - 1) * pageSize + 1} to{' '}
      {(cantOfPages === page ? count % pageSize || pageSize : pageSize) + (page - 1) * pageSize} of {count} entries
    </span>
  );
};

export default PaginateInfo;
