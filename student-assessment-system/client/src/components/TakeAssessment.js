import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TakeAssessment = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchAssessment = async () => {
      const res = await axios.get(`/api/assessments/${id}`);
      setAssessment(res.data);
    };
    fetchAssessment();
  }, [id]);

  const handleSubmit = async () => {
    const score = calculateScore(answers, assessment.questions);
    await axios.post("/api/results", {
      assessment: assessment._id,
      student: localStorage.getItem("userId"),
      score,
    });
    alert(`Your score: ${score}`);
  };

  const calculateScore = (answers, questions) => {
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="take-assessment">
      <h1>{assessment?.title}</h1>
      {assessment?.questions.map((q, i) => (
        <div key={i}>
          <p>{q.questionText}</p>
          {q.options.map((opt, j) => (
            <label key={j}>
              <input
                type="radio"
                name={`question-${i}`}
                value={opt}
                onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default TakeAssessment;