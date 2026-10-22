import type { Scenario } from '../../types';

export const makingPlans: Scenario = {
  id: "making-plans",
  title: "Making Plans with Friends",
  titleVi: "Lên kế hoạch với bạn bè",
  description: "Bạn rủ Mai đi chơi cuối tuần. Hai bạn chọn hoạt động, thời gian và nơi gặp nhau.",
  level: "B1",
  goals: ["Rủ bạn và gợi ý hoạt động", "Đồng ý, từ chối hoặc đề xuất phương án khác", "Chốt thời gian và địa điểm"],
  learnerRole: "Friend",
  partnerRole: "Mai (friend)",
  vocabulary: [
    { word: "free", meaning: "rảnh", example: "Are you free on Saturday?" },
    { word: "How about…?", meaning: "… thì sao?", example: "How about going to the cinema?" },
    { word: "Let's…", meaning: "Hãy cùng…", example: "Let's meet at the park." },
    { word: "sounds good", meaning: "nghe hay đấy", example: "That sounds good!" },
    { word: "instead", meaning: "thay vào đó", example: "Let's go on Sunday instead." },
    { word: "meet", meaning: "gặp", example: "Where should we meet?" },
    { word: "in front of", meaning: "phía trước", example: "Let's meet in front of the cinema." },
    { word: "busy", meaning: "bận", example: "Sorry, I'm busy on Saturday." },
  ],
  phrases: [
    { en: "Are you free this weekend?", vi: "Cuối tuần này bạn rảnh không?" },
    { en: "How about watching a movie?", vi: "Đi xem phim thì sao?" },
    { en: "That sounds great!", vi: "Nghe tuyệt đấy!" },
    { en: "Let's meet at ten o'clock.", vi: "Mình gặp nhau lúc mười giờ nhé." },
    { en: "See you on Sunday!", vi: "Hẹn gặp bạn Chủ nhật!" },
  ],
  dialogue: [
    { speaker: "learner", text: "Hi Mai! Are you free this weekend?", vi: "Chào Mai! Cuối tuần này bạn rảnh không?" },
    { speaker: "partner", text: "I'm busy on Saturday, but I'm free on Sunday. Why?", vi: "Thứ Bảy mình bận, nhưng Chủ nhật thì rảnh. Sao thế?" },
    { speaker: "learner", text: "How about going to the cinema on Sunday?", vi: "Chủ nhật đi xem phim nhé?" },
    { speaker: "partner", text: "That sounds great! What time?", vi: "Nghe tuyệt đấy! Mấy giờ?" },
    { speaker: "learner", text: "Let's meet at two o'clock.", vi: "Mình gặp nhau lúc hai giờ nhé." },
    { speaker: "partner", text: "OK. Where should we meet?", vi: "Được. Mình gặp nhau ở đâu?" },
    { speaker: "learner", text: "In front of the cinema.", vi: "Trước cửa rạp chiếu phim." },
    { speaker: "partner", text: "Perfect. See you on Sunday!", vi: "Hoàn hảo. Hẹn gặp bạn Chủ nhật!" },
  ],
  tasks: ["Ask if your friend is free.", "Suggest an activity.", "Agree on a time.", "Agree on a meeting place."],
  listening: {
    intro: "Hai người bạn lên kế hoạch đi chơi cuối tuần. Hãy nghe kỹ thời gian và địa điểm.",
    questions: [
      { type: "mcq", question: "When is Mai free?", options: ["On Saturday", "On Sunday", "Both days"], answer: 1, explanation: "Mai nói “I'm busy on Saturday, but I'm free on Sunday.”" },
      { type: "mcq", question: "Where will they meet?", options: ["At the park", "At school", "In front of the cinema"], answer: 2, explanation: "Họ gặp nhau “in front of the cinema” – trước cửa rạp phim." },
      { type: "fill", sentence: "Let's meet at ___ o'clock.", answer: "two", accept: ["2"], explanation: "Họ hẹn lúc hai giờ – “two o'clock”." },
      { type: "fill", sentence: "That ___ great!", answer: "sounds", explanation: "“That sounds great” – nghe tuyệt đấy." },
    ],
  },
  roleplay: {
    start: "free",
    nodes: [
      {
        id: "free",
        partner: "Hey! What's up?",
        task: "Hỏi Mai có rảnh cuối tuần không.",
        hint: "“Are you free this weekend?”",
        example: "Hi Mai! Are you free this weekend?",
        responses: [
          { intent: "ask_free", label: "hỏi bạn có rảnh không", anyOf: ["free", "busy", "weekend", "saturday", "sunday", "plans", "doing"], next: "suggest", ack: "I'm busy on Saturday, but I'm free on Sunday." },
        ],
      },
      {
        id: "suggest",
        partner: "What do you want to do?",
        task: "Gợi ý một hoạt động.",
        hint: "“How about going to the cinema?” / “Let's play badminton.” / “Why don't we go to the park?”",
        example: "How about going to the cinema on Sunday?",
        responses: [
          { intent: "cinema", label: "gợi ý đi xem phim", anyOf: ["cinema", "movie", "film", "movies"], next: "time", ack: "That sounds great! I want to see the new cartoon." },
          { intent: "outdoor", label: "gợi ý hoạt động ngoài trời", anyOf: ["park", "badminton", "football", "bike", "cycling", "swim", "swimming", "picnic", "walk"], next: "weather", ack: "Hmm, maybe." },
          { intent: "other", label: "gợi ý hoạt động", anyOf: ["how about", "let's", "why don't we", "shopping", "cafe", "coffee", "library", "museum", "study"], next: "time", ack: "Sure, sounds fun!" },
        ],
      },
      {
        id: "weather",
        partner: "But it might rain on Sunday. Do you have another idea?",
        task: "Đề xuất một hoạt động trong nhà thay thế.",
        hint: "“OK. How about watching a movie instead?”",
        example: "OK. How about watching a movie instead?",
        responses: [
          { intent: "indoor", label: "đề xuất phương án khác", anyOf: ["instead", "cinema", "movie", "film", "museum", "library", "cafe", "mall", "shopping", "indoor", "my house", "how about", "let's"], next: "time", ack: "Good idea!" },
          { intent: "keep_plan", label: "giữ kế hoạch cũ", anyOf: ["umbrella", "it's ok", "don't worry", "anyway", "still"], next: "time", ack: "OK, I'll bring an umbrella!" },
        ],
      },
      {
        id: "time",
        partner: "What time should we meet?",
        task: "Đề xuất thời gian gặp.",
        hint: "“Let's meet at two o'clock.” / “How about ten in the morning?”",
        example: "Let's meet at two o'clock.",
        responses: [
          { intent: "suggest_time", label: "đề xuất giờ", anyOf: ["o'clock", "am", "pm", "morning", "afternoon", "evening", "noon", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "half past", "thirty"], next: "place", ack: "OK, that works for me." },
        ],
      },
      {
        id: "place",
        partner: "Where should we meet?",
        task: "Đề xuất địa điểm gặp.",
        hint: "“In front of the cinema.” / “At the bus stop near my house.”",
        example: "Let's meet in front of the cinema.",
        responses: [
          { intent: "place", label: "đề xuất địa điểm", anyOf: ["in front of", "at the", "near", "next to", "bus stop", "school", "gate", "my house", "your house", "station", "cinema", "park", "cafe"], next: "confirm" },
        ],
      },
      {
        id: "confirm",
        partner: "Perfect. Should I invite Nam too?",
        task: "Trả lời và chào tạm biệt.",
        hint: "“Sure, the more the merrier! See you on Sunday.”",
        example: "Sure! See you on Sunday.",
        responses: [
          { intent: "yes_invite", label: "đồng ý mời thêm", anyOf: ["yes", "sure", "of course", "good idea", "ok", "okay", "great", "why not"], next: null, ack: "Great! I'll text him. See you on Sunday!" },
          { intent: "no_invite", label: "từ chối nhẹ nhàng", anyOf: ["no", "just us", "next time", "maybe not", "two of us"], next: null, ack: "OK, just the two of us then. See you on Sunday!" },
        ],
      },
    ],
  },
};
