"use client";

import { useState } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";

export default function MercuryCIPage() {
  const [activeTab, setActiveTab] = useState('briefing');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">Mercury CI</h1>
                  <p className="text-sm text-neutral-500">Commercial Intelligence for Teams</p>
                </div>
              </div>
            </div>

            {/* Status and Actions */}
            <div className="flex items-center space-x-4">
              {/* Model Status */}
              <div className="bg-neutral-100 rounded-lg px-3 py-2">
                <p className="text-sm text-neutral-600">🤖 Model: GPT-4o-mini (OpenAI)</p>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center border border-neutral-300">
                  <span className="text-neutral-700 text-sm font-medium">U</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-neutral-900">User</p>
                  <p className="text-xs text-neutral-500">Admin</p>
                </div>
              </div>

              {/* Settings Button */}
              <button className="text-neutral-600 hover:text-neutral-800 transition-colors">
                ⚙️
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'briefing', label: 'Briefing', icon: '📊', description: 'Daily intelligence reports' },
              { id: 'data', label: 'Data', icon: '📈', description: 'CSV analysis & insights' },
              { id: 'artifacts', label: 'Artifacts', icon: '📄', description: 'Reports & exports' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{tab.description}</p>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'briefing' && <BriefingTab />}
        {activeTab === 'data' && <DataTab />}
        {activeTab === 'artifacts' && <ArtifactsTab />}
      </main>

      {/* Chat Sidebar */}
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        className="mercury-copilot-sidebar"
        labels={{
          title: "Mercury CI Assistant",
          initial: "🚀 Welcome to Mercury CI! I'm your Commercial Intelligence assistant, ready to transform your data into actionable insights.\n\n**What I can do for you:**\n\n📊 **Daily Briefings**: \"Generate today's market intelligence briefing\"\n📈 **Data Analysis**: \"Analyse my CSV data and show key trends\"\n📄 **Smart Reports**: \"Create a comprehensive insights report\"\n\n**Pro tip**: I remember your preferences and get smarter with each interaction. Let's make data-driven decisions together! ⚡"
        }}
      />
    </div>
  );
}

// Briefing Tab Component
function BriefingTab() {
  const [selectedSources, setSelectedSources] = useState(['news', 'market']);
  const [briefingDate, setBriefingDate] = useState('26/10/2025');
  const [userName, setUserName] = useState('mtb');
  const [lastBriefingDate, setLastBriefingDate] = useState('25/10/2025');

  // Contextual Greeting Logic
  const getContextualGreeting = () => {
    const today = new Date();
    const lastBriefing = new Date('2025-10-25');
    const daysSince = Math.floor((today.getTime() - lastBriefing.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) return `Welcome back, ${userName}. Ready for another briefing?`;
    if (daysSince === 1) return `Good to see you again, ${userName}. Yesterday's insights were valuable.`;
    return `Welcome back, ${userName}. It's been ${daysSince} days since your last briefing.`;
  };

  return (
    <div className="space-y-6">
      {/* Contextual Greeting with Memory Light */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-6 animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center animate-scale-in">
            <span className="text-white text-xl">👋</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {getContextualGreeting()}
            </h3>
            <p className="text-neutral-700">
              Ready to generate your next intelligence briefing?
            </p>
            <div className="mt-2 flex items-center space-x-2 text-sm text-primary-600">
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
              <span>Memory active - Last briefing: {lastBriefingDate}</span>
      </div>
    </div>
        </div>
      </div>

      {/* Animated KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active Sources', value: '12', change: '+2', color: 'text-green-400' },
          { label: 'Reports Generated', value: '47', change: '+8', color: 'text-blue-400' },
          { label: 'Data Points', value: '2.4K', change: '+156', color: 'text-orange-400' }
        ].map((kpi, index) => (
          <div key={kpi.label} className="bg-neutral-800 rounded-xl p-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="flex items-center justify-between">
          <div>
                <p className="text-sm text-neutral-400">{kpi.label}</p>
                <p className="text-2xl font-bold text-white animate-count-up">{kpi.value}</p>
              </div>
              <div className={`text-sm font-medium ${kpi.color}`}>
                {kpi.change}
          </div>
        </div>
          </div>
        ))}
        </div>

      {/* Generate Briefing Section */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-2">Generate Intelligence Briefing</h2>
        <p className="text-neutral-600 mb-6">Create a comprehensive daily briefing with key insights and metrics</p>
        
        <div className="space-y-4">
          {/* Briefing Date */}
            <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Briefing Date</label>
            <div className="relative">
              <input
                type="text"
                value={briefingDate}
                onChange={(e) => setBriefingDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900 placeholder:text-neutral-500"
                placeholder="26/10/2025"
              />
              <span className="absolute right-3 top-2.5 text-neutral-400">📅</span>
            </div>
            <p className="text-sm text-neutral-500 mt-1">Select the date for your briefing</p>
          </div>

          {/* Data Sources */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">Data Sources</label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'news', title: 'News', description: 'Latest news and headlines', icon: '📰' },
                { id: 'market', title: 'Market Data', description: 'Real-time market information', icon: '📊' },
                { id: 'social', title: 'Social Media', description: 'Social media sentiment', icon: '💬' },
                { id: 'economic', title: 'Economic Indicators', description: 'Economic data and trends', icon: '📈' }
              ].map((source) => (
                <div
                  key={source.id}
                  onClick={() => {
                    if (selectedSources.includes(source.id)) {
                      setSelectedSources(selectedSources.filter(s => s !== source.id));
                    } else {
                      setSelectedSources([...selectedSources, source.id]);
                    }
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedSources.includes(source.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{source.icon}</span>
            <div>
                      <h3 className="font-medium text-neutral-900">{source.title}</h3>
                      <p className="text-sm text-neutral-600">{source.description}</p>
                    </div>
                  </div>
            </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Generate Intelligence Briefing
          </button>
        </div>
      </div>
    </div>
  );
}

// Data Tab Component
function DataTab() {
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'sales_data_2024.csv', size: '2.4MB', status: 'processed', insights: 12 },
    { name: 'customer_feedback.csv', size: '856KB', status: 'analysing', insights: 0 },
    { name: 'market_trends.csv', size: '1.2MB', status: 'processed', insights: 8 }
  ]);

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">CSV Data Analysis</h2>
        <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Upload CSV Files</h3>
          <p className="text-neutral-600 mb-4">Drag and drop your CSV files here or click to browse</p>
          <button className="mercury-button">Choose Files</button>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Uploaded Files</h3>
        <div className="space-y-3">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600">📄</span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{file.name}</p>
                  <p className="text-sm text-neutral-600">{file.size} • {file.insights} insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  file.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {file.status === 'analysing' ? 'analysing' : file.status}
                </span>
                <button className="text-primary-600 hover:text-primary-700">Analyse</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Artifacts Tab Component
function ArtifactsTab() {
  const [reports, setReports] = useState([
    { name: 'Daily Intelligence Briefing', date: '26/10/2025', type: 'PDF', size: '2.1MB', status: 'ready' },
    { name: 'Market Analysis Report', date: '25/10/2025', type: 'PDF', size: '3.4MB', status: 'ready' },
    { name: 'Customer Sentiment Analysis', date: '24/10/2025', type: 'Excel', size: '1.8MB', status: 'ready' },
    { name: 'Competitive Intelligence Summary', date: '23/10/2025', type: 'PDF', size: '2.7MB', status: 'generating' }
  ]);

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Reports & Exports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-neutral-800 rounded-xl p-4 text-left hover:bg-neutral-700 transition-all animate-slide-up" style={{ animationDelay: '0s' }}>
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-medium text-white">Generate Report</h3>
            <p className="text-sm text-neutral-400">Create new intelligence report</p>
          </button>
          <button className="bg-neutral-800 rounded-xl p-4 text-left hover:bg-neutral-700 transition-all animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-medium text-white">Export Data</h3>
            <p className="text-sm text-neutral-400">Export analysis results</p>
          </button>
          <button className="bg-neutral-800 rounded-xl p-4 text-left hover:bg-neutral-700 transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-medium text-white">Schedule Report</h3>
            <p className="text-sm text-neutral-400">Set up automated reports</p>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {reports.map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-600">
                    {report.type === 'PDF' ? '📄' : '📊'}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{report.name}</p>
                  <p className="text-sm text-neutral-600">{report.date} • {report.size}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  report.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status}
                </span>
                {report.status === 'ready' && (
                  <button className="text-primary-600 hover:text-primary-700">Download</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

