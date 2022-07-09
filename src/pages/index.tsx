import type { NextPage } from "next";
import { prisma } from "../db/client";

const Home: NextPage = ({ questions }) => {
  console.log("questions", questions);
  return (
    <div className="">
      <code>{questions}</code>
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const questions = await prisma.pollQuestion.findMany();
  return { props: { questions: JSON.stringify(questions) } };
};
