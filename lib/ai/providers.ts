import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { google } from "@ai-sdk/google";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";
import { isTestEnvironment } from "../constants";

const model = google('gemini-2.5-flash');

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": model,
        "chat-model-reasoning": wrapLanguageModel({
          model: model,
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": model,
        "artifact-model": model,
      },
    });
