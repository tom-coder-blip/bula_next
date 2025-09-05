import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";
import MatchPopup from "../common/MatchPopup"; // ✅ Import the popup component
import "react-toastify/dist/ReactToastify.css";
import "./ChatPage.css";

const MessagesDropdown = ({ onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [popupData, setPopupData] = useState({ isOpen: false, title: "", message: "" });
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?._id || currentUser?.id;

  // ✅ Fetch Conversations (Polling Every 5s)
  useEffect(() => {
    if (!currentUserId) return;

    const fetchConversations = async () => {
      try {
        const res = await api.get("/chat/conversations");

        // ✅ Deduplicate conversations
        const unique = [];
        const seen = new Set();
        for (const convo of res.data) {
          const otherUser = convo.participants.find(
            (p) => String(p._id) !== String(currentUserId)
          );
          if (otherUser && !seen.has(String(otherUser._id))) {
            seen.add(String(otherUser._id));
            unique.push(convo);
          }
        }
        setConversations(unique);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  // ✅ Fetch Incoming Requests (Polling Every 10s)
  useEffect(() => {
    if (!currentUserId) return;

    const fetchRequests = async () => {
      try {
        const res = await api.get("/match-request/my-requests");
        const incoming = res.data.filter(
          (r) => String(r.to._id) === String(currentUserId) && r.status === "pending"
        );

        setIncomingRequests((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(incoming)) {
            return incoming;
          }
          return prev;
        });

        if (incoming.length > incomingRequests.length) {
          toast.info(
            `${incoming[0].from.firstname} ${incoming[0].from.lastname} sent you a match request!`
          );
        }
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };

    fetchRequests();
    const interval = setInterval(fetchRequests, 10000);
    return () => clearInterval(interval);
  }, [currentUserId, incomingRequests.length]);

  // ✅ Accept/Reject Request
  const handleRespond = async (id, action) => {
    try {
      const res = await api.post(`/match-request/respond/${id}`, { action });
      setIncomingRequests(incomingRequests.filter((r) => r._id !== id));

      if (action === "accept") {
        const { learner, mentor } = res.data;

        if (currentUser.role === "learner") {
          setPopupData({
            isOpen: true,
            title: "🎉 New Mentor Added!",
            message: `Congrats! ${mentor.firstname} ${mentor.lastname} is now your mentor.`,
          });
        } else {
          setPopupData({
            isOpen: true,
            title: "🎉 New Learner Added!",
            message: `You are now mentoring ${learner.firstname} ${learner.lastname}.`,
          });
        }
      } else {
        toast.info("❌ Request rejected");
      }
    } catch (err) {
      console.error("Error responding:", err);
      toast.error("Failed to respond");
    }
  };

  return (
    <>
      <div className="messages-dropdown">
        {/* 🔹 Match Requests */}
        {incomingRequests.length > 0 && (
          <div className="requests-section">
            <h4 className="section-title">Match Requests</h4>
            {incomingRequests.map((req) => (
              <div key={req._id} className="request-card">
                <span>
                  {req.from.firstname} {req.from.lastname} wants to match
                </span>
                <div className="request-actions">
                  <button
                    className="btn-accept"
                    onClick={() => handleRespond(req._id, "accept")}
                  >
                    ✅
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => handleRespond(req._id, "reject")}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Conversations */}
        <h4 className="section-title">Messages</h4>
        {conversations.length === 0 ? (
          <p className="empty-text">No recent chats</p>
        ) : (
          conversations.map((convo) => {
            const otherUser =
              convo.participants.find(
                (p) => String(p._id) !== String(currentUserId)
              ) || { firstname: "Unknown", lastname: "" };

            return (
              <div
                key={convo._id}
                className="conversation-item"
                onClick={() => {
                  onClose();
                  navigate(`/chat/${otherUser._id}`);
                }}
              >
                <div className="conversation-left">
                  <span className="conversation-user">
                    {otherUser.firstname} {otherUser.lastname}
                  </span>
                  {convo.unreadCount > 0 && (
                    <span className="unread-badge">{convo.unreadCount}</span>
                  )}
                </div>
                <small className="conversation-time">
                  {new Date(convo.lastMessageAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            );
          })
        )}
      </div>

      {/* POPUP */}
      <MatchPopup
        isOpen={popupData.isOpen}
        title={popupData.title}
        message={popupData.message}
        onClose={() => setPopupData({ ...popupData, isOpen: false })}
      />
    </>
  );
};

export default MessagesDropdown;