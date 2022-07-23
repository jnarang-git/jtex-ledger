import { useRouter } from "next/router";
import withAuth from "../customHooks/withAuth";
const Layout = ({ children }) => {
  const router = useRouter();
  return children;
};

export default withAuth(Layout);
