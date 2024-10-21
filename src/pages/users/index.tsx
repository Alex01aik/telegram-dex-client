import Layout from "../../components/Layout";
import type { TableColumnsType } from "antd";
import { useLazyQuery, gql, useMutation } from "@apollo/client";
import UITable from "../../components/UITable";
import { Select, Switch } from "antd";
import formatDate from "../../utils/formatDate";
import { useApp } from "../../providers/AppProvider";
import { useAuth } from "../../providers/AuthProvider";

const findManyUsersQuery = gql`
  query findManyUsers($take: Int, $skip: Int) {
    findManyUsers(skip: $skip, take: $take) {
      users {
        id
        name
        isAutoTrade
        role
        createdAt
      }
      meta {
        total
      }
    }
  }
`;

const updateOneUserMutation = gql`
  mutation updateOneUser($id: String!, $role: UserRole!) {
    updateOneUser(id: $id, role: $role) {
      id
    }
  }
`;

const UsersPage: React.FC = () => {
  const { notificationApi, requestWithErrorNotificationWrapper } = useApp();
  const { user } = useAuth();
  const [fetchData, { data: findManyData, loading: findManyLoading, refetch }] =
    useLazyQuery(findManyUsersQuery);

  const [updateOneUser] = useMutation(updateOneUserMutation);

  const columns: TableColumnsType = [
    {
      title: "Name",
      width: 100,
      dataIndex: "name",
      key: "name",
      fixed: "left",
    },
    {
      title: "Role",
      width: 100,
      key: "role",
      render: (item) => (
        <Select
          disabled={user.role !== "SuperAdmin" || item.role === "SuperAdmin"}
          style={{
            minWidth: 100,
          }}
          defaultValue={item.role}
          options={[
            {
              value: "Admin",
            },
            {
              value: "User",
            },
          ]}
          onSelect={async (value) => {
            await requestWithErrorNotificationWrapper(async () => {
              const res = await updateOneUser({
                variables: {
                  id: item.id,
                  role: value,
                },
              });
              if (res.data) {
                notificationApi.success({
                  message: `User ${item.name} role updated`,
                  showProgress: true,
                });
                await refetch();
              } else {
                notificationApi.error({
                  message: res.errors?.[0]?.message ?? "Error",
                  showProgress: true,
                });
              }
            });
          }}
        />
      ),
    },
    {
      title: "Automation trading",
      width: 100,
      key: "isAutoTrade",
      render: (value) => <Switch defaultValue={value.isAutoTrade} disabled />,
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
          findManyData?.findManyUsers?.users?.length
            ? findManyData.findManyUsers.users.map((user: any) => ({
                ...user,
                key: user.id,
              }))
            : []
        }
        loading={findManyLoading}
        fetchData={fetchData}
        total={findManyData?.findManyUsers?.meta.total}
      />
    </Layout>
  );
};

export default UsersPage;
