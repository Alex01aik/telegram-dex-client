import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { AuthProvider, useAuth } from "./providers/AuthProvider";
import { Flex, Spin } from "antd";
import { AppProvider } from "./providers/AppProvider";
import { adminRoutes, unAuthRoutes, userRoutes } from "./utils/routes";
import { graphqlClient } from "./utils/graphqlClient";

const AuthRouter: React.FC = () => {
  const { user, isLoading, isAdmin } = useAuth();

  const unAuthRouter = createBrowserRouter(unAuthRoutes);
  const authRouter = createBrowserRouter(
    isAdmin ? [...adminRoutes, ...userRoutes] : userRoutes
  );

  return isLoading ? (
    <Flex
      align="center"
      justify="center"
      style={{
        height: "100%",
      }}
    >
      <Spin size="large" />
    </Flex>
  ) : (
    <RouterProvider router={user ? authRouter : unAuthRouter} />
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <ApolloProvider client={graphqlClient}>
        <AuthProvider>
          <AuthRouter />
        </AuthProvider>
      </ApolloProvider>
    </AppProvider>
  );
};

export default App;
