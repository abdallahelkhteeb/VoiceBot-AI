export type Window  = {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
export type SpeechRecognitionEvent  = Event & {
    results: SpeechRecognitionResultList;
  }
export type SpeechRecognitionErrorEvent  = Event & {
    results: any;
    error: string;
  } 