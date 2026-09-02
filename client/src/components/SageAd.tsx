import styled from "styled-components";

const SageLogo = styled.img`
  height: 1.2rem;
  margin-right: 0.4rem;
  filter: drop-shadow(0 0 4px rgb(0 0 0 / 0.6));
`;

const SageTextMark = styled.img`
  height: 1.2rem;
`;
const SageLink = styled.a`
  background: linear-gradient(90deg, rgba(7,67,37,1) 0%, rgba(22,50,36,1) 100%);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 1.2rem;
  margin-bottom: 0.3rem;
  border-radius: 100rem;
  color: #5AED86;
  text-shadow: 0 0 4px rgb(0 0 0 / 0.6);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
  transition: transform cubic-bezier(0.4, 0, 0.2, 1) 150ms, box-shadow cubic-bezier(0.4, 0, 0.2, 1) 150ms;
  &:hover {
    color: #5AED86;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
    transform: scale(1.01);
  }
`;

const SageText = styled.p`
  line-height: 1.2rem;
  margin-bottom: 0;
  font-size: 0.9rem;
`;

export default function SageAd() {
return(
    <div style={{ marginTop: "16px", textAlign: "center" }}>
        <SageLink href="https://utdsage.com/" target="_blank">
          <SageLogo src="/SAGE-Logo.svg" />
          <SageText>Get AI-powered UTD advising with </SageText>
          <SageTextMark src="/SAGE-Textmark.svg" />
        </SageLink>
    </div>
      )}
