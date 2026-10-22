import type { Scenario } from '../../types';

export const askingATeacherForHelp: Scenario = {
  id: "asking-a-teacher-for-help",
  title: "Asking a Teacher for Help",
  titleVi: "Nhờ thầy cô giúp đỡ",
  description: "Bạn không hiểu bài tập về nhà. Sau giờ học, bạn đến hỏi thầy Mr. Lee một cách lịch sự.",
  level: "A2",
  goals: ["Bắt chuyện lịch sự với thầy cô", "Nói rõ bạn không hiểu phần nào", "Xin thêm thời gian hoặc ví dụ"],
  learnerRole: "Student",
  partnerRole: "Mr. Lee (teacher)",
  vocabulary: [
    { word: "homework", meaning: "bài tập về nhà", example: "I have a question about the homework." },
    { word: "understand", meaning: "hiểu", example: "I don't understand question three." },
    { word: "explain", meaning: "giải thích", example: "Could you explain it again, please?" },
    { word: "example", meaning: "ví dụ", example: "Can you give me an example?" },
    { word: "deadline", meaning: "hạn chót", example: "When is the deadline?" },
    { word: "extra time", meaning: "thêm thời gian", example: "Can I have extra time?" },
    { word: "exercise", meaning: "bài tập", example: "Exercise five is difficult." },
    { word: "make sense", meaning: "dễ hiểu, hợp lý", example: "Oh, that makes sense now." },
  ],
  phrases: [
    { en: "Excuse me, Mr. Lee. Do you have a minute?", vi: "Thưa thầy Lee, thầy có rảnh một chút không ạ?" },
    { en: "I don't understand exercise five.", vi: "Em không hiểu bài tập số năm." },
    { en: "Could you explain it again, please?", vi: "Thầy có thể giải thích lại được không ạ?" },
    { en: "Can you give me an example?", vi: "Thầy cho em một ví dụ được không ạ?" },
    { en: "That makes sense now. Thank you!", vi: "Giờ em hiểu rồi. Em cảm ơn thầy!" },
  ],
  dialogue: [
    { speaker: "learner", text: "Excuse me, Mr. Lee. Do you have a minute?", vi: "Thưa thầy Lee, thầy có rảnh một chút không ạ?" },
    { speaker: "partner", text: "Of course. How can I help you?", vi: "Tất nhiên. Thầy giúp gì được em?" },
    { speaker: "learner", text: "I don't understand exercise five in the homework.", vi: "Em không hiểu bài tập số năm trong bài về nhà." },
    { speaker: "partner", text: "OK. You need to use the past simple. For example, “I played football yesterday.”", vi: "Được. Em cần dùng thì quá khứ đơn. Ví dụ: “Hôm qua em đã chơi bóng đá.”" },
    { speaker: "learner", text: "Oh, that makes sense now. When is the deadline?", vi: "À, giờ em hiểu rồi. Hạn nộp là khi nào ạ?" },
    { speaker: "partner", text: "Next Monday.", vi: "Thứ Hai tới." },
    { speaker: "learner", text: "Thank you very much, Mr. Lee.", vi: "Em cảm ơn thầy Lee nhiều ạ." },
    { speaker: "partner", text: "You're welcome. Ask me any time.", vi: "Không có gì. Cứ hỏi thầy bất cứ lúc nào." },
  ],
  tasks: ["Start politely.", "Say what you don't understand.", "Ask for an explanation or example.", "Ask about the deadline and thank the teacher."],
  listening: {
    intro: "Một học sinh hỏi thầy giáo về bài tập về nhà sau giờ học.",
    questions: [
      { type: "mcq", question: "Which exercise is difficult for the student?", options: ["Exercise three", "Exercise five", "Exercise nine"], answer: 1, explanation: "Học sinh nói “I don't understand exercise five.”" },
      { type: "mcq", question: "When is the deadline?", options: ["Tomorrow", "Next Friday", "Next Monday"], answer: 2, explanation: "Thầy nói “Next Monday” – thứ Hai tới." },
      { type: "fill", sentence: "You need to use the past ___.", answer: "simple", explanation: "“Past simple” – thì quá khứ đơn." },
      { type: "fill", sentence: "Oh, that makes ___ now.", answer: "sense", explanation: "“That makes sense” – giờ thì hiểu rồi / hợp lý rồi." },
    ],
  },
  roleplay: {
    start: "minute",
    nodes: [
      {
        id: "minute",
        partner: "Yes? Can I help you?",
        task: "Bắt chuyện lịch sự và nói bạn có câu hỏi về bài tập.",
        hint: "“Excuse me, Mr. Lee. I have a question about the homework.”",
        example: "Excuse me, Mr. Lee. I have a question about the homework.",
        responses: [
          { intent: "have_question", label: "nói có câu hỏi", anyOf: ["question", "homework", "help", "minute", "excuse me", "exercise", "don't understand"], next: "which" },
        ],
      },
      {
        id: "which",
        partner: "Sure. Which part don't you understand?",
        task: "Nói rõ bài tập hoặc phần bạn không hiểu.",
        hint: "“I don't understand exercise five.”",
        example: "I don't understand exercise five.",
        responses: [
          { intent: "say_part", label: "nói phần chưa hiểu", anyOf: ["exercise", "question", "number", "part", "page", "five", "three", "don't understand", "grammar", "past"], next: "explain" },
        ],
      },
      {
        id: "explain",
        partner: "In exercise five, you use the past simple. For example: I played football yesterday. Is that clear?",
        task: "Nói bạn đã hiểu, hoặc xin thêm ví dụ.",
        hint: "“Yes, that makes sense now.” hoặc “Can you give me another example, please?”",
        example: "Yes, that makes sense now. Thank you.",
        responses: [
          { intent: "more_example", label: "xin thêm ví dụ / giải thích lại", anyOf: ["another example", "example", "again", "explain", "not clear", "still", "no", "slowly"], next: "example2" },
          { intent: "clear", label: "xác nhận đã hiểu", anyOf: ["makes sense", "clear", "understand", "i see", "got it", "yes", "ok", "okay", "thank"], next: "deadline" },
        ],
      },
      {
        id: "example2",
        partner: "Of course. Here's another one: She watched TV last night. We add -ed to the verb. Better now?",
        task: "Xác nhận đã hiểu.",
        hint: "“Yes, I understand now. Thank you!”",
        example: "Yes, I understand now. Thank you!",
        responses: [
          { intent: "clear", label: "xác nhận đã hiểu", anyOf: ["understand", "clear", "makes sense", "yes", "i see", "got it", "ok", "okay", "thank", "better"], next: "deadline" },
        ],
      },
      {
        id: "deadline",
        partner: "Good. Do you have any other questions?",
        task: "Hỏi hạn nộp bài hoặc xin thêm thời gian.",
        hint: "“When is the deadline?” hoặc “Can I have extra time, please?”",
        example: "When is the deadline?",
        responses: [
          { intent: "extra_time", label: "xin thêm thời gian", anyOf: ["extra time", "more time", "later", "one more day", "tuesday", "extend"], next: "bye", ack: "Hmm, OK. You can hand it in on Tuesday." },
          { intent: "ask_deadline", label: "hỏi hạn nộp", anyOf: ["deadline", "when", "due", "hand in", "submit"], next: "bye", ack: "It's due next Monday." },
          { intent: "no_more", label: "không còn câu hỏi", anyOf: ["no", "that's all", "nothing"], next: "bye", ack: "OK. Remember, it's due next Monday." },
        ],
      },
      {
        id: "bye",
        partner: "Good luck with your homework!",
        task: "Cảm ơn thầy.",
        hint: "“Thank you very much, Mr. Lee.”",
        example: "Thank you very much, Mr. Lee.",
        responses: [
          { intent: "thank", label: "cảm ơn thầy", anyOf: ["thank", "thanks", "appreciate", "see you", "goodbye", "bye"], next: null, ack: "You're welcome. Ask me any time!" },
        ],
      },
    ],
  },
};
