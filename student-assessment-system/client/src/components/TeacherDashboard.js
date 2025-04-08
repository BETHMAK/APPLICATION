import React, { useState, useEffect } from "react";
import axios from "axios";

const TeacherDashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [newAssessment, setNewAssessment] = useState({
    
    title: "",
    description: "",
    questions: [{ questionText: "", correctAnswer: "" }],
  });

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assessments");
      setAssessments(res.data);
    } catch (err) {
      console.error("Error fetching assessments:", err);
      alert("Failed to load assessments.");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/assessments/submissions");
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    }
  };
  const clearAllResults = async () => {
    const confirmed = window.confirm("Are you sure you want to delete all results?");
    if (!confirmed) return;
  
    try {
      await axios.delete("http://localhost:5000/api/results/clear-all");
      alert("All results have been deleted.");
      // Optionally: Refresh results if they're listed
      // fetchResults();
    } catch (err) {
      console.error("Error deleting all results:", err);
      alert("Failed to delete all results.");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };


  const handleAssessmentChange = (e) => {
    setNewAssessment({ ...newAssessment, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...newAssessment.questions];
    updatedQuestions[index][field] = value;
    setNewAssessment({ ...newAssessment, questions: updatedQuestions });
  };

  const addQuestionField = () => {
    setNewAssessment({
      ...newAssessment,
      questions: [...newAssessment.questions, { questionText: "", correctAnswer: "" }],
    });
  };

  const removeQuestionField = (index) => {
    const updatedQuestions = newAssessment.questions.filter((_, i) => i !== index);
    setNewAssessment({ ...newAssessment, questions: updatedQuestions });
  };

  const addAssessment = async () => {
    if (!newAssessment.title.trim()) {
      alert("Title is required.");
      return;
    }

    if (newAssessment.questions.some(q => !q.questionText?.trim() || !q.correctAnswer?.trim())) {
      alert("All questions and correct answers must be filled.");
      return;
    }

    try {
      console.log("Submitting assessment:", newAssessment);
      const res = await axios.post("http://localhost:5000/api/assessments", newAssessment);
      setAssessments([...assessments, res.data]);

      // Reset form after successful submission
      setNewAssessment({ title: "", description: "", questions: [{ questionText: "", correctAnswer: "" }] });
      alert("Assessment added successfully!");
    } catch (err) {
      console.error("Error adding assessment:", err);
      alert("Failed to add assessment.");
    }
  };

  const deleteAssessment = async (assessmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/assessments/${assessmentId}`);
      setAssessments(assessments.filter((assessment) => assessment._id !== assessmentId));
      alert("Assessment deleted successfully!");
    } catch (err) {
      console.error("Error deleting assessment:", err);
      alert("Failed to delete assessment.");
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>

      {/* Add Assessment & Questions */}
      <div style={{ border: "1px solid #ddd", padding: "20px", marginBottom: "20px", borderRadius: "10px" }}>
        <h2>Create Assessment</h2>
        <input
          type="text"
          name="title"
          value={newAssessment.title}
          onChange={handleAssessmentChange}
          placeholder="Assessment Title"
          required
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <textarea
          name="description"
          value={newAssessment.description}
          onChange={handleAssessmentChange}
          placeholder="Assessment Description"
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
       <button
  onClick={clearAllResults}
  style={{
    backgroundColor: "darkred",
    color: "white",
    padding: "10px",
    marginTop: "20px",
    borderRadius: "5px",
  }}
>
  Clear All Results
</button>

        <h3>Questions</h3>
        {newAssessment.questions.map((question, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              value={question.questionText || ""} // Ensures it's never undefined
              onChange={(e) => handleQuestionChange(index, "questionText", e.target.value)}
              placeholder={`Question ${index + 1}`}
              style={{ width: "60%", padding: "8px" }}
            />
            <input
              type="text"
              value={question.correctAnswer || ""} // Ensures it's never undefined
              onChange={(e) => handleQuestionChange(index, "correctAnswer", e.target.value)}
              placeholder="Correct Answer"
              style={{ width: "30%", padding: "8px", marginLeft: "10px" }}
            />
            {newAssessment.questions.length > 1 && (
              <button
                onClick={() => removeQuestionField(index)}
                style={{ marginLeft: "10px", background: "red", color: "white", padding: "5px" }}
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button onClick={addQuestionField} style={{ marginTop: "10px", background: "green", color: "white", padding: "8px" }}>
          + Add Another Question
        </button>
        <button onClick={addAssessment} style={{ marginLeft: "10px", background: "blue", color: "white", padding: "8px" }}>
          Submit Assessment & Questions
        </button>
      </div>

      <div>
      <h1>Teacher Dashboard</h1>
      <h2>Student Submissions</h2>
      <ul>
        {submissions.map((sub, index) => (
          <li key={index}>
            <strong>{sub.username}</strong> scored {sub.score} in {sub.assessmentTitle}
          </li>
        ))}
      </ul>
    </div>

      {/* Display Assessments */}
      <div>
        <h2>Assessments</h2>
        {assessments.length === 0 ? (
          <p>No assessments available.</p>
        ) : (
          <ul>
            {assessments.map((a) => (
              <li key={a._id} style={{ borderBottom: "1px solid #ddd", paddingBottom: "10px", marginBottom: "10px" }}>
                <strong>{a.title}</strong>: {a.description}
                <ul>
                  {a.questions?.map((q, index) => (
                    <li key={index}>
                      {q.questionText} <em>(Answer: {q.correctAnswer})</em>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => deleteAssessment(a._id)}
                  style={{ background: "red", color: "white", padding: "5px", marginTop: "10px" }}
                >
                  Delete Assessment
                </button>

                <button onClick={logout}>Logout</button>

              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
