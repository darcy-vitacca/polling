import React from "react";
import Link from "next/link";

import { FC } from "react";
import { trpc } from "../utils/trpc";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../utils/create-question-validator";
import { useRouter } from "next/router";

const CreateQuestionForm: FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
  });

  const { mutate, isLoading, data } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      reset();
      router.push(`/question/${data?.id}`);
    },
  });

  const onSubmit: SubmitHandler<CreateQuestionInputType> = (data) => {
    mutate(data);
  };

  if (isLoading || data) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-6 text-gray-100 antialiasing">
      <header className="flex justify-between w-full header">
        <Link href={"/"}>
          <h1 className="text-4xl font-bold cursor-pointer">OnAVote</h1>
        </Link>
      </header>
      <div className="max-w-xl py-12 mx-auto md:max-w-2xl">
        <h2 className="text-2xl font-bold">Create a new poll</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="w-full mt-8">
            <div className="w-full my-10 form-control">
              <label className="label">
                <span className="text-base font-semibold label-text">
                  Your Question
                </span>
              </label>
              <input
                {...register("question")}
                type="text"
                className="block w-full text-gray-800 rounded-md input input-bordered"
                placeholder="How do magnets work?"
              />
              {errors.question && (
                <p className="text-red-400">{errors.question.message}</p>
              )}
            </div>
            <div className="flex items-center my-3">
              {/*<button*/}
              {/*  type="button"*/}
              {/*  value="Add more options"*/}
              {/*  className="btn btn-ghost"*/}
              {/*  onClick={() => append({ text: "Another Option" })}*/}
              {/*>*/}
              {/*  Add options*/}
              {/*</button>*/}
            </div>
          </div>
          <input
            type="submit"
            className="w-full  bg-gray-200 text-gray-800 p-2 w-[200px]"
            value="Create question"
          />
        </form>
      </div>
    </div>
  );
};

const QuestionCreator: FC = (props) => {
  return (
    <div>
      <CreateQuestionForm />
    </div>
  );
};

export default QuestionCreator;
