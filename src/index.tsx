import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import InformatorsPage from "./pages/informators";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import AssetsPage from "./pages/assets";
import SnapshotsPage from "./pages/snapshots";
import TradesPage from "./pages/trades";

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/trades" replace />,
  },
  {
    path: "/informators",
    element: <InformatorsPage />,
  },
  {
    path: "/assets",
    element: <AssetsPage />,
  },
  {
    path: "/snapshots",
    element: <SnapshotsPage />,
  },
  {
    path: "/trades",
    element: <TradesPage />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
    </ApolloProvider>
  </React.StrictMode>
);

reportWebVitals();
