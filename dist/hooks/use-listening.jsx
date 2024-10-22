"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSpeechRecognition = exports.createSpeechRecognition = void 0;
const react_1 = require("react");
const createSpeechRecognition = ({ onResult, onError, options = {}, // Optional options
 }) => {
    const SpeechRecognition = (window === null || window === void 0 ? void 0 : window.SpeechRecognition) || (window === null || window === void 0 ? void 0 : window.webkitSpeechRecognition);
    if (!SpeechRecognition) {
        throw new Error("Speech Recognition is not supported in this browser.");
    }
    const recognition = new SpeechRecognition();
    // Loop over provided options and apply them to the recognition object
    Object.keys(options).forEach((key) => {
        if (key in recognition) {
            // @ts-ignore - We use `any` because types are dynamically determined
            recognition[key] = options[key];
        }
    });
    // Handle the result event
    recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript;
        const confidence = event.results[lastResultIndex][0].confidence;
        onResult({ transcript, confidence });
    };
    // Handle any errors
    recognition.onerror = onError;
    return recognition;
};
exports.createSpeechRecognition = createSpeechRecognition;
const useSpeechRecognition = ({ key, recognitionOptions, }) => {
    const [listening, setListening] = (0, react_1.useState)(false);
    const [open, setOpen] = (0, react_1.useState)(false);
    const [transcript, setTranscript] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    const [isRecording, setIsRecording] = (0, react_1.useState)(false); // Indicates active recording state
    const recognitionRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!open && key) {
            startPassiveListening();
        }
        if (open && listening)
            startListening(); // If no key, directly start listening
        return () => {
            var _a;
            (_a = recognitionRef.current) === null || _a === void 0 ? void 0 : _a.stop();
        };
    }, [listening, open]);
    // Passive listening to detect the key phrase
    const startPassiveListening = () => {
        var _a;
        recognitionRef.current = (0, exports.createSpeechRecognition)({
            onResult: ({ transcript }) => {
                if (key && transcript.toLowerCase().includes(key.toLowerCase())) {
                    setOpen(true); // Trigger opening based on key phrase
                }
                else {
                    setError(`Please start your command with '${key}'. You said: ${transcript}`);
                }
            },
            onError: (error) => {
                setError(`Speech recognition error: ${error.message}`);
                console.error("Speech recognition error:", error);
            },
            options: recognitionOptions, // Custom options passed into speech recognition
        });
        (_a = recognitionRef.current) === null || _a === void 0 ? void 0 : _a.start();
    };
    // Actively listen to capture speech input
    const startListening = () => {
        if (recognitionRef.current)
            recognitionRef.current.stop();
        recognitionRef.current = (0, exports.createSpeechRecognition)({
            onResult: ({ transcript }) => {
                setTranscript(transcript); // Capture the transcript
                setIsRecording(false); // Set recording state to false when done
            },
            onError: (error) => {
                setError(`Speech recognition error: ${error.message}`);
                console.error("Speech recognition error:", error);
                setIsRecording(false); // Stop recording on error
            },
            options: recognitionOptions,
        });
        recognitionRef.current.start();
        setIsRecording(true); // Indicate that recording has started
    };
    // Stop listening
    const stopListening = () => {
        if (recognitionRef.current)
            recognitionRef.current.stop();
        setListening(false);
        setIsRecording(false); // Stop recording
    };
    return {
        listening, // Listening state
        setListening, // Method to manually set listening state
        open, // Whether the assistant has been triggered
        setOpen,
        transcript, // The captured transcript
        setTranscript,
        error, // Any errors encountered
        setError,
        isRecording, // Whether recording is active
        startListening, // Start the active listening process
        stopListening, // Stop listening
        startPassiveListening, // Start listening passively for the key phrase
    };
};
exports.useSpeechRecognition = useSpeechRecognition;
