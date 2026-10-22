import type { Scenario } from '../../types';

export const talkingAboutHobbies: Scenario = {
  id: "talking-about-hobbies",
  title: "Talking About Hobbies",
  titleVi: "Nói về sở thích",
  description: "Giờ ra chơi, bạn và Sam nói chuyện về sở thích, tần suất và lý do bạn thích chúng.",
  level: "A2",
  goals: ["Nói sở thích với “like / love / enjoy + V-ing”", "Nói tần suất (every day, twice a week)", "Giải thích lý do với “because”"],
  learnerRole: "Student",
  partnerRole: "Sam (classmate)",
  vocabulary: [
    { word: "hobby", meaning: "sở thích", example: "What's your hobby?" },
    { word: "enjoy", meaning: "thích, tận hưởng", example: "I enjoy drawing animals." },
    { word: "every weekend", meaning: "mỗi cuối tuần", example: "I play badminton every weekend." },
    { word: "twice a week", meaning: "hai lần một tuần", example: "I go swimming twice a week." },
    { word: "because", meaning: "bởi vì", example: "I like music because it makes me happy." },
    { word: "relaxing", meaning: "thư giãn", example: "Reading is relaxing." },
    { word: "exciting", meaning: "thú vị, hào hứng", example: "Football is exciting." },
    { word: "be good at", meaning: "giỏi về", example: "I'm good at drawing." },
  ],
  phrases: [
    { en: "What do you do in your free time?", vi: "Bạn làm gì lúc rảnh?" },
    { en: "I love playing badminton.", vi: "Mình rất thích chơi cầu lông." },
    { en: "I play it twice a week.", vi: "Mình chơi hai lần một tuần." },
    { en: "Because it's relaxing.", vi: "Vì nó thư giãn." },
    { en: "Do you want to play together?", vi: "Bạn có muốn chơi cùng không?" },
  ],
  dialogue: [
    { speaker: "partner", text: "What do you do in your free time?", vi: "Bạn làm gì lúc rảnh?" },
    { speaker: "learner", text: "I love playing badminton.", vi: "Mình rất thích chơi cầu lông." },
    { speaker: "partner", text: "Cool! How often do you play?", vi: "Hay đấy! Bạn chơi thường xuyên không?" },
    { speaker: "learner", text: "I play it twice a week, with my sister.", vi: "Mình chơi hai lần một tuần, với chị gái." },
    { speaker: "partner", text: "Why do you like it?", vi: "Sao bạn thích nó?" },
    { speaker: "learner", text: "Because it's exciting and good for my health. What about you?", vi: "Vì nó thú vị và tốt cho sức khỏe. Còn bạn?" },
    { speaker: "partner", text: "I enjoy drawing. I draw every evening.", vi: "Mình thích vẽ. Tối nào mình cũng vẽ." },
    { speaker: "learner", text: "That's nice! Can you show me your pictures?", vi: "Hay quá! Bạn cho mình xem tranh được không?" },
  ],
  tasks: ["Say your hobby.", "Say how often you do it.", "Give a reason with “because”.", "Ask your friend about their hobby."],
  listening: {
    intro: "Hai bạn học sinh nói chuyện về sở thích trong giờ ra chơi.",
    questions: [
      { type: "mcq", question: "How often does the student play badminton?", options: ["Every day", "Twice a week", "Once a month"], answer: 1, explanation: "Bạn ấy nói “I play it twice a week” – hai lần một tuần." },
      { type: "mcq", question: "What is Sam's hobby?", options: ["Drawing", "Swimming", "Singing"], answer: 0, explanation: "Sam nói “I enjoy drawing” – mình thích vẽ." },
      { type: "fill", sentence: "Because it's ___ and good for my health.", answer: "exciting", explanation: "“Exciting” – thú vị, hào hứng." },
      { type: "fill", sentence: "I draw every ___.", answer: "evening", explanation: "“Every evening” – mỗi buổi tối." },
    ],
  },
  roleplay: {
    start: "hobby",
    nodes: [
      {
        id: "hobby",
        partner: "What do you do in your free time?",
        task: "Nói sở thích của bạn.",
        hint: "“I love / like / enjoy + V-ing.” Ví dụ: “I enjoy reading comics.”",
        example: "I love playing badminton.",
        responses: [
          { intent: "give_hobby", label: "nói sở thích", anyOf: ["like", "love", "enjoy", "hobby", "play", "playing", "read", "reading", "draw", "drawing", "watch", "watching", "listen", "music", "games", "swim", "swimming", "cook", "cooking", "dance", "dancing", "sing", "singing"], next: "often", ack: "Cool!" },
          { intent: "no_hobby", label: "nói chưa có sở thích", anyOf: ["nothing", "don't know", "not sure", "sleep"], next: "suggest", ack: "Haha, OK." },
        ],
      },
      {
        id: "suggest",
        partner: "Maybe you can try drawing or badminton. Which one sounds fun?",
        task: "Chọn một hoạt động và nói lý do.",
        hint: "“Badminton sounds fun because I like sports.”",
        example: "Badminton sounds fun because I like sports.",
        responses: [
          { intent: "choose", label: "chọn hoạt động", anyOf: ["drawing", "draw", "badminton", "both", "fun", "sounds"], next: "why" },
        ],
      },
      {
        id: "often",
        partner: "How often do you do it?",
        task: "Nói bạn làm việc đó thường xuyên thế nào.",
        hint: "“every day”, “twice a week”, “on weekends”, “sometimes”.",
        example: "I play it twice a week.",
        responses: [
          { intent: "frequency", label: "nói tần suất", anyOf: ["every", "day", "week", "weekend", "weekends", "once", "twice", "times", "sometimes", "often", "always", "usually", "month", "evening", "morning"], next: "why" },
        ],
      },
      {
        id: "why",
        partner: "Why do you like it?",
        task: "Giải thích lý do bằng “because”.",
        hint: "“Because it's fun / relaxing / exciting / good for my health.”",
        example: "Because it's exciting and good for my health.",
        responses: [
          { intent: "reason", label: "giải thích lý do", anyOf: ["because", "fun", "relaxing", "exciting", "interesting", "happy", "health", "healthy", "friends", "makes me"], next: "askback", better: "Because it's fun and it makes me happy." },
        ],
      },
      {
        id: "askback",
        partner: "Nice! I love it when people have a hobby.",
        task: "Hỏi lại Sam về sở thích của bạn ấy.",
        hint: "“What about you?” hoặc “What's your hobby, Sam?”",
        example: "What about you, Sam? What's your hobby?",
        responses: [
          { intent: "ask_back", label: "hỏi lại bạn", anyOf: ["what about you", "and you", "how about you", "your hobby", "what do you", "do you like"], next: "invite", ack: "I enjoy drawing. I draw every evening." },
        ],
      },
      {
        id: "invite",
        partner: "Maybe we can do something together this weekend!",
        task: "Đồng ý và gợi ý một hoạt động.",
        hint: "“Sure! Let's play badminton on Saturday.”",
        example: "Sure! Let's play badminton on Saturday.",
        responses: [
          { intent: "accept", label: "đồng ý / gợi ý", anyOf: ["sure", "yes", "ok", "okay", "let's", "great", "good idea", "saturday", "sunday", "together"], next: null, ack: "Great! See you this weekend!" },
          { intent: "decline", label: "từ chối lịch sự", anyOf: ["sorry", "busy", "can't", "maybe", "next"], next: null, ack: "No problem. Maybe another time!" },
        ],
      },
    ],
  },
};
