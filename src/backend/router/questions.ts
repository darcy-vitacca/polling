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
      const myVote = await prisma.vote.findFirst({
        where: {
          questionId: input.id,
          voterToken: ctx.token,
        },
      });
      const isOwner = question?.ownerToken === ctx.token

      const rest = { question, vote: myVote, isOwner }

      if (rest.vote || rest.isOwner) {
        const votes = await prisma.vote.groupBy({
          where: { questionId: input.id },
          by: ['choice'],
          _count: true
        })

        return { ...rest, votes };

      }

      return { ...rest, votes: undefined };
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
  })
  .mutation("vote-on-question", {
    //because of this input validator, the front end can't create a question without a string being passed in, it will error
    input: z.object({ questionId: z.string(), option: z.number().min(0).max(10) }),
    async resolve({ input, ctx }) {
      console.log('input', input);


      if (!ctx.token) throw new Error("Unauthorized");
      return await prisma.vote.create({
        data: {
          questionId: input.questionId,
          choice: input.option,
          voterToken: ctx.token,
        },
      });
    },
  });

