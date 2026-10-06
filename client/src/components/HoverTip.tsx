import React, { type ReactNode } from "react";

export const STUDENTS_TIP = {
  title: "Total students",
  body: "Everyone in the section, including W, P, CR, NC, I, and NF grades",
};
export const MEAN_TIP = { title: "Mean GPA", body: "Average GPA of students who received a letter grade" };
export const MEDIAN_TIP = { title: "Median grade", body: "Middle grade of students who received a letter grade" };

interface HoverTipProps {
  title: string;
  body: string;
  children: ReactNode;
}

// Same style as the grade distribution chart's tooltip (see SectionContent's chart options).
export default function HoverTip({ title, body, children }: HoverTipProps) {
  return (
    <span className="group relative inline-block">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-0 z-50 mb-2 w-max max-w-[230px] rounded-md bg-[#1f1f1f] px-2.5 py-1.5 text-left font-gilroy-regular text-[12px] leading-snug text-white shadow-[0_4px_12px_rgba(0,0,0,0.25)] group-hover:visible"
      >
        <span className="block font-gilroy-semibold">{title}</span>
        {body}
        <span className="absolute left-3 top-full h-2 w-2 -translate-y-1 rotate-45 bg-[#1f1f1f]" />
      </span>
    </span>
  );
}
