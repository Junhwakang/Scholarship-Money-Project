"use client";

export default function StatisticsSection() {
  const stats = [
    {
      label: "설립연도",
      value: "2020",
      unit: "YEAR",
    },
    {
      label: "등록된 채용",
      value: "5,000",
      unit: "JOBS",
    },
    {
      label: "장학금 정보",
      value: "1,200",
      unit: "PROGRAMS",
    },
    {
      label: "평균 평점",
      value: "4.8",
      unit: "RATING",
    }
  ];

  return (
    <div className="bg-neutral-50 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-gray-400 text-xs tracking-[0.2em] mb-3">
                {stat.unit}
              </div>
              <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
