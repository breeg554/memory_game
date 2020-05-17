import React from "react";
import styled from "styled-components";
import Button from "./Button";
const LvlBtn = styled.button`
  background-color: ${({ cliked, theme }) =>
    cliked ? theme.colors.green : theme.colors.white};
  padding: 0.5rem 0.2rem;
  font-size: 1rem;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colors.gray};
  transition: 0.1s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.green};
  }
`;

const StyledMenu = styled.div`
  width: 200px;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.gray};
  box-shadow: 3px 7px 21px 6px rgba(51, 51, 51, 0.3);
  padding: 1rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  button {
    cursor: pointer;
    border: none;
    border-radius: 3px;
    margin-bottom: 1rem;
    cursor: pointer;
    &:focus {
      outline: none !important;
    }
  }
`;

const Menu = ({ startGame, setLevel, choosenLvl }) => {
  const levels = [
    { lvl: 1, text: "easy" },
    { lvl: 2, text: "medium" },
    { lvl: 3, text: "hard" },
  ];
  return (
    <StyledMenu>
      {levels.map((btn, index) => (
        <LvlBtn
          onClick={() => setLevel(btn.lvl)}
          key={index}
          lvl={btn.lvl}
          cliked={choosenLvl === btn.lvl ? true : false}
        >
          {btn.text}
        </LvlBtn>
      ))}
      <Button text="start game" click={startGame} />
    </StyledMenu>
  );
};

export default Menu;
