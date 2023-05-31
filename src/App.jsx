import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { Buffer } from 'buffer';

function App() {
  const [questions, setQuestions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const API_URL = `https://opentdb.com/api.php?amount=10&encode=base64&category=${selectedCategory}&difficulty=${difficulty}&type=multiple`;
  const API_CAT_URL = `https://opentdb.com/api_category.php`;

  useEffect(() => {
    async function fetchQuestions() {
      const response = await axios.get(API_URL);
      const decodedQuestions = response.data.results.map((question) => {
        const decodedQuestion = decodeURIComponent(Buffer.from(question.question, 'base64').toString());
const decodedAnswers = question.incorrect_answers.map((answer) =>
    decodeURIComponent(Buffer.from(answer, 'base64').toString())
);

        return {
          ...question,
          question: decodedQuestion,
          incorrect_answers: decodedAnswers,
          correct_answer: decodeURIComponent(Buffer.from(question.correct_answer, 'base64').toString()
          ),
        };
      });
      setQuestions(decodedQuestions);
    }
    fetchQuestions();
  }, [API_URL]);

  useEffect(() => {
    async function fetchCategories() {
      const response = await axios.get(API_CAT_URL);
      setCategories(response.data.trivia_categories);
    }
    fetchCategories();
  }, [API_CAT_URL]);

  function handleCategoryChange(event) {
    setSelectedCategory(event.target.value);
  }

  function handleDifficultyChange(event) {
    setDifficulty(event.target.value);
  }

  function handleAnswerOptionClick(isCorrect) {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  }

  function handlePlayAgainClick() {
    setShowScore(false);
    setScore(0);
    setCurrentQuestion(0);
  }

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homepage">
      {showScore ? (
        <div className="card">
          <div className="card-body">
            <h3>You scored {score} out of {questions.length}</h3>
            <button onClick={handlePlayAgainClick}>Play Again</button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
              <div className="selection-card">
             <h3>Select a category:</h3>
             <select value={selectedCategory} onChange={handleCategoryChange}>
               <option value="">Any Category</option>
               {categories.map(category => (
                 <option key={category.id} value={category.id}>{category.name}</option>
               ))}
             </select>
             <h5>Choose Difficulty:</h5>
                 <select className="form-select" value={difficulty} onChange={handleDifficultyChange}>
                   <option value="easy">Easy</option>
                   <option value="medium">Medium</option>
                   <option value="hard">Hard</option>
             </select>
           </div> 
            <h2>Question {currentQuestion + 1}</h2>
          </div>
          <div className="card-body">
            <h3>{questions[currentQuestion].question}</h3>
            {questions[currentQuestion].incorrect_answers.map((answer, index) => (
              <button
                key={index}

                onClick={() => handleAnswerOptionClick(false)}
              >
                {answer}
              </button>
            ))}
            <button
              onClick={() => handleAnswerOptionClick(true)}
            >
              {questions[currentQuestion].correct_answer}
            </button>
          </div>
        </div>
      )}
</div>
);
}


export default App;
