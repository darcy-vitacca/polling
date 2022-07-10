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
      <p>{data?.question}</p>
      <div>
        {(data?.options as string[])?.map((option) => {
          return <p key={option}>{option}</p>;
        })}
      </div>
    </div>
  );
};

const QuestionPage = () => {
  const { query } = useRouter();
  const { id } = query;
  if (!id || typeof id != "string") return <div>No id</div>;

  return (
    <div className="p-6 flex flex-col">
      Question Page : {id}
      <QuestionsPageContent id={id} />
    </div>
  );
};

export default QuestionPage;
