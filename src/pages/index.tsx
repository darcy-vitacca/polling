import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 flex flex-col">
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl">Your Questions</h1>
        {data?.map((item) => (
          <div className="flex flex-col my-2" key={item.id}>
            <Link href={`/question/${item.id}`}>
              <div key={item.id} className="mb-4">
                {item?.question}
              </div>
            </Link>
            <span>Created on {item?.createdAt.toDateString()}</span>
          </div>
        ))}
      </div>
      <Link href="/create">
        <a>Create new question</a>
      </Link>
    </div>
  );
};

export default Home;
