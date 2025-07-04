// src/components/RouteError.tsx

import { useRouteError } from "react-router";
import Error from "./Error";

const RouteError = () => {
  const error = useRouteError() as Error;

  return (
    <Error
      errorTitle="Something went wrong"
      errorDescription={error?.message || "Unknown error occurred"}
      isLinkAvailable={true}
      linkTitle="Go Home"
      href=""
    />
  );
};

export default RouteError;
