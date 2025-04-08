import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submittedIds, setSubmittedIds] = useState(
    JSON.parse(localStorage.getItem("submittedAssessments")) || []
  );

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assessments");
      setAssessments(res.data || []);
    } catch (err) {
      console.error("Error fetching assessments:", err);
      alert("Failed to load assessments.");
    }
  };

  const handleSelectAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setAnswers({});
    setResult(null);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const submitAnswers = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/assessments/submit", {
        assessmentId: selectedAssessment._id,
        answers,
        username: localStorage.getItem("username"), // student username
      });
      setResult(res.data);

      // Track submitted assessments
      const updated = [...submittedIds, selectedAssessment._id];
      setSubmittedIds(updated);
      localStorage.setItem("submittedAssessments", JSON.stringify(updated));
    } catch (err) {
      console.error("Error submitting answers:", err);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/Login"; // or wherever your login page is
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🎓 Student Dashboard</h1>
      <button onClick={logout}>Logout</button>
      <h2>📋 Available Assessments</h2>

      <ul>
        {assessments.filter((a) => !submittedIds.includes(a._id))
          .map((assessment) => (
          <li key={assessment._id}>
            <button onClick={() => handleSelectAssessment(assessment)}>
              {assessment.title}
            </button>
          </li>
        ))}
      </ul>

      {selectedAssessment && selectedAssessment.questions && (
        <div style={{ marginTop: "2rem" }}>
          <h2>{selectedAssessment.title}</h2>
          <p>{selectedAssessment.description}</p>
          

          <h3>📝 Questions</h3>
          {selectedAssessment.questions.map((question, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <p>{index + 1}. {question.questionText}</p>

              {question.options && question.options.length > 0 ? (
                question.options.map((option, optIndex) => (
                  <label key={optIndex} style={{ display: "block" }}>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleAnswerChange(index, option)}
                    />
                    {option}
                  </label>
                ))
              ) : (
                <input
                  type="text"
                  placeholder="Your answer"
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
                />
              )}
            </div>
          ))}

          <button onClick={submitAnswers} style={{ marginTop: "1rem" }}>
            Submit Answers
          </button>
        </div>
      )}

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>✅ Results</h2>
          <p>
            Score: {result.score} / {selectedAssessment.questions.length}
          </p>
          <button onClick={logout}>Logout</button>
        </div>
        
      )}
    </div>
    
  );
};

export default StudentDashboard;
