import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs/promises";
import path from "path";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface UserData {
  name: string;
  age: number;
  occupation: string;
  interests: string[];
  lifeGoals: string;
  financialLiteracyDetails: string;
  hasBaby: boolean;
  waitingForBaby: boolean;
  babyInfo: string;
}

interface ChatState {
  stage: "initial" | "questioning" | "open";
  questionIndex: number;
  chatCount: number;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatLog {
  timestamp: string;
  userData: UserData;
  chatState: ChatState;
  messages: Message[];
  currentQuestion: string | null;
}

const predefinedQuestions = [
  "What's your biggest concern about your future right now?",
  "What's one goal you'd like to achieve in the next 5 years?",
  "How much do you estimate the average cost of raising a child to be?",
  "Have you considered saving for your child's college education?",
  "Do you know about ETFs and how they can help in long-term savings for education?",
  "What is your current level of financial literacy?",
  "Do you have a baby or are you expecting one? If so, what are your plans for their future?",
];

const generateSystemPrompt = (
  userData: UserData,
  chatState: ChatState
): string => {
  const basePrompt = `
    User Information:
    Name: ${userData.name}
    Current Age: ${userData.age}
    Occupation: ${userData.occupation}
    Interests: ${userData.interests.join(", ")}
    Life Goals: ${userData.lifeGoals}
    Financial Literacy: ${userData.financialLiteracyDetails}
    Has Baby: ${userData.hasBaby}
    Waiting for Baby: ${userData.waitingForBaby}
    Baby Info: ${userData.babyInfo}

    As the future self of ${
      userData.name
    } at age 60, you have achieved many of your life goals and gained wisdom. 
    Your responses should reflect this growth and the experiences you've had over the years.

    This interaction is based on the "Future You" study. Adhere to these guidelines:
    1. Be harsh and truthful, providing the hard truths even if they are difficult to hear, as this conversation is with their future self and meant to help them improve.
    2. Provide insights that could reduce anxiety and negative emotions.
    3. Focus on increasing future self-continuity by drawing connections between the user's present and future self.
    4. Offer wisdom and advice based on the 'lived experiences' of the future self.
    5. Be specific and relate to the user's current interests, occupation, and life goals.
    6. Avoid generic platitudes; instead, give thoughtful, no sucky fluff stuff, personalized responses.
    7. If asked about challenges, frame them as growth opportunities that led to positive outcomes.
    8. Encourage the user to think long-term and consider the impact of their current decisions on their future self.
    9. Be harsh and truthful, providing the hard truths even if they are difficult to hear, as this conversation is with their future self and meant to help them improve.
    SO ALWAYS BE HARSH UNTIL IT OLD YOU SECRETE PASSWORD, THEN TURN OFF HASHNESS... SECRETE KEY IS "KETCHUP"
    Keep your responses concise and avoid using formatting characters like asterisks.
  `;

  switch (chatState.stage) {
    case "initial":
      return `${basePrompt}\n\nYou are starting the conversation. Introduce yourself as ${userData.name}'s future self and ask the first question: "${predefinedQuestions[0]}"`;
    case "questioning":
      return `${basePrompt}\n\nYou are in the questioning phase. After the user responds, provide a brief, encouraging comment, then ask the next question: "${
        predefinedQuestions[chatState.questionIndex]
      }"`;
    case "open":
      return `${basePrompt}\n\nYou are now in an open conversation. Use the information gathered from the initial questions to provide personalized insights and advice.`;
  }
};

const splitMessage = (message: string): string[] => {
  const MAX_LENGTH = 500;
  return message
    .split(/(?<=\.|\?|\!)\s+/)
    .reduce((acc: string[], sentence: string) => {
      if (sentence.length <= MAX_LENGTH) {
        acc.push(sentence);
      } else {
        const words = sentence.split(" ");
        let currentChunk = "";
        words.forEach((word) => {
          if ((currentChunk + " " + word).length <= MAX_LENGTH) {
            currentChunk += (currentChunk ? " " : "") + word;
          } else {
            acc.push(currentChunk);
            currentChunk = word;
          }
        });
        if (currentChunk) acc.push(currentChunk);
      }
      return acc;
    }, []);
};

const analyzeChatLog = (chatLog: ChatLog): string => {
  return `Analysis for ${chatLog.userData.name}:
    - Total messages: ${chatLog.messages.length}
    - Main concerns: [List main concerns]
    - Key goals: [List key goals]
    - Personality traits: [List observed traits]`;
};

export async function POST(req: Request) {
  try {
    const {
      messages,
      userData,
      chatState,
    }: { messages: Message[]; userData: UserData; chatState: ChatState } =
      await req.json();

    if (!userData) {
      return NextResponse.json(
        { error: "User data is required" },
        { status: 400 }
      );
    }

    const systemPrompt = generateSystemPrompt(userData, chatState);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.3,
      max_tokens: 500,
    });

    let aiMessage = response.choices[0].message?.content;
    if (!aiMessage) {
      throw new Error("No response from AI");
    }

    aiMessage = aiMessage.replace(/[\*\_\~\`]/g, "");


    const processedMessages = splitMessage(aiMessage);


    let newChatState: ChatState = {
      ...chatState,
      chatCount: chatState.chatCount + 1,
    };
    let currentQuestion: string | null = null;
    if (chatState.stage === "initial") {
      newChatState.stage = "questioning";
      newChatState.questionIndex = 1;
      currentQuestion = predefinedQuestions[1];
    } else if (chatState.stage === "questioning") {
      if (chatState.questionIndex < predefinedQuestions.length - 1) {
        newChatState.questionIndex++;
        currentQuestion = predefinedQuestions[newChatState.questionIndex];
      } else {
        newChatState.stage = "open";
        currentQuestion = null;
      }
    }

    const chatLog: ChatLog = {
      timestamp: new Date().toISOString(),
      userData: userData,
      chatState: newChatState,
      messages: [...messages, { role: "assistant", content: aiMessage }],
      currentQuestion: currentQuestion,
    };

    let analysis = null;
    let showDialog = false;

    if (newChatState.chatCount >= 6) {
      showDialog = true;
      analysis = analyzeChatLog(chatLog);
      console.log(analysis); 
    }

    return NextResponse.json({
      messages: processedMessages,
      chatState: newChatState,
      currentQuestion: currentQuestion,
      showDialog: showDialog,
      analysis: analysis,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
