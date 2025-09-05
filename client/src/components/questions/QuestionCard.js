import React from 'react';
import './QAPage.css';

const QuestionCard = ({ question }) => {
  return (
    <div className="qa-card">
      <div className="qa-question">Q: {question.question}</div>

      {question.answer ? (
        <div className="qa-answer">
          <strong>A:</strong> {question.answer}
        </div>
      ) : (
        <div className="qa-empty">No answer yet</div>
      )}

      {question.createdAt && (
        <div className="qa-meta">
          Asked: {new Date(question.createdAt).toLocaleString()}
        </div>
      )}
      {question.answeredBy && (
        <div className="qa-meta">
          Answered by: {question.answeredBy.name || question.answeredBy.email || 'Mentor'}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
