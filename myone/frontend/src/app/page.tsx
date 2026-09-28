import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <header className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          AI QA Engineer Platform
        </h1>
        <p className="text-gray-400 mt-2">Autonomous Testing & Reporting Dashboard</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-blue-500 transition-colors shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Total Tests</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-green-500 transition-colors shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Passed</h3>
          <p className="text-3xl font-bold mt-2 text-green-400">0</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-red-500 transition-colors shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Failed</h3>
          <p className="text-3xl font-bold mt-2 text-red-400">0</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl hover:border-purple-500 transition-colors shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium">Coverage</h3>
          <p className="text-3xl font-bold mt-2 text-purple-400">0%</p>
        </div>
      </main>

      <section className="mt-12">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Start New Analysis</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Enter Website URL" 
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 text-white"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Analyze
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
