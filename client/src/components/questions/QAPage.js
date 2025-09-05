import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './QAPage.css';

const QAPage = () => {
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [answerInputs, setAnswerInputs] = useState({});
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState({});
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // === Fetch Qs ===
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/qa');
      setQuestions(res.data.questions || []);
    } catch (err) {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      questions.forEach(async (q) => {
        if (String(currentUser?.id) === String(q.userId?._id)) {
          await api.put(`/qa/${q._id}/mark-seen`);
        }
      });
    }
  }, [questions]);

  // === Handlers ===
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!question.trim()) return setError('Please enter a question.');
    try {
      await api.post('/qa', { question });
      setSuccess('Question submitted!');
      setQuestion('');
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit question');
    }
  };

  const handleSubmitAnswer = async (id) => {
    if (!answerInputs[id]?.trim()) return;
    try {
      await api.put(`/qa/${id}/answer`, { answer: answerInputs[id] });
      setSuccess('Answer submitted!');
      setAnswerInputs(prev => ({ ...prev, [id]: '' }));
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answer');
    }
  };

  const handleEditQuestion = async (id, text) => {
    try {
      await api.put(`/qa/${id}`, { question: text });
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err) {
      setError('Failed to edit question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await api.delete(`/qa/${id}`);
      fetchQuestions();
    } catch (err) {
      setError('Failed to delete question');
    }
  };

  const handleEditAnswer = async (qid, aid, text) => {
    try {
      await api.put(`/qa/${qid}/answer/${aid}`, { answer: text });
      setEditingAnswer({});
      fetchQuestions();
    } catch (err) {
      setError('Failed to edit answer');
    }
  };

  const handleDeleteAnswer = async (qid, aid) => {
    try {
      await api.delete(`/qa/${qid}/answer/${aid}`);
      fetchQuestions();
    } catch (err) {
      setError('Failed to delete answer');
    }
  };

  // === Render ===
  return (
    <div className="qa-container">
      <div className="qa-header">
        <h2>Q&A</h2>
        <p>Ask questions, share answers, and learn together</p>
      </div>

      {token && (
        <form onSubmit={handleSubmitQuestion} className="qa-form">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask a question..."
          />
          <button type="submit">Submit</button>
        </form>
      )}

      {error && <div className="qa-error">{error}</div>}
      {success && <div className="qa-success">{success}</div>}

      <div className="qa-list">
        {loading ? (
          <div>Loading...</div>
        ) : questions.length > 0 ? (
          questions.map(q => (
            <div key={q._id} className="qa-card">
              {/* === Question === */}
              {editingQuestion?.id === q._id ? (
                <div>
                  <input
                    type="text"
                    value={editingQuestion.text}
                    onChange={(e) =>
                      setEditingQuestion({ id: q._id, text: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditQuestion(editingQuestion.id, editingQuestion.text);
                      }
                    }}
                  />
                  <button
                    onClick={() =>
                      handleEditQuestion(editingQuestion.id, editingQuestion.text)
                    }
                  >
                    Save
                  </button>
                  <button onClick={() => setEditingQuestion(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <div className="qa-question">Q: {q.question}</div>
                  <div className="qa-meta">
                    {String(currentUser?.id) === String(q.userId?._id)
                      ? " (by you)"
                      : q.userId
                        ? ` (by ${q.userId.firstname} ${q.userId.lastname})`
                        : " (by Unknown)"}
                  </div>
                  {String(currentUser?.id) === String(q.userId?._id) && (
                    <div>
                      <button
                        onClick={() => setEditingQuestion({ id: q._id, text: q.question })}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteQuestion(q._id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}

              {/* === Answers === */}
              {q.answers && q.answers.length > 0 ? (
                <div>
                  {q.answers.map((a) => (
                    <div
                      key={a._id}
                      className="qa-answer"
                      style={{
                        backgroundColor:
                          String(currentUser?.id) === String(q.userId?._id) && !a.seenByOwner
                            ? "#ffefef"
                            : "#f9fdfc"
                      }}
                    >
                      {editingAnswer[a._id] ? (
                        <div>
                          <input
                            type="text"
                            defaultValue={a.text}
                            onChange={(e) =>
                              setEditingAnswer((prev) => ({ ...prev, text: e.target.value }))
                            }
                          />
                          <button
                            onClick={() =>
                              handleEditAnswer(q._id, a._id, editingAnswer.text || a.text)
                            }
                          >
                            Save
                          </button>
                          <button onClick={() => setEditingAnswer({})}>Cancel</button>
                        </div>
                      ) : (
                        <div>
                          <strong>A:</strong> {a.text}
                          {!a.seenByOwner && String(currentUser?.id) === String(q.userId?._id) && (
                            <span style={{ color: "green", fontWeight: "bold", marginLeft: "6px" }}>
                              NEW
                            </span>
                          )}
                          <div className="qa-meta">
                            {String(currentUser?.id) === String(a.answeredBy?._id || a.answeredBy)
                              ? " (answered by you)"
                              : a.answeredBy?.firstname && a.answeredBy?.lastname
                                ? ` (by ${a.answeredBy.firstname} ${a.answeredBy.lastname})`
                                : " (by Unknown)"}
                          </div>
                          {String(currentUser?.id) === String(a.answeredBy?._id || a.answeredBy) && (
                            <div>
                              <button
                                onClick={() => setEditingAnswer({ [a._id]: true, text: a.text })}
                              >
                                Edit
                              </button>
                              <button onClick={() => handleDeleteAnswer(q._id, a._id)}>Delete</button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="qa-empty">No answers yet</div>
              )}

              {/* === Answer Form === */}
              {token && String(currentUser?.id) !== String(q.userId?._id) && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitAnswer(q._id);
                  }}
                  className="qa-form"
                  style={{ marginTop: "0.5rem" }}
                >
                  <input
                    type="text"
                    value={answerInputs[q._id] || ''}
                    onChange={e => setAnswerInputs(prev => ({ ...prev, [q._id]: e.target.value }))}
                    placeholder="Write an answer..."
                  />
                  <button type="submit">Submit Answer</button>
                </form>
              )}
            </div>
          ))
        ) : (
          <div className="qa-empty">No questions yet</div>
        )}
      </div>
    </div>
  );
};

export default QAPage;