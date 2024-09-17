import Layout from "../../components/Layout";
import type { TableColumnsType } from "antd";
import { useLazyQuery, gql, useMutation } from "@apollo/client";
import UITable from "../../components/UITable";
import { Switch } from "antd";
import formatDate from "../../utils/formatDate";

const findManyInformatorsQuery = gql`
  query findManyInformators($take: Int, $skip: Int) {
    findManyInformators(skip: $skip, take: $take) {
      informators {
        id
        userName
        isTrusted
        createdAt
      }
      meta {
        total
      }
    }
  }
`;

const updateOneInformatorQuery = gql`
  mutation updateOneInformator(
    $id: String!
    $userName: String
    $isTrusted: Boolean
  ) {
    updateOneInformator(id: $id, userName: $userName, isTrusted: $isTrusted) {
      success
    }
  }
`;

const InformatorsPage: React.FC = () => {
  const [fetchData, { data: findManyData, loading: findManyLoading, refetch }] =
    useLazyQuery(findManyInformatorsQuery);
  const [update] = useMutation(updateOneInformatorQuery);

  const columns: TableColumnsType = [
    {
      title: "Username",
      width: 100,
      dataIndex: "userName",
      key: "userName",
      fixed: "left",
    },
    {
      title: "Trusted",
      width: 100,
      key: "isTrusted",
      fixed: "left",
      render: (value) => (
        <Switch
          defaultValue={value.isTrusted}
          onChange={async (v) => {
            await update({
              variables: {
                id: value.id,
                isTrusted: v,
              },
            });
            await refetch();
          }}
        />
      ),
    },
    {
      title: "Created at",
      width: 100,
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => formatDate(value),
    },
  ];

  return (
    <Layout>
      <UITable
        columns={columns}
        data={
          findManyData?.findManyInformators?.informators?.length
            ? findManyData.findManyInformators.informators.map(
                (informator: any) => ({
                  ...informator,
                  key: informator.id,
                })
              )
            : []
        }
        loading={findManyLoading}
        fetchData={fetchData}
        total={findManyData?.findManyInformators?.meta.total}
      />
    </Layout>
  );
};

export default InformatorsPage;
