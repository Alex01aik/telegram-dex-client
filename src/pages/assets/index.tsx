import Layout from "../../components/Layout";
import { Flex } from "antd";
import type { TableColumnsType } from "antd";
import { useLazyQuery, gql } from "@apollo/client";
import UITable from "../../components/UITable";
import formatDate from "../../utils/formatDate";
import { CopyOutlined } from "@ant-design/icons";
import "./styles.css";

const columns: TableColumnsType = [
  {
    title: "Asset",
    width: 100,
    key: "name",
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
    title: "Address",
    width: 200,
    dataIndex: "address",
    key: "address",
    fixed: "left",
    render: (value) => (
      <div
        className="addressCell"
        onClick={() => {
          navigator.clipboard.writeText(value);
        }}
      >
        <CopyOutlined
          style={{
            color: "#1668dc",
          }}
        />
        {value}
      </div>
    ),
  },
  {
    title: "Full name",
    width: 100,
    dataIndex: "fullName",
    key: "fullName",
  },
  {
    title: "Created at",
    width: 100,
    dataIndex: "createdAt",
    key: "createdAt",
    render: (value) => formatDate(value),
  },
];

const findManyAssetsQuery = gql`
  query findManyAssets($take: Int, $skip: Int) {
    findManyAssets(skip: $skip, take: $take) {
      assets {
        address
        name
        fullName
        logo
        createdAt
      }
      meta {
        total
      }
    }
  }
`;

const AssetsPage: React.FC = () => {
  const [fetchData, { data, loading }] = useLazyQuery(findManyAssetsQuery);

  return (
    <Layout>
      <UITable
        columns={columns}
        data={
          data?.findManyAssets?.assets?.length
            ? data.findManyAssets.assets.map((asset: any) => ({
                ...asset,
                key: asset.address,
              }))
            : []
        }
        loading={loading}
        fetchData={fetchData}
        total={data?.findManyAssets?.meta.total}
      />
    </Layout>
  );
};

export default AssetsPage;
