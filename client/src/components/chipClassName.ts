export function chipClassName(selected: boolean): string {
  return `inline-flex cursor-pointer items-center gap-1.5 rounded bg-chip px-2 py-[0.3rem] font-gilroy-regular text-[13px] font-medium text-fg [transition:all_0.2s_ease-in-out] hover:-translate-y-px hover:bg-chip-hover disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:bg-chip ${
    selected
      ? "shadow-[inset_0_-3px_0_var(--select-tag),0_2px_6px_1px_rgba(0,0,0,0.16)]"
      : "shadow-[0_2px_6px_1px_rgba(0,0,0,0.16)] hover:shadow-[0_4px_10px_1px_rgba(0,0,0,0.22)] disabled:hover:shadow-[0_2px_6px_1px_rgba(0,0,0,0.16)]"
  }`;
}
