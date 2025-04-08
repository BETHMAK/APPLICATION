import React, { useEffect, useState } from "react";
import axios from "axios";

const Results = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await axios.get(`/api/results/student/${localStorage.getItem("userId")}`);
      setResults(res.data);
    };
    fetchResults();
  }, []);

  return (
    <div className="results">
      <h2>Your Results</h2>
      <ul>
        {results.map((result) => (
          <li key={result._id}>
            <p>Assessment: {result.assessment.title}</p>
            <p>Score: {result.score}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Results;