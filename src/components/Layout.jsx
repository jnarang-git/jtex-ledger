import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { isAfter } from "date-fns";

const Layout = ({ children }) => {
  const router = useRouter();
  const { data: session } = useSession();
  if (typeof window !== "undefined") {
    if (!session) {
      router.push("/login");
      return null;
    }
  }
  return children;
};

export default Layout;
