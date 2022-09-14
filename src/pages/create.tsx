import React, { Fragment } from "react";
import Link from "next/link";

import { FC } from "react";
import { trpc } from "../utils/trpc";

import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import {
  CreateQuestionInputType,
  createQuestionValidator,
} from "../shared/create-question-validator";
import { useRouter } from "next/router";

const CreateQuestionForm: FC = (props) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateQuestionInputType>({
    resolver: zodResolver(createQuestionValidator),
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const { mutate, isLoading, data } = trpc.useMutation("questions.create", {
    onSuccess: (data) => {
      debugger;
      reset();
      router.push(`/question/${data?.id}`);
    },
  });

  const onSubmit: SubmitHandler<CreateQuestionInputType> = (data) => {
    mutate(data);
  };

  if (isLoading || data) return <div>Loading...</div>;

  console.log("fields", fields);
  console.log("errors", errors);

  return (
    <div className="min-h-screen p-6 text-gray-100 antialiasing">
      <header className="flex justify-between w-full header">
        <Link href={"/"}>
          <h1 className="text-4xl font-bold cursor-pointer">
            Create a new poll
          </h1>
        </Link>
      </header>
      <div className="max-w-xl py-12 mx-auto md:max-w-2xl">
        <h2 className="text-2xl font-bold">Create a new poll</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className="flex flex-col">
              {fields?.map((field, index) => (
                <div
                  className="flex flex-col justify-start my-2"
                  key={field.id}
                >
                  <div className="flex flex-row w-full form-control">
                    <input
                      {...register("question")}
                      type="text"
                      className="block w-full text-gray-800 rounded-md input input-bordered"
                      {...register(`options.${index}.text`)}
                    />
                    <button
                      className="ml-2 text-2xl"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <XCircleIcon className="ml-2 w-7" />
                    </button>
                  </div>
                </div>
              ))}
              {errors.options && (
                <p className="text-red-400">{errors.options.message}</p>
              )}
            </div>
            <div className="my-2">
              <button
                className="bg-gray-200 text-gray-800 p-2 w-[200px] inline-flex items-center justify-center"
                type="button"
                onClick={() => append({ text: "" })}
              >
                Add option <PlusCircleIcon className="w-6 h-6 ml-1" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-gray-200 text-gray-800 p-2 w-[200px]"
          >
            Create Question
          </button>
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
