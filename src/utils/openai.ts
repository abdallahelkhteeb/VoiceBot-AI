import { ClientOptions, OpenAI as OpenAIConfigure } from "openai";
import { ChatCompletionCreateParams } from "openai/resources/index";
import { SiriMessage } from "../types";
 
export const OpenAI = ({
  configure,
  functions,
}: {
  configure?: ClientOptions;
  functions?: (ChatCompletionCreateParams.Function & {
    trigger: (data: { args?: any; response?: any } | void) => any;
  })[];
}) => {
  const openai = new OpenAIConfigure({
    ...configure,
  });

  // Main function to handle OpenAI requests with functions
  const callChatGPTWithFunctions = async ({
    userMessage,
    existingMessages = [],
    systemRoleContent = "Determine what the user needs to do. If the user is only questioning, answer simply. If the user wants to perform an action & its function is provided, do it. Otherwise, tell them that you as an AI can't do the specific action they want but guide them.",
    args,
  }: {
    userMessage: string;
    existingMessages?: SiriMessage[];
    systemRoleContent?: string;

    args?: any;
  }) => {
    try {
      // Step 1: Append the user's message to the existing conversation history
      const messages: SiriMessage[] = [
        ...existingMessages,
        { role: "user", content: userMessage },
      ];

      // Step 2: Call OpenAI to generate a response based on the full conversation history
      const chat = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: systemRoleContent,
          },
          ...messages,
        ] as unknown as any,
        functions: functions?.map(({ trigger, ...e }) => ({ ...e })),
        function_call: "auto",
      });

      // Step 3: Determine whether ChatGPT wants to use a function
      const wantsToUseFunction =
        chat.choices[0].finish_reason === "function_call";
      let assistantMessage: SiriMessage = { role: "assistant", content: "" };

      // Step 4: Handle function calls if necessary
      if (wantsToUseFunction) {
        const functionCall = chat.choices[0].message?.function_call;

        // Find the corresponding function based on the functionCall name
        const selectedFunction = functions?.find(
          (func) => func.name === functionCall?.name,
        );

        if (
          selectedFunction &&
          functionCall?.name &&
          selectedFunction.trigger
        ) {
          const response = JSON.parse(functionCall?.arguments);
          const content = await selectedFunction?.trigger({
            response,
            args,
          }); // Call the trigger function

          assistantMessage = {
            role: "function",
            name: functionCall?.name,
            content: content,
          };
        }
      } else {
        assistantMessage = {
          role: "assistant",
          content: chat.choices[0].message?.content ?? "No response",
        };
      }

      // Step 5: Append the assistant's response to the conversation history
      return [...messages, assistantMessage];
    } catch (error: any) {
      console.error("Error calling ChatGPT:", error);
      throw new Error(
        error?.["message"] ?? "Something went wrong with the API request.",
      );
    }
  };

  return { openai, callChatGPTWithFunctions };
};
 