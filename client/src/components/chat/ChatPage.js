import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import "./ChatPage.css";

dayjs.extend(isToday);
dayjs.extend(isYesterday);

const ChatPage = () => {
  const { id } = useParams();
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [file, setFile] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = currentUser
    ? currentUser._id ?? currentUser.id ?? currentUser
    : null;

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const getDateLabel = (date) => {
    const d = dayjs(date);
    if (d.isToday()) return "Today";
    if (d.isYesterday()) return "Yesterday";
    return d.format("dddd, MMM D");
  };

  useEffect(() => {
    if (autoScroll) scrollToBottom();
  }, [messages, autoScroll]);

  // Fetch recipient + conversation
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipient profile
        const res = await api.get(`/users/profiles/${id}`);
        setRecipient(res.data);

        // Always try to fetch the conversation with the other user
        let convoRes;
        try {
          convoRes = await api.get(`/chat/conversations/with/${id}`);
        } catch (err) {
          // Only create if not found (404)
          if (err.response?.status === 404) {
            convoRes = await api.post("/chat/conversations", { recipientId: id });
          } else {
            throw err;
          }
        }
        setConversationId(convoRes.data._id);

        // Fetch messages for the conversation
        const msgRes = await api.get(
          `/chat/conversations/${convoRes.data._id}/messages`
        );
        setMessages(msgRes.data);
      } catch (err) {
        console.error("Error fetching chat data:", err);
      }
    };
    fetchData();
  }, [id, currentUserId]); // <-- add currentUserId to dependencies

  // Poll messages
  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(
          `/chat/conversations/${conversationId}/messages`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  // Mark as read when visiting the page
  useEffect(() => {
    if (!conversationId) return;
    const markAsRead = async () => {
      try {
        await api.patch(`/chat/conversations/${conversationId}/read`);
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            readBy: [...(msg.readBy || []), currentUserId],
          }))
        );
      } catch (err) {
        console.error("Error marking read:", err);
      }
    };
    markAsRead();
  }, [conversationId, currentUserId]);

  const normalizeSenderId = (sender) =>
    sender?._id ? String(sender._id) : typeof sender === "string" ? sender : null;

  const handleScroll = (e) => {
    const target = e.target;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 50;
    setAutoScroll(isAtBottom);
  };

  const handleSend = async () => {
    if ((!text.trim() && !file) || !conversationId) return;

    try {
      if (editingMessage) {
        const res = await api.patch(`/chat/messages/${editingMessage._id}`, {
          body: text,
        });
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === editingMessage._id ? res.data : msg
          )
        );
        setEditingMessage(null);
        setText("");
        return;
      }

      const formData = new FormData();
      if (replyingTo) {
        formData.append("body", ` ${replyingTo.body}\n${text}`);
      } else if (text.trim()) {
        formData.append("body", text);
      }
      if (file) {
        formData.append("image", file);
      }

      await api.post(
        `/chat/conversations/${conversationId}/messages`,
        formData
      );

      // 🔑 Instead of appending manually → re-fetch messages fresh
      const res = await api.get(`/chat/conversations/${conversationId}/messages`);
      setMessages(res.data);

      setText("");
      setFile(null);
      setReplyingTo(null);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleEdit = (msg) => {
    setEditingMessage(msg);
    setText(msg.body);
  };
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setText("");
  };
  const handleDelete = async (msg) => {
    try {
      await api.delete(`/chat/messages/${msg._id}`);
      setMessages((prev) => prev.filter((m) => m._id !== msg._id));
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };
  const handleReply = (msg) => setReplyingTo(msg);
  const handleCancelReply = () => setReplyingTo(null);

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = dayjs(msg.createdAt).format("YYYY-MM-DD");
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="chat-container">
      <h2 className="chat-header">
        💬 Chat with {recipient ? `${recipient.firstname} ${recipient.lastname}` : "..."}
      </h2>

      <div className="chat-messages" onScroll={handleScroll}>
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="chat-date">{getDateLabel(date)}</div>
            {msgs.map((msg, index) => {
              const senderId = normalizeSenderId(msg.sender);
              const isMe = currentUserId && senderId === String(currentUserId);
              const isUnread =
                !isMe && (!msg.readBy || !msg.readBy.includes(currentUserId));

              return (
                <React.Fragment key={msg._id}>
                  <div
                    className={`chat-message-row ${isMe ? "me" : "them"} ${isUnread ? "unread-message" : ""
                      }`}
                  >
                    <div className={`chat-bubble ${isMe ? "me" : "them"}`}>
                      <div className="chat-body">
                        {msg.body && <p>{msg.body}</p>}
                        {msg.imageUrl && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-start",
                            }}
                          >
                            <img
                              src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${msg.imageUrl}`}
                              alt="sent"
                              className="chat-image"
                              style={{
                                maxWidth: "200px",
                                borderRadius: "8px",
                                marginTop: "5px",
                              }}
                              onLoad={() => scrollToBottom(false)}
                            />
                            <a
                              href={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${msg.imageUrl}`}
                              download={`chat-image-${msg._id}`}
                              style={{
                                marginTop: "5px",
                                padding: "5px 8px",
                                borderRadius: "6px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                fontSize: "13px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                textDecoration: "none",
                                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                              }}
                            >
                              ⬇ Download
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="chat-time">
                        {dayjs(msg.createdAt).format("HH:mm")}
                      </div>
                      <div className="chat-options">
                        {isMe ? (
                          <>
                            <span onClick={() => handleEdit(msg)}>✏️ Edit</span>
                            <span onClick={() => handleDelete(msg)}>🗑️ Delete</span>
                            <span>📤 Forward</span>
                          </>
                        ) : (
                          <span onClick={() => handleReply(msg)}>↩️ Reply</span>
                        )}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="chat-reply-banner">
          <span>Replying to: {replyingTo.body}</span>
          <button onClick={handleCancelReply}>✖</button>
        </div>
      )}

      {/* ✅ Show image preview before sending */}
      {file && (
        <div className="chat-preview">
          <p>📎 Attached:</p>
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            style={{ maxWidth: "120px", borderRadius: "6px", marginTop: "5px" }}
          />
          <button onClick={() => setFile(null)}>✖ Remove</button>
        </div>
      )}

      <div className="chat-input-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={editingMessage ? "Editing message..." : "Type a message..."}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {editingMessage ? (
          <>
            <button className="update-btn" onClick={handleSend}>Update</button>
            <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
          </>
        ) : (
          <button className="send-btn" onClick={handleSend}>Send</button>
        )}
      </div>
    </div>
  );
};

export default ChatPage;