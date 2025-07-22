import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import DashBoard from "@/components/home/templates/DashBoard";
import {getServerSession} from "next-auth";

const HomePage = async () => {
  const session = await getServerSession(authOptions);

  return <DashBoard isAuthenticated={!!session} />;
};

export default HomePage;
