import { useState } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("categories");

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      
      <div className="flex border-b bg-white shadow-md p-2">
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === "categories" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("categories")}
        >
          Categories
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === "result" ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("result")}
        >
          Result
        </button>
      </div>

      {/* Categories Tab Content */}
      {activeTab === "categories" && (
        <div className="mt-4 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add Category</h2>
          <form className="space-y-4">
            <div>
              <label className="block font-medium">Category Name</label>
              <input
                type="text"
                className="w-96 p-2 border border-gray-300 rounded-md"
                placeholder="Enter category name"
              />
            </div>
            <div>
              <label className="block font-medium">Exam Duration (minutes)</label>
              <input
                type="number"
                className="w-96 p-2 border border-gray-300 rounded-md"
                placeholder="Enter exam duration"
              />
            </div>
            <div>
              <label className="block font-medium">Upload File (XLSX or CSV)</label>
              <input type="file" className="w-96 p-2 border border-gray-300 rounded-md" />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      )}

      {/* Result Tab Content */}
      {activeTab === "result" && (
        <div className="mt-4 bg-white p-4 shadow rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Score</th>
                <th className="border p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">John Doe</td>
                <td className="border p-2">85</td>
                <td className="border p-2 text-green-500">Passed</td>
              </tr>
              <tr>
                <td className="border p-2">Jane Smith</td>
                <td className="border p-2">72</td>
                <td className="border p-2 text-green-500">Passed</td>
              </tr>
              <tr>
                <td className="border p-2">Michael Brown</td>
                <td className="border p-2">50</td>
                <td className="border p-2 text-red-500">Failed</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
