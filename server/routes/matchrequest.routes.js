import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { sendRequest, respondRequest, listRequests } from "../controllers/matchrequest.controller.js";

const router = express.Router();

router.post("/request/:toId", verifyToken, sendRequest); // Send match request
router.post("/respond/:requestId", verifyToken, respondRequest); // Accept/Reject
router.get("/my-requests", verifyToken, listRequests); // Get incoming + outgoing requests

export default router;