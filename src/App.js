import React, { useEffect, useRef, useState } from 'react';
import { Header, Input } from 'semantic-ui-react';
import './App.css';

const paragraphGenerator = () => `Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32`.split(' ').sort(() => Math.random() > 0.5 ? 1 : -1)


function Word(props) {
  const { text, correct, active } = props
  console.log("correct", correct);
  if (correct === true) {
    return <span className="correct-word">{text} </span>
  }
  if (correct === false) {
    return <span className="incorrect-word">{text} </span>
  }
  if (active === true) {
    return <span className="active-word">{text} </span>
  }
  return <span>{text} </span>
}
Word = React.memo(Word)

function Timer(props) {
  const { startCounting, correctWords } = props
  const [timeElapsed, setTimeElapsed] = useState(0)
  useEffect(() => {
    let id;
    if (startCounting) {
      id = setInterval(() => {
        setTimeElapsed(oldTime => oldTime + 1)
      }, 1000);
    }
    return () => {
      clearInterval(id)
    }
  }, [props.startCounting])
  const minutes = timeElapsed / 60
  return (
    <>
      <h1>{timeElapsed}</h1>
      <h1>{correctWords / minutes || 0} WPM</h1>
    </>
  )
}


function App() {

  const getParagraph = useRef(paragraphGenerator())
  console.log(getParagraph.current.toString());
  const [word, setWord] = useState("")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [correctWordsArr, setCorrectWordsArr] = useState([])
  const [startCounting, setStartCounting] = useState(false)

  const processInput = (evt) => {
    if (!startCounting) {
      setStartCounting(true)
    }
    if ((evt.target.value).endsWith(" ")) {
      if(currentWordIndex === getParagraph.current.length) {
        setStartCounting(false)
        setWord('Done!')
        return
      }
      setCurrentWordIndex((currentWordIndex) => currentWordIndex + 1)
      setWord('')
      setCorrectWordsArr((data) => {
        const newArr = [...data]
        if (evt.target.value.trim() === getParagraph.current[currentWordIndex]) {
          newArr[currentWordIndex] = true
        }
        else {
          newArr[currentWordIndex] = false
        }
        return newArr
      })
    }
    else {
      setWord(evt.target.value)
    }
  }

  return (
    <div className="App">
      <Header as='h1'>Typing test</Header>
      <Timer startCounting={startCounting}
        correctWords={correctWordsArr.filter(Boolean).length}
      />
      <Header as='h4'>{getParagraph.current.map((item, index) => {
        return <Word
          text={item}
          active={index === currentWordIndex}
          correct={correctWordsArr[index]}
        />
      })}
      </Header>
      <Input value={word} onChange={processInput} placeholder='Search...' />
    </div>
  );
}

export default App;
