import * as trpc from "@trpc/server";
import { prisma } from "../../db/client";
import { z } from "zod";

export const questionRouter = trpc
  .router()
  .query("get-all", {
    async resolve() {
      return await prisma.pollQuestion.findMany();
    },
  })
  .query("get-by-id", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.findFirst({
        where: {
          id: input.id,
        },
      });
    },
  })
  .mutation("create-question", {
    //because of this input validator, the front end can't create a question without a string being passed in, it will error
    input: z.object({
      question: z.string().min(5).max(500),
    }),
    async resolve({ input }) {
      return await prisma.pollQuestion.create({
        data: {
          question: input.question,
          options: [],
        },
      });
    },
  });
