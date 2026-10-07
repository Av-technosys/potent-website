"use client";

import WhileYoureHereSection from "./WhileYoureHereSection";

interface OvyPromosProps {
  onOpenQuiz?: () => void;
}

export default function OvyPromos({ onOpenQuiz }: OvyPromosProps) {
  return <WhileYoureHereSection onOpenQuiz={onOpenQuiz} brandTheme="ovy" />;
}

