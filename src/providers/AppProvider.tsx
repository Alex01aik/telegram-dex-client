import { notification } from "antd";
import { NotificationInstance } from "antd/es/notification/interface";
import React, { createContext, useContext, PropsWithChildren } from "react";

type AppContextType = {
  notificationApi: NotificationInstance;
  requestWithErrorNotificationWrapper: (
    callback: () => Promise<void>
  ) => Promise<void>;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification();

  const requestWithErrorNotificationWrapper = async (
    callback: () => Promise<void>
  ) => {
    try {
      await callback();
    } catch (error) {
      api.error({
        message: JSON.stringify(error),
        showProgress: true,
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        notificationApi: api,
        requestWithErrorNotificationWrapper,
      }}
    >
      {contextHolder}
      {children}
    </AppContext.Provider>
  );
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within a AppProvider");
  }

  return context;
};

export { AppProvider, useApp };
