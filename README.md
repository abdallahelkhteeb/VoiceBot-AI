# VoiceGPT Assistant

The `voicegpt-assistant` package integrates OpenAI's API with custom functions, enabling both voice and text-based interactions with an AI assistant. This guide will walk you through the setup and usage of the assistant within your application.

## Installation

To install the package, run the following command:

```bash
npm install voicegpt-assistant
```

## Usage

### Example

Below is an implementation that demonstrates how to build a basic voice interaction and chat interface using the `useConversation` and `useSpeechRecognition` hooks from the `voicegpt-assistant` package.

```typescript
// lib/siri.ts

import { OpenAI } from "voicegpt-assistant";

/**
 * Define a set of tools (functions) to extend OpenAI's interaction capabilities.
 * Each tool represents a custom function with parameters and a trigger for execution.
 */
const tools = [
  {
    name: "your function name", // The name of the function being defined
    description: "your function description", // A description of what this function does
    parameters: "define parameters", // The expected parameters for the function
    /**
     * Trigger the function with specified arguments or OpenAI response.
     * @param {object} data - Contains arguments from the client or response from OpenAI.
     * @param {any} data.args - Additional arguments passed from the client.
     * @param {any} data.response - The response received from OpenAI's API.
     */
    trigger: async (data: { args?: any; response?: any } | void) => {
      // Function implementation logic goes here
    },
  },
];

/**
 * Initialize and configure OpenAI with custom functions defined in the `tools` array.
 * The AI object contains all custom-defined tools that can be used to interact with OpenAI.
 */
export const {
  openai, // The base OpenAI object configured with API key and options
  ...AI // A spread of all the custom-defined tools
} = OpenAI({
  configure: {
    // Optionally specify your OpenAI organization ID
    // organization: "org-yourorg",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!, // Set your OpenAI API key from the environment
    dangerouslyAllowBrowser: true, // Enable usage in browser environments
  },
  functions: tools, // Register the defined tools (custom functions)
});
```

```typescript
// components/siri.tsx
"use client";

import { useEffect, useState } from "react";
import { useConversation, useSpeechRecognition } from "voicegpt-assistant";
import { AI } from "@/lib/siri";

/**
 * Siri Component
 * This component enables a chat interface allowing users to interact with the AI via voice or text.
 */
export function Siri() {
  const [message, setMessage] = useState(""); // Message input state
  const [loading, setLoading] = useState(false); // Loading state for API calls

  // Hooks from `voicegpt-assistant` to manage conversation history and voice recognition
  const { messages, updateMessages, clearMessages } =
    useConversation("siriMessages");
  const {
    listening, // Listening state for voice recognition
    setListening, // Toggle for activating/deactivating listening
    transcript, // Captured speech transcript
    setTranscript, // Function to reset the transcript
    error, // Speech recognition error
    setError, // Function to reset the error
  } = useSpeechRecognition({
    key: "Hi Siri", // Optional: Key phrase to start listening (for voice control)
    recognitionOptions: {
      lang: "en-US", // Language setting for voice recognition
      continuous: true, // Keep listening continuously for voice input
    },
  });

  /**
   * Effect to update the message when voice transcript is available.
   * Also, handle any errors that occur during speech recognition.
   */
  useEffect(() => {
    if (transcript) {
      setMessage((prevMessage) => prevMessage + " " + transcript); // Append transcript to the message
      setTranscript(null); // Reset the transcript
    }

    if (error) {
      console.error("Speech recognition error:", error); // Log any errors
      setError(null); // Reset the error state
    }
  }, [transcript, error]);

  /**
   * Form submission handler
   * This function handles the submission of messages to the AI using the `AI.callChatGPTWithFunctions` function.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the form from refreshing the page
    if (!message.trim()) return; // Prevent sending empty messages

    setLoading(true); // Start loading state during API call

    // Call OpenAI API with the user's message and update the conversation history
    const updatedMessages = await c.callChatGPTWithFunctions({
      userMessage: message, // The message from the user
      existingMessages: messages, // Previous conversation messages
      args: {}, // Additional arguments (if any)
    });

    if (updatedMessages) {
      updateMessages(updatedMessages); // Update the conversation state with the new messages
      setMessage(""); // Clear the input after the message is sent
    }

    setLoading(false); // End loading state after the API call
  };

  return (
    <div>
      <h1>Chat with AI</h1>

      {/* Display the conversation history */}
      <div className="container h-60 w-full overflow-y-auto border py-4">
        {messages?.length ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`my-4 flex items-center ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <p
                className={`w-fit rounded-md px-2 py-1 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {message.content}
              </p>
            </div>
          ))
        ) : (
          <div className="flex h-full flex-1 items-center justify-center">
            <p>No Messages Yet</p>
          </div>
        )}
      </div>

      {/* Message input and controls */}
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update message state
          placeholder="Message AI..."
          disabled={loading || listening} // Disable the input if loading or listening
          className="min-h-20 w-full"
        />
        <div>
          <button
            type="button"
            onClick={clearMessages}
            disabled={loading || listening}
          >
            Clear History
          </button>
          <button
            type="button"
            onClick={() => setListening((prev) => !prev)}
            disabled={loading}
          >
            {listening ? "Stop Listening" : "Start Listening"}
          </button>
          <button type="submit" disabled={loading || listening}>
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
```

## Features

- **Voice Interaction**: Enables users to communicate with the AI via voice commands.
- **Custom Functions**: Easily extendable with custom API interactions.
- **Chat History**: Maintains a log of the conversation.

## Contributing

To contribute, please fork the repository, make your changes, and submit a pull request.

## Contact

For questions or feedback, feel free to reach out:

- GitHub: [AndullahHassan](https://github.com/abdallahelkhteeb)
- Email: abdullahhassan1342002@gmail.com
