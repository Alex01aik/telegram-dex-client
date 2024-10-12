import Layout from "../../components/Layout";
import type { TableColumnsType } from "antd";
import { useLazyQuery, gql, useMutation } from "@apollo/client";
import UITable from "../../components/UITable";
import { Input, Button, Flex, Form, Card } from "antd";
import { useState } from "react";
import { useAuth } from "../../providers/AuthProvider";

const findManyChatsQuery = gql`
  query findManyChats($take: Int, $skip: Int) {
    findManyChats(skip: $skip, take: $take) {
      chats {
        id
        name
        telegramId
        rate {
          id
          successes
          fales
          createdAt
        }
        informators {
          id
          userName
          rate {
            id
            successes
            fales
          }
          isTrusted
          createdAt
        }
      }
      meta {
        total
      }
    }
  }
`;

const createOneChatMutation = gql`
  mutation createOneChat($telegramId: String!) {
    createOneChat(telegramId: $telegramId) {
      id
      telegramId
      rate {
        id
        successes
        fales
      }
      createdAt
    }
  }
`;

const deleteOneChatMutation = gql`
  mutation deleteOneChat($id: String!) {
    deleteOneChat(id: $id) {
      id
    }
  }
`;

const ChatsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [fetchData, { data: findManyData, loading: findManyLoading, refetch }] =
    useLazyQuery(findManyChatsQuery);
  const [createdChat, setCreatedChat] = useState<{ telegramId: string }>({
    telegramId: "",
  });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [create] = useMutation(createOneChatMutation);
  const [remove] = useMutation(deleteOneChatMutation);

  const reset = () => {
    setCreatedChat({ telegramId: "" });
    setShowAddForm(false);
    refetch();
  };

  const columns: TableColumnsType = [
    {
      title: "Chat ID (telegram ID)",
      width: 50,
      dataIndex: "telegramId",
      key: "telegramId",
    },
    {
      title: "Name",
      width: 100,
      dataIndex: "name",
      key: "name",
    },
    {
      title: "rate",
      width: 50,
      dataIndex: "rate",
      key: "rate",
      render: (value) => (
        <Flex gap={4}>
          <div
            style={{
              color: "green",
              fontWeight: "bold",
            }}
          >
            {value.successes}
          </div>
          /
          <div
            style={{
              color: "red",
              fontWeight: "bold",
            }}
          >
            {value.fales}
          </div>
        </Flex>
      ),
    },
    {
      width: 50,
      key: "button",
      render: (value) => (
        <Button
          onClick={async () => {
            await remove({
              variables: {
                id: value.id,
              },
            });
            refetch();
          }}
          disabled={!isAdmin}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Flex vertical gap={12}>
        <UITable
          columns={columns}
          data={
            findManyData?.findManyChats?.chats?.length
              ? findManyData.findManyChats.chats.map((informator: any) => ({
                  ...informator,
                  key: informator.id,
                }))
              : []
          }
          loading={findManyLoading}
          fetchData={fetchData}
          total={findManyData?.findManyChats?.meta.total}
        />
        <Flex>
          {showAddForm ? (
            <Card title="Create new chat">
              <Form
                onFinish={async (values) => {
                  await create({
                    variables: values,
                  });
                  reset();
                }}
              >
                <Form.Item
                  label="Chat ID"
                  name="telegramId"
                  rules={[{ required: true, message: "Please input chat ID!" }]}
                >
                  <Input
                    value={createdChat.telegramId}
                    onChange={(e) => {
                      setCreatedChat((prev: any) => ({
                        ...prev,
                        priceChange: e.target.value,
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
              Add new chat
            </Button>
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default ChatsPage;
