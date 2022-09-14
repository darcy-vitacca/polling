import { createQuestionValidator } from './../../shared/create-question-validator';
import * as trpc from "@trpc/server";
import { prisma } from "../../db/client";
import { z } from "zod";
import { createRouter } from "./context";

export const questionRouter = createRouter()
  .query("get-all-my-questions", {
    async resolve({ ctx }) {
      if (!ctx.token) return [];
      return await prisma.pollQuestion.findMany({
        where: {
          ownerToken: {
            equals: ctx.token,
          },
        },
      });
    },
  })
  .query("get-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const question = await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });
      return { question, isOwner: question?.ownerToken === ctx.token };
    },
  })
  .mutation("create", {
    //because of this input validator, the front end can't create a question without a string being passed in, it will error
    input: createQuestionValidator,
    async resolve({ input, ctx }) {
      console.log('input', input);


      if (!ctx.token) throw new Error("Unauthorized");
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.token,
        },
      });
    },
  });
