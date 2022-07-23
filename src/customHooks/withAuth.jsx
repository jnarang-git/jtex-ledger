const withAuth = (WrappedComponent) => {
  return (props) => {
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
