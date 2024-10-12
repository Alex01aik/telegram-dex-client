import Layout from "../../components/Layout";
import { Input, Button, Form, Card } from "antd";
import { useAuth } from "../../providers/AuthProvider";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();

  // TODO any
  const validateConfirmPassword = ({ getFieldValue }: any) => ({
    validator(_: any, value: any) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject(new Error("Passwords do not match!"));
    },
  });

  return (
    <Layout>
      <Card title="Register">
        <Form onFinish={register}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            dependencies={["repeat-password"]}
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
            ]}
          >
            <Input.Password visibilityToggle />
          </Form.Item>
          <Form.Item
            label="Repeat password"
            name="repeat-password"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message: "Please repeat password!",
              },
              validateConfirmPassword,
            ]}
          >
            <Input.Password visibilityToggle />
          </Form.Item>
          <Form.Item
            label="name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default RegisterPage;
