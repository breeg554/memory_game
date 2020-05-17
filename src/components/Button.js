import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 0.5rem 0.2rem;
  font-size: 1rem;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.gray};
  transition: 0.1s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.green};
  }
`;
const Button = ({ text, click }) => {
  return <StyledButton onClick={() => click()}>{text}</StyledButton>;
};

export default Button;
