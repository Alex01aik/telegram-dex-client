import Layout from "../../components/Layout";
import type { TableColumnsType } from "antd";
import { useLazyQuery, gql, useMutation } from "@apollo/client";
import UITable from "../../components/UITable";
import { Input, Button, Flex, Form, Card } from "antd";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const findManyTransactionRulesQuery = gql`
  query findManyTransactionRules($take: Int, $skip: Int) {
    findManyTransactionRules(skip: $skip, take: $take) {
      transactionRules {
        id
        priceChange
        transactionVolume
        type
        createdAt
      }
      meta {
        total
      }
    }
  }
`;

const createOneSellTransactionRuleMutation = gql`
  mutation createOneSellTransactionRule(
    $priceChange: String!
    $transactionVolume: String
  ) {
    createOneSellTransactionRule(
      priceChange: $priceChange
      transactionVolume: $transactionVolume
    ) {
      id
      priceChange
      transactionVolume
      type
      createdAt
    }
  }
`;

const updateOneTransactionRuleMutation = gql`
  mutation updateOneTransactionRule(
    $id: String!
    $priceChange: String
    $transactionVolume: String
  ) {
    updateOneTransactionRule(
      id: $id
      priceChange: $priceChange
      transactionVolume: $transactionVolume
    ) {
      id
      priceChange
      transactionVolume
      type
      createdAt
    }
  }
`;

const RulesPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [fetchData, { data: findManyData, loading: findManyLoading, refetch }] =
    useLazyQuery(findManyTransactionRulesQuery);
  const [editableRule, setEditableRule] = useState<any>();
  const [createdRule, setCreatedRule] = useState<any>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [create] = useMutation(createOneSellTransactionRuleMutation);
  const [update] = useMutation(updateOneTransactionRuleMutation);

  const reset = () => {
    setEditableRule(undefined);
    setCreatedRule(undefined);
    setShowAddForm(false);
    refetch();
  };

  const columns: TableColumnsType = [
    {
      title: "Type",
      width: 50,
      dataIndex: "type",
      key: "type",
      render: (value) => (
        <p
          style={{
            color: value === "STOP" ? "red" : "green",
          }}
        >
          {value}
        </p>
      ),
    },
    {
      title: "Price change",
      width: 100,
      key: "priceChange",
      render: (value) => (
        <Flex align="center" gap={4}>
          {value.type === "STOP" ? "-" : ""}
          <Input
            value={
              editableRule?.id === value.id
                ? editableRule.priceChange
                : value.priceChange
            }
            disabled={editableRule?.id !== value.id}
            onChange={(e) => {
              setEditableRule((prev: any) => ({
                ...prev,
                priceChange: e.target.value,
              }));
            }}
          />
        </Flex>
      ),
    },
    {
      title: "Transaction volume",
      width: 100,
      key: "transactionVolume",
      render: (value) =>
        value.type === "STOP" ? (
          <></>
        ) : (
          <Input
            value={
              editableRule?.id === value.id
                ? editableRule.transactionVolume
                : value.transactionVolume
            }
            disabled={editableRule?.id !== value.id}
            onChange={(e) => {
              setEditableRule((prev: any) => ({
                ...prev,
                transactionVolume: e.target.value,
              }));
            }}
          />
        ),
    },
    {
      width: 50,
      key: "button",
      render: (value) =>
        editableRule?.id === value.id ? (
          <Button
            onClick={async () => {
              await update({
                variables: {
                  ...editableRule,
                },
              });
              reset();
            }}
          >
            Save
          </Button>
        ) : (
          <Button onClick={() => setEditableRule(value)} disabled={!isAdmin}>
            Edit
          </Button>
        ),
    },
  ];

  return (
    <Layout>
      <UITable
        columns={columns}
        data={
          findManyData?.findManyTransactionRules?.transactionRules?.length
            ? findManyData.findManyTransactionRules.transactionRules.map(
                (informator: any) => ({
                  ...informator,
                  key: informator.id,
                })
              )
            : []
        }
        loading={findManyLoading}
        fetchData={fetchData}
        total={findManyData?.findManyTransactionRules?.meta.total}
      />
      <Flex>
        {showAddForm ? (
          <Card title="Create new SELL rule">
            <Form
              onFinish={async (values) => {
                await create({
                  variables: values,
                });
                reset();
              }}
            >
              <Form.Item
                label="Price change"
                name="priceChange"
                rules={[
                  { required: true, message: "Please input price change!" },
                ]}
              >
                <Input
                  value={createdRule?.priceChange}
                  onChange={(e) => {
                    setCreatedRule((prev: any) => ({
                      ...prev,
                      priceChange: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Transaction volume"
                name="transactionVolume"
                rules={[
                  {
                    required: true,
                    message: "Please input transaction volume!",
                  },
                ]}
              >
                <Input
                  value={createdRule?.transactionVolume}
                  onChange={(e) => {
                    setCreatedRule((prev: any) => ({
                      ...prev,
                      transactionVolume: e.target.value,
                    }));
                  }}
                />
              </Form.Item>
              <Flex gap={12} justify="space-between">
                <Button
                  onClick={() => setShowAddForm(false)}
                  disabled={!isAdmin}
                >
                  Back
                </Button>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </Form.Item>
              </Flex>
            </Form>
          </Card>
        ) : (
          <Button
            type="primary"
            onClick={() => setShowAddForm(true)}
            disabled={!isAdmin}
          >
            Add new SELL rule
          </Button>
        )}
      </Flex>
    </Layout>
  );
};

export default RulesPage;
