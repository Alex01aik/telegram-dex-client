import Layout from "../../components/Layout";
import { Input, Button, Form, Card, Switch } from "antd";
import { useAuth } from "../../providers/AuthProvider";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useApp } from "../../providers/AppProvider";

const updateMyUserMutation = gql`
  mutation updateMyUser($name: String, $isAutoTrade: Boolean) {
    updateMyUser(name: $name, isAutoTrade: $isAutoTrade) {
      id
    }
  }
`;

const ProfilePage: React.FC = () => {
  const { notificationApi, requestWithErrorNotificationWrapper } = useApp();
  const { user, refreshUser } = useAuth();
  const [isEditable, setIsEditable] = useState(false);
  const [updateMyUser] = useMutation(updateMyUserMutation);

  const updateProfile = async (values: any) => {
    await requestWithErrorNotificationWrapper(async () => {
      const res = await updateMyUser({
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
    });
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
