import { Window } from "../types";
export declare const createSpeechRecognition: ({ onResult, onError, options, }: {
    onResult: (result: {
        transcript: string;
        confidence: number;
    }) => void;
    onError: (error: any) => void;
    options?: Partial<Window["SpeechRecognition"]>;
}) => any;
export declare const useSpeechRecognition: ({ key, recognitionOptions, }: {
    key?: string;
    recognitionOptions?: Window["SpeechRecognition"];
}) => {
    listening: boolean;
    setListening: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    transcript: string | null;
    setTranscript: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    error: string | null;
    setError: import("react").Dispatch<import("react").SetStateAction<string | null>>;
    isRecording: boolean;
    startListening: () => void;
    stopListening: () => void;
    startPassiveListening: () => void;
};
