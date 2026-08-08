import api from "./api";

// sending query
export const sendQuery = async (
  query,
  conversationId,
  docId
) => {
  try {
    if (!query?.trim()) {
      throw new Error("Query is required.")
    }

    if (!conversationId) {
      throw new Error("Conversation ID is required.")
    }

    if (!docId) {
      throw new Error(
        "No PDF is linked to this conversation. Upload a PDF first."
      )
    }

    const payload = {
      query: query.trim(),
      conversation_id: conversationId,
      doc_id: docId
    }

    console.log("SENDING:", payload)

    const response = await api.post("/query", payload)

    return response.data
  } catch (err) {


    throw err
  }
}


// get all conversations
export const getAllConversations = async () => {
  try {
    const res = await api.get("/conversations");
    return res.data;
  } catch (err) {
    throw err;
  }
};

// get messages for a specific conversation
export const getConversationMessages = async (conversation_id) => {
  try {
    const res = await api.get(`/conversations/${conversation_id}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// upload PDF
export const uploadPDF = async (file, conversationId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("conversation_id", conversationId);


  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    localStorage.setItem("doc_id", response.data.doc_id);


    return response.data;

  } catch (err) {
    throw err;
  }
};

// get new conversation ID for new chat
export const getNewConversationId = async () => {
  try {
    const res = await api.post("/conversations/new_id");
    return res.data.conversation_id;
  } catch (err) {
    throw err;
  }
};

export const deleteConversationById = async (conversation_id) => {
  try {
    const response = await api.post(`/delete/${conversation_id}`)

    return response.data
  } catch(err) {
    throw err
  }
}