import * as trpc from "@trpc/server";
import { prisma } from "../../db/client";
import { z } from "zod";
import { createRouter } from "./context";

export const questionRouter = createRouter()
  .query("get-all", {
    async resolve() {
      return await prisma.pollQuestion.findMany();
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
  .mutation("create-question", {
    //because of this input validator, the front end can't create a question without a string being passed in, it will error
    input: z.object({
      question: z.string().min(5).max(500),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token)
        return { error: "You must be logged in to create a question" };
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: [],
          ownerToken: ctx.token,
        },
      });
    },
  });
