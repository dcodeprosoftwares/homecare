import { Users, FileText, Briefcase, PhoneCall } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { name: "Total Inquiries", value: "24", icon: PhoneCall, change: "+12%", changeType: "positive" },
    { name: "Active Services", value: "8", icon: Briefcase, change: "0%", changeType: "neutral" },
    { name: "Published Blogs", value: "12", icon: FileText, change: "+3", changeType: "positive" },
    { name: "Careers Open", value: "2", icon: Users, change: "-1", changeType: "negative" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to the TrueCare Health At Home administration panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className={`text-sm mt-2 font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 
                stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {stat.change} this month
              </p>
            </div>
            <div className="bg-primary-50 p-3 rounded-lg text-primary">
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-900">Recent Inquiries</h3>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Service</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {/* Mock Data */}
              {[
                { name: "Sarah Johnson", service: "Nursing Care", date: "Today", status: "New" },
                { name: "Michael Smith", service: "Elderly Care", date: "Yesterday", status: "Contacted" },
                { name: "David Williams", service: "Physiotherapy", date: "Oct 24", status: "Resolved" },
              ].map((inquiry, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{inquiry.name}</td>
                  <td className="px-6 py-4 text-gray-600">{inquiry.service}</td>
                  <td className="px-6 py-4 text-gray-500">{inquiry.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'New' ? 'bg-blue-50 text-blue-700' :
                      inquiry.status === 'Contacted' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-green-50 text-green-700'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
