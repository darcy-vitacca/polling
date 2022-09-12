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
      console.log(data);
      reset();
      router.push(`/question/${data?.id}`);
    },
  });

  const onSubmit: SubmitHandler<CreateQuestionInputType> = (data) => {
    console.log(data);
    mutate(data);
  };
  console.log("errors", errors);

  console.log(watch("question")); // w

  if (isLoading || data) return <div>Loading...</div>;

  return (
    <div className="antialiasing text-gray-100 p-6 min-h-screen">
      <header className="header flex w-full justify-between">
        <Link href={"/"}>
          <h1 className="text-4xl font-bold cursor-pointer">OnAVote</h1>
        </Link>
      </header>
      <div className="max-w-xl mx-auto py-12 md:max-w-2xl">
        <h2 className="text-2xl font-bold">Create a new poll</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="mt-8 w-full">
            <div className="form-control my-10 w-full">
              <label className="label">
                <span className="label-text font-semibold text-base">
                  Your Question
                </span>
              </label>
              <input
                {...register("question")}
                type="text"
                className="input input-bordered  w-full block text-gray-800 rounded-md"
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

const QuestionCreator: FC = () => {
  return (
    <div>
      <CreateQuestionForm />
    </div>
  );
};

export default QuestionCreator;
