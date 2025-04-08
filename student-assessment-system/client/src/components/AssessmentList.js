import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AssessmentList = () => {
  const [assessments, setAssessments] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchAssessments = async () => {
      const res = await axios.get("/api/assessments");
      setAssessments(res.data);
    };
    fetchAssessments();
  }, [])

  return (
    <div className="assessment-list">
      <h2>Assessments</h2>
      {role === "teacher" && (
        <Link to="/assessments/create">Create New Assessment</Link>
      )}
      <ul>
        {assessments.map((assessment) => (
          <li key={assessment._id}>
            <Link to={`/assessments/${assessment._id}`}>
              {assessment.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssessmentList;