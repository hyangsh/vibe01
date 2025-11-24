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
