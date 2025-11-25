const mongoose = require("mongoose");
const CaravanRepository = require("../repositories/CaravanRepository");
const ReservationRepository = require("../repositories/ReservationRepository");
const PaymentHistoryRepository = require("../repositories/PaymentHistoryRepository");
const ReviewRepository = require("../repositories/ReviewRepository");

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class DashboardService {
  constructor() {
    this.caravanRepository = new CaravanRepository();
    this.reservationRepository = new ReservationRepository();
    this.paymentHistoryRepository = new PaymentHistoryRepository();
    this.reviewRepository = new ReviewRepository();
  }

  async getDashboardSummary(hostId) {
    const hostObjectId = new mongoose.Types.ObjectId(hostId);

    // 1. Get host's caravans
    const caravans = await this.caravanRepository.findByHostId(hostObjectId);
    if (caravans.length === 0) {
      return {
        summaryStats: { totalRevenueMonth: 0, pendingRequests: 0, upcomingCheckIns: 0, averageRating: 0 },
        monthlyEarningsData: [],
        occupancyRateData: [{ name: "Occupancy", value: 0, fill: "#8884d8" }],
      };
    }
    const caravanIds = caravans.map((c) => c._id);

    // 2. Get reservations for those caravans
    const reservations = await this.reservationRepository.findByCaravanIds(caravanIds);
    const reservationIds = reservations.map((r) => r._id);

    // 3. Calculate summary stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const paymentsThisMonth = await this.paymentHistoryRepository.findByReservationIds(reservationIds);
    const totalRevenueMonth = paymentsThisMonth
      .filter(p => new Date(p.createdAt) >= startOfMonth && p.status === 'succeeded')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingRequests = reservations.filter(r => r.status === 'pending').length;

    const upcomingCheckIns = reservations.filter(
      r => r.status === 'confirmed' && new Date(r.startDate) >= now && new Date(r.startDate) <= sevenDaysFromNow
    ).length;

    const reviews = await this.reviewRepository.findByReservationIds(reservationIds);
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

    // 4. Calculate monthly earnings
    const monthlyEarningsRaw = await this.paymentHistoryRepository.getMonthlyEarnings(reservationIds, 6);
    const monthlyEarningsData = monthlyEarningsRaw.map(item => ({
      name: MONTH_NAMES[item._id.month - 1],
      earnings: item.totalEarnings,
    }));

    // 5. Calculate occupancy rate (simplified for now)
    // A more accurate calculation would be: (total nights booked in month / (number of caravans * days in month))
    const nightsBookedThisMonth = reservations
      .filter(r => new Date(r.startDate) >= startOfMonth && new Date(r.endDate) <= endOfMonth)
      .reduce((total, r) => {
        const start = new Date(r.startDate);
        const end = new Date(r.endDate);
        const nights = (end - start) / (1000 * 60 * 60 * 24);
        return total + nights;
      }, 0);
      
    const daysInMonth = (endOfMonth.getDate());
    const totalPossibleNights = caravans.length * daysInMonth;
    const occupancyPercentage = totalPossibleNights > 0 ? (nightsBookedThisMonth / totalPossibleNights) * 100 : 0;
    
    const occupancyRateData = [{ name: "Occupancy", value: Math.round(occupancyPercentage), fill: "#8884d8" }];

    return {
      summaryStats: {
        totalRevenueMonth,
        pendingRequests,
        upcomingCheckIns,
        averageRating: averageRating.toFixed(1),
      },
      monthlyEarningsData,
      occupancyRateData,
    };
  }
}

module.exports = DashboardService;
