import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { FC } from "react";

const QuestionsPageContent: FC<{ id: string }> = ({ id }) => {
  const { data, isLoading, error } = trpc.useQuery([
    "questions.get-by-id",
    { id },
  ]);

  const { mutate, data: voteResponse } = trpc.useMutation(
    "questions.vote-on-question"
  );

  if (!data || !data?.question) return <div>Question not found</div>;
  return (
    <div>
      {data?.isOwner && (
        <div className="text-white bg-red-700 rounded-md">You made this</div>
      )}
      <p>{data?.question?.question}</p>
      <div className="flex flex-col gap-4">
        {(data?.question?.options as string[])?.map((option, index) => {
          if (data?.isOwner || data?.vote) {
            return (
              <div key={index}>
                <p className="font-bold">{(option as any).text}</p>
              </div>
            );
          }
          return (
            <button
              key={index}
              onClick={() =>
                mutate({ questionId: data?.question!.id, option: index })
              }
            >
              {(option as any)?.text}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuestionPage: FC = (props) => {
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
