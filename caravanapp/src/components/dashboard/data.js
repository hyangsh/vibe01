// Dummy data for the host dashboard statistics
export const summaryStats = {
  totalRevenueMonth: 9850,
  pendingRequests: 12,
  upcomingCheckIns: 5,
  averageRating: 4.8,
};

export const monthlyEarningsData = [
  { name: "Jan", earnings: 4000 },
  { name: "Feb", earnings: 3000 },
  { name: "Mar", earnings: 5000 },
  { name: "Apr", earnings: 4500 },
  { name: "May", earnings: 6000 },
  { name: "Jun", earnings: 8000 },
];

export const occupancyRateData = [
  { name: "Occupancy", value: 75, fill: "#8884d8" },
];

// Dummy data for the messaging interface
export const conversations = [
  {
    id: 1,
    guest: {
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    lastMessage: "Sounds great, thank you!",
    timestamp: "10:40 AM",
    unread: 2,
  },
  {
    id: 2,
    guest: {
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    lastMessage: "I have a question about the amenities.",
    timestamp: "9:30 AM",
    unread: 0,
  },
  {
    id: 3,
    guest: {
      name: "Peter Jones",
      avatar: "https://randomuser.me/api/portraits/men/35.jpg",
    },
    lastMessage: "See you then!",
    timestamp: "Yesterday",
    unread: 0,
  },
];

export const messages = {
  1: [
    {
      from: "guest",
      text: "Hi, I am excited about my upcoming trip!",
      time: "10:30 AM",
    },
    {
      from: "host",
      text: "Hi John, we are looking forward to hosting you!",
      time: "10:32 AM",
    },
    {
      from: "guest",
      text: "I just wanted to confirm the check-in time.",
      time: "10:35 AM",
    },
    {
      from: "host",
      text: "Check-in is anytime after 3 PM. We have a self-check-in process, I will send you the details on the day of your arrival.",
      time: "10:38 AM",
    },
    { from: "guest", text: "Sounds great, thank you!", time: "10:40 AM" },
  ],
  2: [
    {
      from: "guest",
      text: "I have a question about the amenities.",
      time: "9:30 AM",
    },
  ],
  3: [{ from: "guest", text: "See you then!", time: "Yesterday" }],
};

export const savedReplies = [
  {
    id: "reply1",
    title: "Check-in Instructions",
    text: "Hello! Check-in is anytime after 3 PM. You can find the caravan at [Address]. The key is in the lockbox, and the code is [CODE]. Let us know if you have any questions!",
  },
  {
    id: "reply2",
    title: "Parking Information",
    text: "You can park your vehicle in the designated spot right next to the caravan. It is marked with the number [Number].",
  },
  {
    id: "reply3",
    title: "Wi-Fi Details",
    text: 'The Wi-Fi network is "CaravanNet" and the password is "adventure123". Enjoy your stay!',
  },
];

// Dummy data for the Search by Region page
export const dummyCaravans = [
  // 서울/경기/인천
  {
    id: "c01",
    name: "서울 도심 캠핑카",
    regionCategory: "서울/경기/인천",
    lat: 37.5665,
    lng: 126.978,
    image: "/images/caravans/photo1.jpg",
    price: 150,
  },
  {
    id: "c02",
    name: "인천대교 뷰 카라반",
    regionCategory: "서울/경기/인천",
    lat: 37.4733,
    lng: 126.6195,
    image: "/images/caravans/photo2.jpg",
    price: 130,
  },
  // 강릉/속초/양양
  {
    id: "c03",
    name: "양양 서핑 카라반",
    regionCategory: "강릉/속초/양양",
    lat: 38.0581,
    lng: 128.6229,
    image: "/images/caravans/photo3.jpg",
    price: 180,
  },
  {
    id: "c04",
    name: "속초 바다정원",
    regionCategory: "강릉/속초/양양",
    lat: 38.2,
    lng: 128.59,
    image: "/images/caravans/photo4.jpg",
    price: 200,
  },
  // 충주/단양/제천
  {
    id: "c05",
    name: "단양 패러글라이딩 캠핑",
    regionCategory: "충주/단양/제천",
    lat: 36.9858,
    lng: 128.3692,
    image: "/images/caravans/photo5.jpg",
    price: 160,
  },
  // 포항/경주/대구
  {
    id: "c06",
    name: "경주 역사탐방 카라반",
    regionCategory: "포항/경주/대구",
    lat: 35.8563,
    lng: 129.2244,
    image: "/images/caravans/photo6.jpg",
    price: 140,
  },
  // 대전/세종/충남
  {
    id: "c07",
    name: "대전 시티뷰 캠핑",
    regionCategory: "대전/세종/충남",
    lat: 36.3504,
    lng: 127.3845,
    image: "/images/caravans/photo7.jpg",
    price: 120,
  },
  // 광주/전북/전남
  {
    id: "c08",
    name: "전주 한옥마을 근처",
    regionCategory: "광주/전북/전남",
    lat: 35.8152,
    lng: 127.153,
    image: "/images/caravans/photo8.jpg",
    price: 135,
  },
  // 부산/울산/경남
  {
    id: "c09",
    name: "부산 해운대 오션뷰",
    regionCategory: "부산/울산/경남",
    lat: 35.1587,
    lng: 129.1604,
    image: "/images/caravans/photo9.jpg",
    price: 220,
  },
  // 제주
  {
    id: "c10",
    name: "제주 애월 해안도로",
    regionCategory: "제주",
    lat: 33.4617,
    lng: 126.3105,
    image: "/images/caravans/photo10.jpg",
    price: 250,
  },
  {
    id: "c11",
    name: "제주 성산일출봉 캠핑",
    regionCategory: "제주",
    lat: 33.458,
    lng: 126.9423,
    image: "/images/caravans/photo11.jpg",
    price: 240,
  },
];
