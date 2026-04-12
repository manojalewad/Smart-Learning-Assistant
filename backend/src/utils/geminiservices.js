import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";


// Initialize Gemini
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error(
    "FATAL ERROR: GEMINI_API_KEY is not set in the environment variables."
  );
  process.exit(1);
}

/**
 * Generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - Number of flashcards
 * @returns {Promise<Array<{question: string, answer: string, difficulty: string}>>}
 */
export const generateFlashcards = async (text, count = 10) => {
  const prompt = `Generate exactly ${count} educational flashcards from the following text.

Format each flashcard as:

Q: [Clear, specific question]
A: [Concise, accurate answer]
D: [Difficulty level: easy, medium, or hard]

Separate each flashcard with "----"

Text:
${text.substring(0, 15000)}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedText = response.text;

    // Parse response
    const flashcards = [];
    const cards = generatedText.split("----").filter((c) => c.trim());

    for (const card of cards) {
      const lines = card.trim().split("\n");

      let question = "";
      let answer = "";
      let difficulty = "medium";

      for (const line of lines) {
        if (line.startsWith("Q:")) {
          question = line.substring(2).trim();
        } else if (line.startsWith("A:")) {
          answer = line.substring(2).trim();
        } else if (line.startsWith("D:")) {
          const diff = line.substring(2).trim().toLowerCase();

          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }
      }

      if (question && answer) {
        flashcards.push({ question, answer, difficulty });
      }
    }

    // Return flashcards
    return flashcards.slice(0, count);
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to generate flashcards");
  }
};

/**
 * Generate quiz questions
 * @param {string} text – Document text
 * @param {number} numQuestions – Number of questions
 * @returns {Promise<Array<{question: string, options: Array, correctanswer: string, explanation: string, difficulty: string}>>}
 */
export const generateQuiz = async (text, numQuestions = 5) => {

  const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.

Format each question as:

Q: [Question]

01: [Option 1]
02: [Option 2]
03: [Option 3]
04: [Option 4]

C: [Correct option  exactly as written above]

E: [Brief explanation]

D: [Difficulty: easy, medium, or hard]

Separate questions with "----"

Text:
${text.substring(0, 15000)}
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedText = response.text;

    const questions = [];

    const questionBlocks = generatedText
      .split("----")
      .filter(q => q.trim());

    for (const block of questionBlocks) {

      const lines = block.trim().split("\n");

      let question = "";
      let options = [];
      let correctanswer = "";
      let explanation = "";
      let difficulty = "medium";

      for (const line of lines) {

        const trimmed = line.trim();

        if (trimmed.startsWith("Q:")) {
          question = trimmed.substring(2).trim();
        }

        else if (trimmed.match(/^0\d:/)) {
          options.push(trimmed.substring(3).trim());
        }

        else if (trimmed.startsWith("C:")) {
          correctanswer = trimmed.substring(2).trim();
        }

        else if (trimmed.startsWith("E:")) {
          explanation = trimmed.substring(2).trim();
        }

        else if (trimmed.startsWith("D:")) {
          const diff = trimmed.substring(2).trim().toLowerCase();

          if (["easy", "medium", "hard"].includes(diff)) {
            difficulty = diff;
          }
        }

      }

      if (question && options.length === 4 && correctanswer) {

        questions.push({
          question,
          options,
          correctanswer,
          explanation,
          difficulty
        });

      }

    }

    return questions.slice(0, numQuestions);

  }

  catch (error) {

    console.error("Gemini API error:", error);
    throw new Error("Failed to generate quiz");

  }

};

/**
 * Generate document summary
 * @param {string} text – Document text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) => {

  const prompt = `Provide a concise summary of the following text, highlighting the key concepts and main ideas.
Keep the summary clear and structured.

Text:
${text.substring(0, 20000)}
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedText = response.text;

    return generatedText;

  } 
  catch (error) {

    console.error("Gemini API error:", error);
    throw new Error("Failed to generate summary");

  }

};

/**
 * Chat with document context
 * @param {string} question – User question
 * @param {Array<Object>} chunks – Relevant document chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks) => {

  const context = chunks
    .map((c, i) => `[Chunk ${i + 1}]\n${c.content}`)
    .join("\n\n");

  const prompt = `Based on the following context from a document, analyse the context and answer the user's question.

If the answer is not in the context, say so.

Context:
${context}

Question:
${question}

Answer:
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedText = response.text;

    return generatedText;

  } 
  catch (error) {

    console.error("Gemini API error:", error);
    throw new Error("Failed to process chat request");

  }

};

/**
 * Explain a specific concept
 * @param {string} concept – Concept to explain
 * @param {string} context – Relevant context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {

  const prompt = `Explain the concept of "${concept}" based on the following context.

Provide a clear, educational explanation that is easy to understand.
Include examples if relevant.

Context:
${context.substring(0, 10000)}
`;

  try {

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const generatedText = response.text;

    return generatedText;

  } 
  catch (error) {

    console.error("Gemini API error:", error);
    throw new Error("Failed to explain concept");

  }

};