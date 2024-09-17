import Layout from "../../components/Layout";
import { Flex, type TableColumnsType } from "antd";
import { useLazyQuery, gql } from "@apollo/client";
import UITable from "../../components/UITable";
import formatDate from "../../utils/formatDate";
import Decimal from "decimal.js";

const columns: TableColumnsType = [
  {
    title: "Asset",
    width: 100,
    dataIndex: "asset",
    key: "asset",
    fixed: "left",
    render: (value) => (
      <Flex gap={8}>
        <img
          src={value.logo}
          width={24}
          height={24}
          alt="logo"
          style={{ borderRadius: "50%" }}
        />
        {value.name}
      </Flex>
    ),
  },
  {
    title: "Profit",
    width: 100,
    key: "profit",
    render: (value) => {
      if (!value.sellTransaction) {
        return <></>;
      }

      const sellPrice = new Decimal(value.sellTransaction.snapshot.price);
      const buyPrice = new Decimal(value.buyTransaction.snapshot.price);

      return (
        <div
          style={{
            color: "green",
            fontWeight: "bold",
          }}
        >
          {sellPrice.minus(buyPrice).toString()}
        </div>
      );
    },
  },
  {
    title: "Buy price",
    width: 100,
    dataIndex: "buyTransaction",
    key: "buyPrice",
    render: (value) => value.snapshot.price,
  },
  {
    title: "Buy date",
    width: 100,
    dataIndex: "buyTransaction",
    key: "buyDate",
    render: (value) => formatDate(value.createdAt),
  },
  {
    title: "Sell price",
    width: 100,
    dataIndex: "sellTransaction",
    key: "sellPrice",
    render: (value) => value?.snapshot?.price,
  },
  {
    title: "Sell date",
    width: 100,
    dataIndex: "sellTransaction",
    key: "sellDate",
    render: (value) => (value?.createdAt ? formatDate(value?.createdAt) : ""),
  },
];

const findManyTradesQuery = gql`
  query findManyTrades($take: Int, $skip: Int) {
    findManyTrades(take: $take, skip: $skip) {
      trades {
        id
        createdAt
        asset {
          address
          name
          logo
        }
        buyTransaction {
          id
          createdAt
          snapshot {
            id
            price
            priceInUsd
            priceSolInUsd
          }
        }
        sellTransaction {
          id
          createdAt
          snapshot {
            id
            price
            priceInUsd
            priceSolInUsd
          }
        }
      }
      meta {
        total
      }
    }
  }
`;

const TradesPage: React.FC = () => {
  const [fetchData, { data, loading }] = useLazyQuery(findManyTradesQuery);

  return (
    <Layout>
      <UITable
        columns={columns}
        data={
          data?.findManyTrades?.trades?.length
            ? data.findManyTrades.trades.map((trade: any) => ({
                ...trade,
                key: trade.id,
              }))
            : []
        }
        loading={loading}
        fetchData={fetchData}
        total={data?.findManyTrades?.meta.total}
      />
    </Layout>
  );
};

export default TradesPage;
