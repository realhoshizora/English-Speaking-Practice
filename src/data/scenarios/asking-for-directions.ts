import type { Scenario } from '../../types';

export const askingForDirections: Scenario = {
  id: "asking-for-directions",
  title: "Asking for Directions",
  titleVi: "Hỏi đường",
  description: "Bạn đang ở một thành phố mới và cần tìm đường tới bảo tàng. Bạn hỏi một người qua đường.",
  level: "A2",
  goals: ["Hỏi đường lịch sự", "Hiểu chỉ dẫn: rẽ trái, rẽ phải, đi thẳng", "Xác nhận lại và cảm ơn"],
  learnerRole: "Tourist",
  partnerRole: "Local person",
  vocabulary: [
    { word: "excuse me", meaning: "xin lỗi (để bắt chuyện)", example: "Excuse me, where is the museum?" },
    { word: "go straight", meaning: "đi thẳng", example: "Go straight for two blocks." },
    { word: "turn left", meaning: "rẽ trái", example: "Turn left at the bank." },
    { word: "turn right", meaning: "rẽ phải", example: "Turn right at the traffic lights." },
    { word: "next to", meaning: "bên cạnh", example: "It's next to the post office." },
    { word: "opposite", meaning: "đối diện", example: "The bank is opposite the park." },
    { word: "far", meaning: "xa", example: "Is it far from here?" },
    { word: "on foot", meaning: "đi bộ", example: "It's ten minutes on foot." },
  ],
  phrases: [
    { en: "Excuse me, how can I get to the museum?", vi: "Xin lỗi, làm sao để đến bảo tàng?" },
    { en: "Is it far from here?", vi: "Nó có xa đây không?" },
    { en: "Turn left at the traffic lights.", vi: "Rẽ trái ở chỗ đèn giao thông." },
    { en: "Could you say that again, please?", vi: "Bạn có thể nói lại được không?" },
    { en: "Thank you for your help.", vi: "Cảm ơn bạn đã giúp đỡ." },
  ],
  dialogue: [
    { speaker: "learner", text: "Excuse me. How can I get to the museum?", vi: "Xin lỗi. Làm sao để đến bảo tàng ạ?" },
    { speaker: "partner", text: "Go straight for two blocks, then turn left at the traffic lights.", vi: "Đi thẳng hai dãy nhà, rồi rẽ trái ở đèn giao thông." },
    { speaker: "learner", text: "Turn left at the traffic lights?", vi: "Rẽ trái ở đèn giao thông ạ?" },
    { speaker: "partner", text: "Yes. The museum is next to the post office.", vi: "Đúng. Bảo tàng ở cạnh bưu điện." },
    { speaker: "learner", text: "Is it far from here?", vi: "Có xa đây không ạ?" },
    { speaker: "partner", text: "No, it's about ten minutes on foot.", vi: "Không, đi bộ khoảng mười phút." },
    { speaker: "learner", text: "Great. Thank you for your help!", vi: "Tuyệt. Cảm ơn bạn đã giúp!" },
    { speaker: "partner", text: "You're welcome. Enjoy your visit!", vi: "Không có gì. Chúc bạn tham quan vui vẻ!" },
  ],
  tasks: ["Start politely with “Excuse me”.", "Ask how to get to a place.", "Check the directions.", "Ask if it is far and say thank you."],
  listening: {
    intro: "Một du khách hỏi đường tới bảo tàng. Hãy nghe kỹ các chỉ dẫn.",
    questions: [
      { type: "mcq", question: "Where should the tourist turn left?", options: ["At the bank", "At the traffic lights", "At the park"], answer: 1, explanation: "Người chỉ đường nói “turn left at the traffic lights” – rẽ trái ở đèn giao thông." },
      { type: "mcq", question: "What is next to the museum?", options: ["The post office", "The school", "The hospital"], answer: 0, explanation: "“The museum is next to the post office” – bảo tàng ở cạnh bưu điện." },
      { type: "fill", sentence: "Go ___ for two blocks.", answer: "straight", explanation: "“Go straight” – đi thẳng." },
      { type: "fill", sentence: "It's about ten minutes on ___.", answer: "foot", explanation: "“On foot” – đi bộ." },
    ],
  },
  roleplay: {
    start: "start",
    nodes: [
      {
        id: "start",
        partner: "Hi there. You look lost. Can I help you?",
        task: "Hỏi đường tới bảo tàng (museum) một cách lịch sự.",
        hint: "“Excuse me. How can I get to the museum?” hoặc “Where is the museum, please?”",
        example: "Excuse me. How can I get to the museum?",
        responses: [
          { intent: "ask_way", label: "hỏi đường", anyOf: ["how can i get", "how do i get", "where is", "where's", "museum", "the way to", "looking for"], next: "directions" },
        ],
      },
      {
        id: "directions",
        partner: "Go straight for two blocks, then turn left at the traffic lights.",
        task: "Nhắc lại để kiểm tra, hoặc nhờ nói lại.",
        hint: "“Turn left at the traffic lights?” hoặc “Could you say that again, please?”",
        example: "Turn left at the traffic lights?",
        responses: [
          { intent: "repeat_request", label: "nhờ nói lại", anyOf: ["again", "repeat", "sorry", "slowly", "pardon"], next: "directions_again" },
          { intent: "check", label: "nhắc lại để xác nhận", anyOf: ["left", "traffic lights", "two blocks", "straight", "turn"], next: "landmark", ack: "Yes, that's right." },
          { intent: "understood", label: "xác nhận đã hiểu", anyOf: ["ok", "okay", "i see", "got it", "understand", "thank"], next: "landmark", ack: "Good." },
        ],
      },
      {
        id: "directions_again",
        partner: "Sure. Go straight. Two blocks. Then turn left at the traffic lights.",
        task: "Nhắc lại chỉ dẫn hoặc nói bạn đã hiểu.",
        hint: "“OK. Straight, then left at the traffic lights.”",
        example: "OK. Go straight, then turn left at the traffic lights.",
        responses: [
          { intent: "check", label: "xác nhận chỉ dẫn", anyOf: ["left", "traffic lights", "straight", "ok", "okay", "i see", "got it", "thank"], next: "landmark", ack: "That's right." },
        ],
      },
      {
        id: "landmark",
        partner: "The museum is next to the post office. You can't miss it.",
        task: "Hỏi xem có xa không.",
        hint: "“Is it far from here?” hoặc “How long does it take on foot?”",
        example: "Is it far from here?",
        responses: [
          { intent: "ask_distance", label: "hỏi khoảng cách", anyOf: ["far", "how long", "minutes", "walk", "on foot", "near", "close"], next: "thanks" },
          { intent: "ask_bus", label: "hỏi đi xe buýt", anyOf: ["bus", "taxi", "car", "bike"], next: "thanks", ack: "You don't need a bus." },
        ],
      },
      {
        id: "thanks",
        partner: "It's about ten minutes on foot.",
        task: "Cảm ơn người chỉ đường.",
        hint: "“Great. Thank you for your help!”",
        example: "Great. Thank you for your help!",
        responses: [
          { intent: "thank", label: "cảm ơn", anyOf: ["thank", "thanks", "appreciate", "great", "perfect"], next: null, ack: "You're welcome. Enjoy your visit!" },
        ],
      },
    ],
  },
};
