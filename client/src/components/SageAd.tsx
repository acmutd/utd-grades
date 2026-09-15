export default function SageAd() {
  return (
    <div style={{ marginTop: "16px", textAlign: "center" }}>
      <a
        href="https://utdsage.com/"
        target="_blank"
        rel="noreferrer"
        className="mb-1 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[rgba(7,67,37,1)] to-[rgba(22,50,36,1)] px-5 py-2.5 text-[#5AED86] shadow-[0_2px_6px_rgb(0_0_0_/_0.2)] transition-[transform,box-shadow] duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] [text-shadow:0_0_4px_rgb(0_0_0_/_0.6)] hover:scale-[1.01] hover:text-[#5AED86] hover:shadow-[0_2px_8px_rgb(0_0_0_/_0.2)]"
      >
        <img
          src="/SAGE-Logo.svg"
          alt=""
          className="mr-1.5 h-[1.2rem] drop-shadow-[0_0_4px_rgb(0_0_0_/_0.6)]"
        />
        <p className="mb-0 text-[0.9rem] leading-[1.2rem]">Get AI-powered UTD advising with </p>
        <img src="/SAGE-Textmark.svg" alt="Sage" className="h-[1.2rem]" />
      </a>
    </div>
  );
}
