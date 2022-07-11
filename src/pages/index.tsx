import { NextPage } from "next";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all-my-questions"]);
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 flex flex-col w-screen items-stretch">
      <div className="header flex w-full justify-between">
        <div className="flex flex-col">
          <h1 className="font-bold text-2xl">Your Questions</h1>
          {data?.map((item) => (
            <Link href={`/question/${item.id}`} key={item.id}>
              <div className="flex flex-col my-2">
                <div key={item.id} className="mb-4">
                  {item?.question}
                </div>
                <span>Created on {item?.createdAt.toDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/create">
          <a className="bg-gray-300 rounded text-gray-800 p-4 h-[60px]">
            Create new question
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Home;
