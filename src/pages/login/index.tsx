import Layout from "../../components/Layout";
import { Input, Button, Form, Card } from "antd";
import { useAuth } from "../../providers/AuthProvider";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  return (
    <Layout>
      <Card title="Login">
        <Form onFinish={login}>
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
            rules={[
              {
                required: true,
                message: "Please input password!",
              },
            ]}
          >
            <Input.Password visibilityToggle />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default LoginPage;
