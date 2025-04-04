import React from "react";
import { useTheme } from "../utils/theme";
import { FaSun, FaMoon } from "react-icons/fa";
import styled from "styled-components";

const ToggleButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  color: var(--text-color);
  transition: color 0.3s;

  &:hover {
    color: var(--primary-color);
  }
`;

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle Theme">
      {theme === "light" ? <i><FaSun /></i> : <i><FaMoon /></i>}
    </ToggleButton>
  );
};

export default ThemeToggle;