import React, { Component } from "react";
import styled from "styled-components";
import { AiOutlineQuestion } from "react-icons/ai";

const Modal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SideWrapper = styled.div`
  color: #333;
  background-color: #fff;
  padding: 1rem;
  text-align: center;
`;
const FinishModal = ({ level, time, finishGame }) => {
  return (
    <Modal>
      <SideWrapper>
        <p>Time: {time}</p>
        <p>Best Time: {localStorage.getItem(`${level}Time`) || time}</p>
        <button onClick={() => finishGame()}>Back to menu</button>
      </SideWrapper>
    </Modal>
  );
};

const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;
const MainCard = styled.button`
  position: absolute;
  background-color: transparent;
  border: none;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: all 0.3s ease-in-out;
  transform: ${({ clicked }) => (clicked ? "rotateY(180deg)" : null)};

  div {
    top: 0;
    left: 0;
    border-radius: 3px;
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    font-size: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const FrontCard = styled.div`
  color: ${({ theme }) => theme.colors.white};
  background-color: #333;
`;
const BackCard = styled.div`
  transition: 0.2s ease-in-out;
  color: ${({ check }) => (check ? "#222" : "#333")};
  background-color: ${({ check }) => (check ? "#444" : "#fff")};
  transform: rotateY(180deg);
`;
const Card = ({ data, index, clicked, check, handleOpenCard }) => {
  return (
    <CardWrapper>
      <MainCard
        disabled={check}
        clicked={clicked}
        onClick={() => {
          if (check) return;
          handleOpenCard(data.id, index);
        }}
      >
        <FrontCard>
          <AiOutlineQuestion />
        </FrontCard>
        <BackCard check={check}>{data.icon}</BackCard>
      </MainCard>
    </CardWrapper>
  );
};
const StatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: #fff;
  h1 {
    font-weight: normal;
  }
`;

const BackBtn = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: transparent;
  cursor: pointer;
  border: none;
  font-size: 1rem;
  width: 25px;
  height: 25px;
  text-align: center;
  line-height: 25px;
  color: #fff;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
const StyledBoard = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.gray};
  padding: 1rem;
`;
const Wrapper = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(${({ columnSize }) => columnSize}, 80px);
  grid-template-rows: repeat(${({ rowSize }) => rowSize}, 100px);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
`;
class Board extends Component {
  constructor(props) {
    super(props);
    this.record = localStorage.getItem(`${this.props.level}Time`) || "00:00";
    this.interval = "";
    this.state = {
      randomCards: [],
      openCards: [],
      isFinish: false,
      minutes: 0,
      seconds: 0,
    };
  }
  startStoper = () => {
    this.setState((prev) => {
      return {
        minutes: prev.seconds + 1 === 60 ? prev.minutes + 1 : prev.minutes,
        seconds: prev.seconds + 1 === 60 ? 0 : prev.seconds + 1,
      };
    });
  };
  shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };
  createRandomCards = () => {
    const { data, level } = this.props;
    const elements = [...data];
    let size;
    let doubleElements = [];

    if (level === 1) {
      size = 7;
    } else if (level === 2) {
      size = 11;
    } else {
      size = 17;
    }
    while (size >= 0) {
      const randomInt = this.getRandomInt(0, elements.length);
      doubleElements.push({ ...elements[randomInt] });
      doubleElements.push({ ...elements[randomInt] });
      elements.splice(randomInt, 1);
      size--;
    }
    doubleElements = this.shuffle(doubleElements);

    return doubleElements;
  };

  handleOpenCard = (id, index) => {
    const { openCards, randomCards } = this.state;

    if (openCards.length === 2) {
      return;
    } else {
      const tmpCards = [...randomCards];
      tmpCards[index].clicked = true;

      this.setState(
        {
          openCards: [...openCards, { id, index }],
          randomCards: tmpCards,
        },
        () => {
          if (this.state.openCards.length === 2) {
            setTimeout(() => this.checkIfTheSame(), 800);
          }
        }
      );
    }
  };
  checkIfTheSame = () => {
    const { openCards, randomCards } = this.state;
    const tmpCards = [...randomCards];
    if (
      tmpCards[openCards[0].index].id === tmpCards[openCards[1].index].id &&
      openCards[0].index !== openCards[1].index
    ) {
      tmpCards[openCards[0].index].check = true;
      tmpCards[openCards[1].index].check = true;
    } else {
      tmpCards[openCards[0].index].clicked = false;
      tmpCards[openCards[1].index].clicked = false;
    }

    this.setState(
      {
        randomCards: tmpCards,
        openCards: [],
      },
      this.isFinish
    );
  };
  compareTime = (actual, last) => {
    if (!last) {
      return actual;
    }
    const tmpActualSec = actual.slice(3, actual.length);
    const tmpActualMin = actual.slice(0, 2);
    const tmpLastSec = last.slice(3, last.length);
    const tmpLastMin = last.slice(0, 2);

    if (tmpActualMin > tmpLastMin) {
      return last;
    } else if (tmpActualMin === tmpLastMin) {
      if (tmpActualSec > tmpLastSec) {
        return last;
      } else {
        return actual;
      }
    } else {
      return actual;
    }
  };
  isFinish = () => {
    const { level } = this.props;
    const isEnd = this.state.randomCards.filter((card) => !card.check);
    if (isEnd.length === 0) {
      clearInterval(this.interval);
      const time = this.formatTime();
      const bestTime = this.compareTime(
        time,
        localStorage.getItem(`${level}Time`)
      );
      localStorage.setItem(`${level}Time`, bestTime);

      this.setState({
        isFinish: true,
      });
    }
  };
  componentDidMount() {
    this.setState({
      randomCards: this.createRandomCards(),
    });
    this.interval = setInterval(this.startStoper, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  formatTime = () => {
    const { seconds, minutes } = this.state;
    let tmpSec = seconds;
    let tmpMin = minutes;
    if (tmpSec.toString().length < 2) tmpSec = "0" + tmpSec;
    if (tmpMin.toString().length < 2) tmpMin = "0" + tmpMin;

    return `${tmpMin}:${tmpSec}`;
  };
  render() {
    const { level, stopGame } = this.props;
    const { randomCards, isFinish } = this.state;
    const time = this.formatTime();
    return (
      <StyledBoard>
        <StatsWrapper>
          <div>
            <h1>Level: {level}</h1>
            <p>Time: {time}</p>
          </div>
          <p>Best Time: {this.record}</p>
          <BackBtn onClick={stopGame}>X</BackBtn>
        </StatsWrapper>
        <Wrapper columnSize={randomCards.length / 4} rowSize={4}>
          {randomCards.map((icon, index) => (
            <Card
              clicked={icon.clicked}
              check={icon.check}
              key={index}
              index={index}
              data={icon}
              handleOpenCard={this.handleOpenCard}
            />
          ))}
        </Wrapper>
        {isFinish ? (
          <FinishModal finishGame={stopGame} level={level} time={time} />
        ) : null}
      </StyledBoard>
    );
  }
}

export default Board;
