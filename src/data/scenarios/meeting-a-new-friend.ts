import type { Scenario } from '../../types';

export const meetingANewFriend: Scenario = {
  id: "meeting-a-new-friend",
  title: "Meeting a New Friend",
  titleVi: "Làm quen bạn mới",
  description: "Ở câu lạc bộ tiếng Anh, bạn gặp một bạn mới tên Alex và bắt chuyện làm quen.",
  level: "A1",
  goals: ["Chào hỏi và hỏi tên bạn mới", "Hỏi và trả lời về trường lớp", "Hẹn gặp lại"],
  learnerRole: "Club member",
  partnerRole: "Alex (new friend)",
  vocabulary: [
    { word: "club", meaning: "câu lạc bộ", example: "I'm in the English club." },
    { word: "grade", meaning: "lớp (khối)", example: "I'm in grade eight." },
    { word: "favorite", meaning: "yêu thích nhất", example: "My favorite subject is math." },
    { word: "subject", meaning: "môn học", example: "Science is a fun subject." },
    { word: "too", meaning: "cũng vậy", example: "I like music too." },
    { word: "see you", meaning: "hẹn gặp lại", example: "See you next week!" },
    { word: "really", meaning: "thật sao / thật sự", example: "Really? Me too!" },
    { word: "new here", meaning: "mới đến đây", example: "I'm new here." },
  ],
  phrases: [
    { en: "Hi! I'm Lan. What's your name?", vi: "Chào! Mình là Lan. Bạn tên gì?" },
    { en: "Which grade are you in?", vi: "Bạn học lớp mấy?" },
    { en: "My favorite subject is English.", vi: "Môn học yêu thích của mình là tiếng Anh." },
    { en: "Me too!", vi: "Mình cũng vậy!" },
    { en: "See you next week!", vi: "Hẹn gặp lại tuần sau!" },
  ],
  dialogue: [
    { speaker: "partner", text: "Hi! I'm Alex. I'm new here.", vi: "Chào! Mình là Alex. Mình mới đến đây." },
    { speaker: "learner", text: "Hi, Alex! I'm Lan. Welcome to the English club.", vi: "Chào Alex! Mình là Lan. Chào mừng bạn đến câu lạc bộ tiếng Anh." },
    { speaker: "partner", text: "Thanks! Which grade are you in?", vi: "Cảm ơn! Bạn học lớp mấy?" },
    { speaker: "learner", text: "I'm in grade eight. What about you?", vi: "Mình học lớp 8. Còn bạn?" },
    { speaker: "partner", text: "I'm in grade eight too! What's your favorite subject?", vi: "Mình cũng học lớp 8! Môn học yêu thích của bạn là gì?" },
    { speaker: "learner", text: "My favorite subject is English. I love speaking with people.", vi: "Môn yêu thích của mình là tiếng Anh. Mình thích nói chuyện với mọi người." },
    { speaker: "partner", text: "Really? Mine is art. Let's practice English together.", vi: "Thật à? Môn của mình là mỹ thuật. Mình cùng luyện tiếng Anh nhé." },
    { speaker: "learner", text: "Sure! See you next week.", vi: "Được chứ! Hẹn gặp lại tuần sau." },
  ],
  tasks: ["Greet a new friend and say your name.", "Ask which grade they are in.", "Talk about your favorite subject.", "Say goodbye."],
  listening: {
    intro: "Lan gặp Alex, một bạn mới ở câu lạc bộ tiếng Anh. Hãy nghe cuộc trò chuyện.",
    questions: [
      { type: "mcq", question: "Which grade is Alex in?", options: ["Grade seven", "Grade eight", "Grade nine"], answer: 1, explanation: "Alex nói “I'm in grade eight too!” – cũng học lớp 8." },
      { type: "mcq", question: "What is Alex's favorite subject?", options: ["English", "Math", "Art"], answer: 2, explanation: "Alex nói “Mine is art” – môn của mình là mỹ thuật." },
      { type: "fill", sentence: "Hi! I'm Alex. I'm ___ here.", answer: "new", explanation: "“I'm new here” nghĩa là “Mình mới đến đây”." },
      { type: "fill", sentence: "Sure! See you next ___.", answer: "week", explanation: "“See you next week” – hẹn gặp lại tuần sau." },
    ],
  },
  roleplay: {
    start: "greet",
    nodes: [
      {
        id: "greet",
        partner: "Hi! I'm Alex. I'm new here.",
        task: "Chào Alex, nói tên bạn và chào mừng bạn ấy.",
        hint: "“Hi, Alex! I'm … Welcome to the club.”",
        example: "Hi, Alex! I'm Lan. Welcome to the English club.",
        responses: [
          { intent: "greet_name", label: "chào và giới thiệu tên", anyOf: ["i'm", "my name", "name is", "welcome", "hi", "hello", "nice to meet you"], next: "grade" },
        ],
      },
      {
        id: "grade",
        partner: "Thanks! Which grade are you in?",
        task: "Nói bạn học lớp mấy và hỏi lại Alex.",
        hint: "“I'm in grade … What about you?”",
        example: "I'm in grade eight. What about you?",
        responses: [
          { intent: "grade_ask_back", label: "nói lớp và hỏi lại", anyOf: ["what about you", "and you", "how about you"], next: "subject", ack: "I'm in grade eight too!" },
          { intent: "give_grade", label: "nói lớp", anyOf: ["grade", "class", "year", "i'm in"], next: "subject", ack: "Cool. I'm in grade eight.", better: "I'm in grade eight. What about you? (hỏi lại để cuộc trò chuyện tiếp tục)" },
        ],
      },
      {
        id: "subject",
        partner: "What's your favorite subject?",
        task: "Nói môn học yêu thích của bạn.",
        hint: "“My favorite subject is …” – ví dụ: math, English, science, art, music, P.E.",
        example: "My favorite subject is English.",
        responses: [
          { intent: "same_subject", label: "nói môn học yêu thích", anyOf: ["art"], next: "together", ack: "Really? Mine is art too!" },
          { intent: "give_subject", label: "nói môn học yêu thích", anyOf: ["favorite", "favourite", "english", "math", "maths", "science", "music", "history", "geography", "literature", "p e", "pe", "i like", "i love"], next: "together", ack: "Nice! Mine is art." },
        ],
      },
      {
        id: "together",
        partner: "Let's practice English together after club. Is that OK?",
        task: "Đồng ý hoặc từ chối lịch sự, rồi chào tạm biệt.",
        hint: "“Sure! See you next week.” hoặc “Sorry, I'm busy today. Maybe next week?”",
        example: "Sure! See you next week.",
        responses: [
          { intent: "agree", label: "đồng ý", anyOf: ["sure", "yes", "ok", "okay", "great", "good idea", "of course", "see you"], next: null, ack: "Awesome! See you next week, Lan!" },
          { intent: "decline", label: "từ chối lịch sự", anyOf: ["sorry", "busy", "can't", "maybe", "next time", "no"], next: null, ack: "No problem. Maybe next week then. Bye!" },
        ],
      },
    ],
  },
};
