import Layout from "../../components/Layout";
import { Flex, Table, type TableColumnsType } from "antd";
import { useLazyQuery, gql } from "@apollo/client";
import UITable from "../../components/UITable";
import formatDate from "../../utils/formatDate";
import { CheckCircleTwoTone } from "@ant-design/icons";
import Decimal from "decimal.js";

const calculatePercentageDifference = (first: string, second?: string) => {
  if (!second) {
    return "0.00%";
  }
  const firstValue = new Decimal(first);
  const secondValue = new Decimal(second);

  const formula = (bigger: Decimal, smaller: Decimal) =>
    bigger.minus(smaller).dividedBy(smaller).times(100).toFixed(2);

  switch (true) {
    case firstValue.equals(secondValue):
      return "0.00%";
    case firstValue.lessThan(secondValue):
      return `-${formula(secondValue, firstValue)}%`;
    case secondValue.lessThan(firstValue):
      return `${formula(firstValue, secondValue)}%`;
  }
};

const columns: TableColumnsType = [
  {
    title: "Chain",
    key: "chain",
    render: (value) => (
      <Flex gap={8}>
        <img
          src={value.asset.logo}
          width={24}
          height={24}
          alt="logo"
          style={{ borderRadius: "50%" }}
        />
        {value.asset.name} - {value.informator.userName} -{" "}
        {formatDate(value.createdAt)}
      </Flex>
    ),
  },
  {
    title: "On going",
    key: "onGoing",
    render: (value) => <Flex>{!value.endAt && "ONGOING"}</Flex>,
  },
  {
    title: "Trusted",
    key: "isTrusted",
    render: (value) => (
      <Flex>
        {value.informator.isTrusted && (
          <CheckCircleTwoTone twoToneColor="#52c41a" />
        )}
      </Flex>
    ),
  },
];

const expendedColumns: TableColumnsType = [
  {
    title: "Price",
    width: 100,
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Liquidity",
    width: 100,
    dataIndex: "liquidity",
    key: "liquidity",
  },
  {
    title: "Trend",
    width: 100,
    key: "trend",
    render: (value) => {
      return (
        <div>{calculatePercentageDifference(value.price, value.prevPrice)}</div>
      );
    },
  },
  {
    title: "Created at",
    width: 100,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value) => formatDate(value),
  },
];

const findManySnapshotChainsQuery = gql`
  query findManySnapshotChains($take: Int, $skip: Int) {
    findManySnapshotChains(take: $take, skip: $skip) {
      snapshotChains {
        id
        endAt
        createdAt
        snapshots {
          id
          price
          liquidity
          createdAt
        }
        asset {
          address
          name
          logo
        }
        informator {
          id
          userName
          isTrusted
        }
      }
      meta {
        total
      }
    }
  }
`;

const SnapshotsPage: React.FC = () => {
  const [fetchData, { data, loading }] = useLazyQuery(
    findManySnapshotChainsQuery
  );

  const expandedRowRender = (value: any) => {
    return (
      <Table
        columns={expendedColumns}
        dataSource={
          value?.snapshots
            ? value.snapshots.map((s: any, index: number, arr: any[]) => ({
                ...s,
                key: s.id,
                prevPrice: arr[index + 1]?.price,
              }))
            : []
        }
      />
    );
  };

  return (
    <Layout>
      <UITable
        columns={columns}
        data={
          data?.findManySnapshotChains?.snapshotChains?.length
            ? data.findManySnapshotChains.snapshotChains.map(
                (snapshotChain: any) => ({
                  ...snapshotChain,
                  key: snapshotChain.id,
                })
              )
            : []
        }
        loading={loading}
        fetchData={fetchData}
        total={data?.findManySnapshotChains?.meta.total}
        expandable={{
          expandedRowRender,
        }}
      />
    </Layout>
  );
};

export default SnapshotsPage;
