import { gql, useLazyQuery, useMutation } from "@apollo/client";
import React, {
  createContext,
  useContext,
  PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useApp } from "./AppProvider";

const loginQuery = gql`
  query login($login: String!, $password: String!) {
    login(login: $login, password: $password) {
      accessToken
    }
  }
`;

const registerMutation = gql`
  mutation register($login: String!, $password: String!, $name: String!) {
    register(login: $login, password: $password, name: $name) {
      accessToken
    }
  }
`;

const meQuery = gql`
  query me {
    me {
      id
      name
      isAutoTrade
      role
      createdAt
    }
  }
`;

type AuthContextType = {
  user: any | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
  login: (values: { email: string; password: string }) => Promise<void>;
  register: (values: {
    name: string;
    password: string;
    email: string;
  }) => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { notificationApi, requestWithErrorNotificationWrapper } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [me] = useLazyQuery(meQuery);
  const [loginReq] = useLazyQuery(loginQuery);
  const [registerReq] = useMutation(registerMutation);
  // TODO any
  const [user, setUser] = useState<any>(null);

  const fetchMe = useCallback(async () => {
    setIsLoading(true);
    const res = await me();
    if (res.data) {
      setUser(res.data.me);
    } else {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
    setIsLoading(false);
  }, [me]);

  const refreshUser = async () => {
    await fetchMe();
  };

  const register = async (values: {
    name: string;
    password: string;
    email: string;
  }) => {
    await requestWithErrorNotificationWrapper(async () => {
      const res = await registerReq({
        variables: {
          name: values.name,
          password: values.password,
          login: values.email,
        },
      });
      if (res.data) {
        localStorage.setItem("accessToken", res.data.register.accessToken);
        await fetchMe();
      } else {
        notificationApi.error({
          message: res.errors?.[0]?.message ?? "Error",
          showProgress: true,
        });
      }
    });
  };

  const login = async (values: { email: string; password: string }) => {
    await requestWithErrorNotificationWrapper(async () => {
      const res = await loginReq({
        variables: {
          login: values.email,
          password: values.password,
        },
      });
      if (res.data) {
        localStorage.setItem("accessToken", res.data.login.accessToken);
        await fetchMe();
      } else {
        notificationApi.error({
          message: res.error?.message ?? "Error",
          showProgress: true,
        });
      }
    });
  };

  const logout = async () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    window.location.reload();
  };

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const isAdmin = ["Admin", "SuperAdmin"].includes(user?.role);

  return (
    <AuthContext.Provider
      value={{
        user,
        refreshUser,
        logout,
        login,
        register,
        isLoading,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
