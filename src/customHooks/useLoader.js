import * as React from "react";
export const useLoader = () => {
  const [loader, setLoader] = React.useState(false);

  function showLoader() {
    setLoader(true);
  }
  function hideLoader() {
    setLoader(false);
  }

  return { loader, showLoader, hideLoader };
};
