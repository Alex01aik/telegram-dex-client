import Layout from "../../components/Layout";
import { Flex, type TableColumnsType } from "antd";
import { useLazyQuery, gql } from "@apollo/client";
import UITable from "../../components/UITable";
import formatDate from "../../utils/formatDate";

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
    title: "Sell transactions",
    width: 200,
    key: "sellTransactions",
    render: (value) => (
      <div>
        {/* TODO any */}
        {value.sellTransactions.map((transaction: any) => (
          <div key={transaction.id}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 64,
              }}
            >
              <div
                style={{
                  width: "max-content",
                  flex: "auto",
                  display: "flex",
                  gap: 64,
                }}
              >
                <div>Value: {transaction.value}</div> -
                <div>Price: {transaction.snapshot.price}</div>
              </div>
              <div>{formatDate(transaction.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    ),
  },
];

const findManyTradesForAllUsersQuery = gql`
  query findManyTradesForAllUsers($take: Int, $skip: Int) {
    findManyTradesForAllUsers(take: $take, skip: $skip) {
      trades {
        id
        createdAt
        user {
          id
          name
        }
        asset {
          address
          name
          logo
        }
        buyTransaction {
          id
          value
          createdAt
          snapshot {
            id
            price
          }
        }
        sellTransactions {
          id
          value
          createdAt
          snapshot {
            id
            price
          }
        }
      }
      meta {
        total
      }
    }
  }
`;

const AllTradesPage: React.FC = () => {
  const [fetchData, { data, loading }] = useLazyQuery(
    findManyTradesForAllUsersQuery
  );

  return (
    <Layout>
      <UITable
        columns={columns}
        data={
          data?.findManyTradesForAllUsers?.trades?.length
            ? data.findManyTradesForAllUsers.trades.map((trade: any) => ({
                ...trade,
                key: trade.id,
              }))
            : []
        }
        loading={loading}
        fetchData={fetchData}
        total={data?.findManyTradesForAllUsers?.meta.total}
      />
    </Layout>
  );
};

export default AllTradesPage;
