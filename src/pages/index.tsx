import { FC, useRef } from "react";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const QuestionCreator: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create-question", {
    onSuccess: () => {
      //on success get all is refetched
      client.invalidateQueries(["questions.get-all"]);
      if (!inputRef.current) return;
      inputRef.current.value = "";
    },
  });

  return (
    <div>
      <input
        ref={inputRef}
        disabled={isLoading}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("enter", e.currentTarget.value);
            mutate({ question: e.currentTarget.value });
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
};

// @ts-ignore
const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-all"]);
  if (isLoading || !data) {
    return <div>Loading...</div>;
  }
  console.log("data", data);
  return (
    <div className="p-6 flex flex-col">
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl">Questions</h1>
        {data?.map((item) => (
          <Link href={`/question/${item.id}`} key={item.id}>
            <div key={item.id} className="mb-4">
              {item.question}
            </div>
          </Link>
        ))}
      </div>
      <QuestionCreator />
    </div>
  );
};

export default Home;
