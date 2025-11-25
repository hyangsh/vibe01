import React, { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BanknotesIcon,
  ClockIcon,
  StarIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { getDashboardSummary } from "../../utils/api";

const StatCard = ({ title, value, icon, unit = "" }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <div className="flex items-center">
      <div className="p-3 bg-indigo-100 rounded-full text-indigo-600 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">
          {value}
          <span className="text-base font-normal">{unit}</span>
        </p>
      </div>
    </div>
  </div>
);

const OverviewView = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await getDashboardSummary();
        setSummaryData(data);
      } catch (err) {
        setError("Failed to fetch summary data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!summaryData) {
    return <div>No summary data available.</div>;
  }

  const { summaryStats, monthlyEarningsData, occupancyRateData } = summaryData;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue (Month)"
          value={`${(summaryStats.totalRevenueMonth / 1000).toFixed(1)}k`}
          icon={<BanknotesIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Pending Requests"
          value={summaryStats.pendingRequests}
          icon={<ClockIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Upcoming Check-ins"
          value={summaryStats.upcomingCheckIns}
          icon={<CalendarDaysIcon className="w-6 h-6" />}
        />
        <StatCard
          title="Average Rating"
          value={summaryStats.averageRating}
          icon={<StarIcon className="w-6 h-6" />}
          unit="/5"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Earnings Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyEarningsData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <Tooltip cursor={{ fill: "rgba(243, 244, 246, 0.5)" }} />
              <Legend />
              <Bar
                dataKey="earnings"
                fill="#8884d8"
                name="Earnings"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Rate Chart */}
        <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4">
            Occupancy Rate (This Month)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadialBarChart
              innerRadius="70%"
              outerRadius="85%"
              data={occupancyRateData}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar minAngle={15} background clockWise dataKey="value" />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="center"
                formatter={() => (
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      {occupancyRateData[0].value}%
                    </p>
                    <p className="text-sm text-gray-500">Occupied</p>
                  </div>
                )}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
export default OverviewView;
