"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAI = void 0;
const openai_1 = require("openai");
const OpenAI = ({ configure, functions, }) => {
    const openai = new openai_1.OpenAI(Object.assign({}, configure));
    // Main function to handle OpenAI requests with functions
    const callChatGPTWithFunctions = (_a) => __awaiter(void 0, [_a], void 0, function* ({ userMessage, existingMessages = [], systemRoleContent = "Determine what the user needs to do. If the user is only questioning, answer simply. If the user wants to perform an action & its function is provided, do it. Otherwise, tell them that you as an AI can't do the specific action they want but guide them.", args, }) {
        var _b, _c, _d, _e;
        try {
            // Step 1: Append the user's message to the existing conversation history
            const messages = [
                ...existingMessages,
                { role: "user", content: userMessage },
            ];
            // Step 2: Call OpenAI to generate a response based on the full conversation history
            const chat = yield openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: systemRoleContent,
                    },
                    ...messages,
                ],
                functions: functions === null || functions === void 0 ? void 0 : functions.map((_a) => {
                    var { trigger } = _a, e = __rest(_a, ["trigger"]);
                    return (Object.assign({}, e));
                }),
                function_call: "auto",
            });
            // Step 3: Determine whether ChatGPT wants to use a function
            const wantsToUseFunction = chat.choices[0].finish_reason === "function_call";
            let assistantMessage = { role: "assistant", content: "" };
            // Step 4: Handle function calls if necessary
            if (wantsToUseFunction) {
                const functionCall = (_b = chat.choices[0].message) === null || _b === void 0 ? void 0 : _b.function_call;
                // Find the corresponding function based on the functionCall name
                const selectedFunction = functions === null || functions === void 0 ? void 0 : functions.find((func) => func.name === (functionCall === null || functionCall === void 0 ? void 0 : functionCall.name));
                if (selectedFunction &&
                    (functionCall === null || functionCall === void 0 ? void 0 : functionCall.name) &&
                    selectedFunction.trigger) {
                    const response = JSON.parse(functionCall === null || functionCall === void 0 ? void 0 : functionCall.arguments);
                    const content = yield (selectedFunction === null || selectedFunction === void 0 ? void 0 : selectedFunction.trigger({
                        response,
                        args,
                    })); // Call the trigger function
                    assistantMessage = {
                        role: "function",
                        name: functionCall === null || functionCall === void 0 ? void 0 : functionCall.name,
                        content: content,
                    };
                }
            }
            else {
                assistantMessage = {
                    role: "assistant",
                    content: (_d = (_c = chat.choices[0].message) === null || _c === void 0 ? void 0 : _c.content) !== null && _d !== void 0 ? _d : "No response",
                };
            }
            // Step 5: Append the assistant's response to the conversation history
            return [...messages, assistantMessage];
        }
        catch (error) {
            console.error("Error calling ChatGPT:", error);
            throw new Error((_e = error === null || error === void 0 ? void 0 : error["message"]) !== null && _e !== void 0 ? _e : "Something went wrong with the API request.");
        }
    });
    return { openai, callChatGPTWithFunctions };
};
exports.OpenAI = OpenAI;
