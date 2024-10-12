import { useEffect, useState } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import { ExpandableConfig } from "antd/es/table/interface";

export type UITableProps = {
  columns: TableColumnsType;
  fetchData: ({
    variables,
  }: {
    variables: { skip?: number; take?: number };
  }) => void;
  data?: any & { key: string }[];
  loading?: boolean;
  total?: number;
  expandable?: ExpandableConfig<any>;
};

const UITable: React.FC<UITableProps> = ({
  columns,
  data,
  loading,
  total,
  fetchData,
  expandable,
}) => {
  const take = 10;
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleTableChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setSkip((page - 1) * pageSize);
  };

  useEffect(() => {
    fetchData({
      variables: {
        skip,
        take,
      },
    });
  }, [take, skip, fetchData]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <Table
      columns={columns}
      dataSource={data}
      scroll={{ x: 600 }}
      expandable={expandable}
      pagination={{
        current: currentPage,
        pageSize: take,
        total: total ?? 0,
        onChange: handleTableChange,
      }}
    />
  );
};

export default UITable;
