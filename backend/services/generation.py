import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_answer(query: str, chunks: list, history: list = None):
    # 🔹 Build structured context
    if chunks:
        context = "\n\n".join(
            [c.get("text", "") for c in chunks]
        )
    else:
        context = "No relevant context found."

    # 🔹 System prompt (stronger + safer)
    messages = [
        {
            "role": "system",
            "content": (
                "Use the provided context to answer the question.\n"
                "Try your best to infer the answer from the context.\n"
                "If the context is partially relevant, still attempt an answer.\n"
                "If no useful information exists at all, say:\n"
                "'I couldn't find relevant information in the document.'\n"
                "Keep answers clear and concise."
            )
        }
    ]

    # 🔹 Add recent conversation history (safe usage)
    if history:
        for msg in history[-6:]:  # limit history to avoid overload
            role = msg.get("role")
            content = msg.get("content")

            if role in ["user", "assistant"] and content:
                messages.append({
                    "role": role,
                    "content": content
                })

    # 🔹 Add current query with context
    messages.append({
        "role": "user",
        "content": f"""
Use the following context to answer the question.

{context}

Question:
{query}
"""
    })

    # 🔹 Call Groq API
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.2
    )

    return response.choices[0].message.content.strip()