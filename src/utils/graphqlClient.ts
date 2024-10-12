import {
  ApolloClient,
  InMemoryCache,
  Observable,
  createHttpLink,
  gql,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { fromPromise } from "@apollo/client/link/utils";

const refreshQuery = gql`
  query refresh {
    refresh {
      accessToken
    }
  }
`;

const refreshToken = async (client: ApolloClient<any>) => {
  try {
    const res = await client.query({
      query: refreshQuery,
    });

    const newAccessToken = res.data?.refresh?.accessToken;

    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }
  } catch (error) {
    console.error("Error refreshing token", error);
    return null;
  }
};

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
  credentials: "include",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("accessToken");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      if (!["refresh", "login", "register"].includes(operation.operationName)) {
        for (const err of graphQLErrors) {
          if (["jwt expired", "Unauthorized"].includes(err.message)) {
            return fromPromise(
              refreshToken(graphqlClient).then((newAccessToken) => {
                if (newAccessToken) {
                  operation.setContext(({ headers = {} }) => ({
                    headers: {
                      ...headers,
                      Authorization: `Bearer ${newAccessToken}`,
                    },
                  }));
                  return forward(operation);
                }
                return { data: undefined };
              })
            ).flatMap((result) => {
              if (!result) return Observable.of();
              return forward(operation);
            });
          }
        }
      }
    }

    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  }
);

export const graphqlClient = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
  credentials: "include",
});
