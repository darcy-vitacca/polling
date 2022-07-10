import { FC, useRef } from "react";
import { trpc } from "../utils/trpc";

const QuestionCreator: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const client = trpc.useContext();
  const { mutate, isLoading } = trpc.useMutation("questions.create", {
    onSuccess: () => {
      //on success get all is refetched
      client.invalidateQueries(["questions.get-all-my-questions"]);
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

export default QuestionCreator;
