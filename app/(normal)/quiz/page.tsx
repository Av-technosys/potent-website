"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import { quizQuestions } from "@/const/globalconst";
import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { useRouter } from "next/navigation";

const Page = () => {
  const [quizData, setQuizData] = React.useState(quizQuestions[0]);
  const [answers, setAnswers] = React.useState<{ [key: number]: number }>({});

  const router = useRouter();

  // const [suggestedProductPopup,setSuggestedProductPopup]=useState(false);

  const filteredAnswers = quizQuestions
    .filter((question) => answers[question.id] !== undefined)
    .map((question) => ({
      id: question.id,
      question: question.question,
      answer: question.options[answers[question.id]].slug,
    }));

  const changeQuiz = (quizId: any) => {
    if (quizQuestions.length > quizId) {
      setQuizData(quizQuestions[quizId]);
    } else {
      toast.success("Quiz Completed!");
      localStorage.setItem("quizAnswers", JSON.stringify(filteredAnswers));
      router.push("/suggested-products");
      // setSuggestedProductPopup(true)
    }
  };

  // const handleOptionClick = (questionId: number, optionIndex: number) => {
  //   setAnswers((prev) => ({
  //     ...prev,
  //     [questionId]: optionIndex,
  //   }));

  //   changeQuiz(questionId);
  // };

  const handleOptionClick = (questionId: number, optionIndex: number) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: optionIndex,
    };

    setAnswers(updatedAnswers);

    const updatedFilteredAnswers = quizQuestions
      .filter((q) => updatedAnswers[q.id] !== undefined)
      .map((q) => ({
        id: q.id,
        question: q.question,
        answer: q.options[updatedAnswers[q.id]].slug,
      }));

    if (updatedFilteredAnswers.length === quizQuestions.length) {
      localStorage.setItem(
        "quizAnswers",
        JSON.stringify(updatedFilteredAnswers),
      );

      toast.success("Quiz Completed!");
      router.replace("/suggested-products");
      return;
    }

    changeQuiz(questionId);
  };

  const BackHandler = () => {
    if (quizData?.id > 1) {
      changeQuiz(quizData?.id - 2);
    }
  };

  const NextHandler = () => {
    if (quizData?.id < quizQuestions.length) {
      changeQuiz(quizData?.id);
    }
  };

  // if(suggestedProductPopup){
  //   return <SuggestedProducts userAnswers={filteredAnswers}/>
  // }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="my-5 flex w-full max-w-4xl flex-col gap-8 rounded-2xl bg-white p-6 shadow-lg md:my-0 md:p-10">
        {/* Progress */}
        <Field className="w-full">
          <FieldLabel className="flex justify-between text-sm text-gray-600">
            <span>
              Question {quizData?.id} of {quizQuestions.length}
            </span>
            <span>
              {Math.round(
                answers[quizQuestions.length] >= 0
                  ? 100
                  : (quizData.id - 1) * (100 / quizQuestions.length),
              )}
              %
            </span>
          </FieldLabel>
          <Progress
            value={
              answers[quizQuestions.length] >= 0
                ? 100
                : (quizData.id - 1) * (100 / quizQuestions.length)
            }
            className="bg-[#016271]/50 [&>div]:bg-[#016271]"
            id="progress-upload"
          />
        </Field>

        {/* Question */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800 md:text-3xl">
            {quizData?.question}
          </h1>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quizData?.options.map((option: any, index: number) => {
            const Icon = option.icon;

            return (
              <Button
                onClick={() => handleOptionClick(quizData?.id, index)}
                key={index}
                className={`flex h-auto items-center justify-start gap-4 rounded-xl p-4 transition-all ${
                  answers[quizData?.id] === index
                    ? "bg-[#016271] text-white"
                    : "bg-[#9DD8E2] text-white hover:bg-[#016271]"
                }`}
              >
                <div className="rounded-lg bg-white p-2 text-[#016271]">
                  <Icon size={20} />
                </div>
                <span className="font-medium">{option.label}</span>
              </Button>
            );
          })}
        </div>

        <div
          className={`flex w-full items-center justify-between ${quizData?.id == 1 && "justify-end"}`}
        >
          {quizData?.id > 1 && (
            <Button onClick={() => BackHandler()} variant={"ghost"}>
              <ArrowLeft /> Back
            </Button>
          )}

          {quizData?.id < quizQuestions.length && (
            <Button onClick={() => NextHandler()} variant={"ghost"}>
              Next <ArrowRight />
            </Button>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Your answers help us recommend the perfect products for your needs
        </p>
      </div>
    </div>
  );
};

export default Page;
