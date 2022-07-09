import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

// @ts-ignore
const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  console.log("data", data);
  return (
    <div className="">
      <code>{data[0]?.question}</code>
    </div>
  );
};

export default Home;
