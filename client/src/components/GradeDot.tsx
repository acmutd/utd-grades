import type { LetterGrade } from "@utd-grades/db";
import React from "react";
import { getLetterGradeColor } from "../utils";

export default function GradeDot({ grade }: { grade: LetterGrade | null }) {
  return (
    <span
      className={`inline-block h-2 w-2 flex-shrink-0 rounded-full ${grade ? "" : "bg-description opacity-50"}`}
      style={grade ? { backgroundColor: getLetterGradeColor(grade) } : undefined}
    />
  );
}
