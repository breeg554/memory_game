import React, { Component } from "react";
import Menu from "./components/Menu";
import Board from "./components/Board";
import { theme } from "./theme";
import { reactIcons } from "./utils";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
const GlobalStyle = createGlobalStyle`
  body{
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

const Game = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class App extends Component {
  state = {
    isStartGame: false,
    level: "",
  };
  setLevel = (level) => {
    this.setState({
      level,
    });
  };
  stopGame = () => [
    this.setState({
      isStartGame: false,
      level: "",
    }),
  ];
  startGame = () => {
    if (!this.state.level) {
      console.log("wybierz lvl");
      return;
    }
    this.setState({
      isStartGame: true,
    });
  };
  render() {
    const { isStartGame, level } = this.state;

    return (
      <ThemeProvider theme={theme}>
        <Game>
          <GlobalStyle />
          {isStartGame ? (
            <Board data={reactIcons} level={level} stopGame={this.stopGame} />
          ) : (
            <Menu
              choosenLvl={level}
              startGame={this.startGame}
              setLevel={this.setLevel}
            />
          )}
        </Game>
      </ThemeProvider>
    );
  }
}

export default App;
