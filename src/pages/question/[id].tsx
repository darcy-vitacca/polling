import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { FC } from "react";

const QuestionsPageContent: FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery([
    "questions.get-by-id",
    { id },
  ]);
  if (!isLoading && !data) return <div>Question not found</div>;
  return (
    <div>
      {data?.isOwner && (
        <div className="text-white bg-red-700 rounded-md">You made this</div>
      )}
      <p>{data?.question?.question}</p>
      <div>
        {(data?.question?.options as string[])?.map((option, index) => {
          return (
            <div key={index}>
              <p className="font-bold">{(option as any).text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuestionPage = (props) => {
  const { query } = useRouter();
  const { id } = query;
  if (!id || typeof id != "string") return <div>No id</div>;

  return (
    <div className="flex flex-col p-6">
      Question Page : {id}
      <QuestionsPageContent id={id} />
    </div>
  );
};

export default QuestionPage;
