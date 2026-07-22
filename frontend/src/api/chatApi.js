import axios from "axios";

// axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

export default api;

// ===============================
// SEND QUERY
// ===============================
export const sendQuery = async (query, conversationId) => {
  try {
    const docId = localStorage.getItem("doc_id");

    if (!docId) {
      throw new Error("Upload a PDF first.");
    }

    const payload = {
      query: query,
      doc_id: docId,
    };

    // ✅ only send valid Mongo ObjectId
    if (conversationId && conversationId.length === 24) {
      payload.conversation_id = conversationId;
    }

    console.log("SENDING:", payload);

    const res = await api.post("/query", payload);

    return res.data;

  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    throw err;
  }
};

// ===============================
// GET ALL CONVERSATIONS
// ===============================
export const getAllConversations = async () => {
  try {
    const res = await api.get("/conversations");
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// ===============================
// GET MESSAGES OF A CONVERSATION
// ===============================
export const getConversationMessages = async (conversation_id) => {
  try {
    const res = await api.get(`/conversations/${conversation_id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// ===============================
// UPLOAD PDF (✅ FIXED HERE)
// ===============================
export const uploadPDF = async (file, conversationId) => {
  const formData = new FormData();
  formData.append("file", file);

  // ✅ FIX: now conversationId is passed as parameter
  if (conversationId && conversationId.length === 24) {
    formData.append("conversation_id", conversationId);
  }

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    localStorage.setItem("doc_id", response.data.doc_id);

    return response.data;

  } catch (err) {
    console.error("UPLOAD ERROR:", err.response?.data || err.message);
    throw err;
  }
};

// ===============================
// GET NEW CONVERSATION ID
// ===============================
export const getNewConversationId = async () => {
  try {
    const res = await api.post("/conversations/new_id");
    return res.data.conversation_id;
  } catch (err) {
    console.log(err);
    throw err;
  }
};