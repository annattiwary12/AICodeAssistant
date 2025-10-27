import OpenAI from "openai";

// Reference from javascript_openai blueprint
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

// This is using OpenAI's API, which points to OpenAI's API servers and requires your own API key.
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
