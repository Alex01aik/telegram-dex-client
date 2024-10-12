import Layout from "../../components/Layout";
import { Input, Button, Form, Card, Switch } from "antd";
import { useAuth } from "../../providers/AuthProvider";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useApp } from "../../providers/AppProvider";

const updateOneUserMutation = gql`
  mutation updateOneUser($id: String!, $name: String, $isAutoTrade: Boolean) {
    updateOneUser(id: $id, name: $name, isAutoTrade: $isAutoTrade) {
      id
    }
  }
`;

const ProfilePage: React.FC = () => {
  const { notificationApi } = useApp();
  const { user, refreshUser } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [updateOneUser] = useMutation(updateOneUserMutation);

  const updateProfile = async (values: any) => {
    try {
      const res = await updateOneUser({
        variables: {
          id: user.id,
          ...values,
        },
      });
      if (res?.data) {
        await refreshUser();
        notificationApi.success({
          message: "Profile updated",
          showProgress: true,
        });
      } else {
        notificationApi.error({
          message: res.errors?.[0]?.message ?? "Error",
          showProgress: true,
        });
      }
    } catch (error) {
      notificationApi.error({
        message: JSON.stringify(error),
        showProgress: true,
      });
    }
  };

  return (
    <Layout>
      <Card title="Profile">
        <Form initialValues={user} onFinish={updateProfile}>
          <Form.Item label="Name" name={"name"}>
            <Input disabled={!isEditable} />
          </Form.Item>
          <Form.Item label="Automation trade" name={"isAutoTrade"}>
            <Switch disabled={!isEditable} />
          </Form.Item>
          <Form.Item label="Role" name={"role"}>
            <Input disabled />
          </Form.Item>
          <Form.Item>
            {isEditable ? (
              <Button
                type="primary"
                onClick={() => {
                  setIsEditable(false);
                }}
              >
                Save
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setIsEditable(true);
                }}
              >
                Edit
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default ProfilePage;
