"use client";

import { useState, useEffect } from "react";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useRouter } from "next/navigation";

// Briefing storage utilities
interface StoredBriefing {
  id: string;
  date: string;
  company?: string;
  sources: string[];
  briefing: string;
  kpis: any[];
  insights: string[];
  generatedAt: string;
  title: string;
  archivedAt?: string;
}

// Report storage utilities
interface StoredReport {
  id: string;
  reportType: string;
  title: string;
  executiveSummary: string;
  sections: Array<{
    title: string;
    content: string;
  }>;
  recommendations: string[];
  metadata: {
    generatedAt: string;
    reportType: string;
    dataSources: string[];
    confidence: number;
  };
  generatedAt: string;
}

const BRIEFING_STORAGE_KEY = 'mercury-briefings';
const BRIEFING_ARCHIVE_KEY = 'mercury-briefings-archive';
const REPORT_STORAGE_KEY = 'mercury-reports';
const MAX_BRIEFINGS = 20;
const MAX_REPORTS = 10;
const ARCHIVE_DAYS = 30;

const saveBriefing = (briefing: StoredBriefing) => {
  const briefings = getStoredBriefings();
  briefings.unshift(briefing); // Add to beginning
  
  // Keep only the most recent 20 briefings
  if (briefings.length > MAX_BRIEFINGS) {
    const toArchive = briefings.splice(MAX_BRIEFINGS);
    archiveBriefings(toArchive);
  }
  
  console.log('Saving briefing:', briefing);
  console.log('All briefings after save:', briefings);
  localStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(briefings));
};

const getStoredBriefings = (): StoredBriefing[] => {
  try {
    const stored = localStorage.getItem(BRIEFING_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const archiveBriefings = (briefings: StoredBriefing[]) => {
  const archived = getArchivedBriefings();
  const now = new Date().toISOString();
  
  briefings.forEach(briefing => {
    briefing.archivedAt = now;
  });
  
  archived.push(...briefings);
  localStorage.setItem(BRIEFING_ARCHIVE_KEY, JSON.stringify(archived));
};

const getArchivedBriefings = (): StoredBriefing[] => {
  try {
    const stored = localStorage.getItem(BRIEFING_ARCHIVE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const cleanupArchivedBriefings = () => {
  const archived = getArchivedBriefings();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - ARCHIVE_DAYS);
  
  const validArchived = archived.filter(briefing => 
    new Date(briefing.archivedAt || briefing.generatedAt) > cutoffDate
  );
  
  localStorage.setItem(BRIEFING_ARCHIVE_KEY, JSON.stringify(validArchived));
};

// Report storage functions
const saveReport = (report: StoredReport) => {
  const reports = getStoredReports();
  reports.unshift(report); // Add to beginning
  
  // Keep only the most recent 10 reports
  if (reports.length > MAX_REPORTS) {
    reports.splice(MAX_REPORTS);
  }
  
  console.log('Saving report:', report);
  console.log('All reports after save:', reports);
  localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports));
};

const getStoredReports = (): StoredReport[] => {
  try {
    const stored = localStorage.getItem(REPORT_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const deleteReport = (reportId: string) => {
  const reports = getStoredReports();
  const updatedReports = reports.filter(r => r.id !== reportId);
  localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(updatedReports));
  console.log('Deleted report:', reportId);
  console.log('Remaining reports:', updatedReports);
};

const deleteBriefing = (id: string) => {
  const briefings = getStoredBriefings();
  const filtered = briefings.filter(b => b.id !== id);
  localStorage.setItem(BRIEFING_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

export default function MercuryCIPage() {
  const [activeTab, setActiveTab] = useState('briefing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [briefings, setBriefings] = useState<StoredBriefing[]>([]);
  const [showBriefingSidebar, setShowBriefingSidebar] = useState(false);
  const [selectedBriefing, setSelectedBriefing] = useState<StoredBriefing | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    // For now, we'll simulate a check
    const checkAuth = () => {
      const authStatus = localStorage.getItem('mercury-auth');
      const userData = localStorage.getItem('mercury-user');
      
      if (authStatus === 'true') {
        setIsAuthenticated(true);
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } else {
        router.push('/login');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Load briefings and cleanup archived ones
  useEffect(() => {
    const loadBriefings = () => {
      const storedBriefings = getStoredBriefings();
      console.log('Loaded briefings:', storedBriefings);
      setBriefings(storedBriefings);
      
      // Cleanup archived briefings older than 30 days
      cleanupArchivedBriefings();
    };

    loadBriefings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mercury-auth');
    localStorage.removeItem('mercury-user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
  };

  if (isLoading) {
  return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading Mercury CI...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
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
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-neutral-900">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {user?.email || 'user@mercury-ci.com'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 text-xs text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
                >
                  Logout
                </button>
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
        {activeTab === 'briefing' && (
          <BriefingTab 
            briefings={briefings}
            setBriefings={setBriefings}
            showBriefingSidebar={showBriefingSidebar}
            setShowBriefingSidebar={setShowBriefingSidebar}
            selectedBriefing={selectedBriefing}
            setSelectedBriefing={setSelectedBriefing}
          />
        )}
        {activeTab === 'data' && <DataTab />}
        {activeTab === 'artifacts' && <ArtifactsTab />}
      </main>

      {/* Chat Sidebar */}
      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-neutral-600">
              © {new Date().getFullYear() === 2025 ? 'twenty twenty-five' : new Date().getFullYear()} Mercury CI. All rights reserved.
            </div>
            <div className="text-sm text-neutral-600">
              Built with 💙 by{' '}
              <a 
                href="https://mtblabs.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-600 transition-colors font-medium"
              >
                mtb labs
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Briefing History Sidebar */}
      <BriefingHistorySidebar
        briefings={briefings}
        showSidebar={showBriefingSidebar}
        setShowSidebar={setShowBriefingSidebar}
        loadBriefing={(briefing) => {
          console.log('Setting selected briefing:', briefing);
          setSelectedBriefing(briefing);
        }}
        deleteBriefingById={(id) => {
          const updatedBriefings = deleteBriefing(id);
          setBriefings(updatedBriefings);
        }}
      />

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
function BriefingTab({ 
  briefings, 
  setBriefings, 
  showBriefingSidebar, 
  setShowBriefingSidebar,
  selectedBriefing,
  setSelectedBriefing
}: { 
  briefings: StoredBriefing[], 
  setBriefings: (briefings: StoredBriefing[]) => void,
  showBriefingSidebar: boolean,
  setShowBriefingSidebar: (show: boolean) => void,
  selectedBriefing: StoredBriefing | null,
  setSelectedBriefing: (briefing: StoredBriefing | null) => void
}) {
  const [selectedSources, setSelectedSources] = useState(['news', 'market']);
  const [briefingDate, setBriefingDate] = useState(new Date().toISOString().split('T')[0]);
  const [userName, setUserName] = useState('mtb');
  const [lastBriefingDate, setLastBriefingDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefingResult, setBriefingResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Get last briefing date for display
  const getLastBriefingDate = () => {
    const briefings = getStoredBriefings();
    if (briefings.length === 0) return 'No briefings yet';
    
    const lastBriefing = briefings[0];
    return new Date(lastBriefing.generatedAt).toLocaleDateString('en-GB');
  };

  // Contextual Greeting Logic
  const getContextualGreeting = () => {
    const today = new Date();
    const briefings = getStoredBriefings();
    
    if (briefings.length === 0) {
      return `Welcome to Mercury CI, ${userName}. Ready to generate your first intelligence briefing?`;
    }
    
    // Get the most recent briefing
    const lastBriefing = briefings[0];
    const lastBriefingDate = new Date(lastBriefing.generatedAt);
    const daysSince = Math.floor((today.getTime() - lastBriefingDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSince === 0) return `Welcome back, ${userName}. Ready for another briefing?`;
    if (daysSince === 1) return `Good to see you again, ${userName}. Yesterday's insights were valuable.`;
    return `Welcome back, ${userName}. It's been ${daysSince} days since your last briefing.`;
  };

  // Load a specific briefing
  const loadBriefing = (briefing: StoredBriefing | null) => {
    if (!briefing) return;
    
    // Update the briefing content to use proper UK date format
    const updatedBriefing = briefing.briefing.replace(
      /# Daily Intelligence Briefing - \d{4}-\d{2}-\d{2}/,
      `# Daily Intelligence Briefing - ${new Date(briefing.date).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })}`
    );
    
    setBriefingResult({
      briefing: updatedBriefing,
      kpis: briefing.kpis,
      insights: briefing.insights,
      sources: briefing.sources,
      generatedAt: briefing.generatedAt
    });
    setBriefingDate(briefing.date);
    setSelectedSources(briefing.sources);
    setShowBriefingSidebar(false);
  };

  // Watch for selectedBriefing changes from the sidebar
  useEffect(() => {
    if (selectedBriefing) {
      console.log('Loading selected briefing:', selectedBriefing);
      loadBriefing(selectedBriefing);
      setSelectedBriefing(null); // Clear after loading
      
      // Scroll to the top of the briefing result
      setTimeout(() => {
        const briefingElement = document.querySelector('[data-briefing-result]');
        if (briefingElement) {
          briefingElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100); // Small delay to ensure the briefing is rendered
    }
  }, [selectedBriefing]);

  // Delete a briefing
  const deleteBriefingById = (id: string) => {
    const updatedBriefings = deleteBriefing(id);
    setBriefings(updatedBriefings);
    if (briefingResult && briefingResult.id === id) {
      setBriefingResult(null);
    }
  };

  // Generate Briefing Function
  const generateBriefing = () => {
    setIsGenerating(true);
    setError(null);
    
    // Simulate the briefing generation with a delay
    setTimeout(() => {
      const briefingId = `briefing-${Date.now()}`;
      const briefingTitle = `Intelligence Briefing - ${new Date(briefingDate).toLocaleDateString('en-GB')}`;
      
      const result = {
        id: briefingId,
        briefing: `# Daily Intelligence Briefing - ${new Date(briefingDate).toLocaleDateString('en-GB', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}

## Executive Summary
Good morning! Here's your comprehensive intelligence briefing for ${userName} covering the latest market developments, key metrics, and strategic insights.

## Market Overview
Today's market conditions show mixed signals with technology stocks leading gains while traditional sectors experienced some volatility. Key economic indicators suggest continued growth momentum with inflation remaining within target ranges.

## Key Developments
- **Technology Sector**: AI and cloud computing stocks saw significant gains following positive earnings reports
- **Energy Markets**: Oil prices stabilised after recent volatility, with renewable energy investments continuing to grow
- **Regulatory Updates**: New data protection regulations came into effect, impacting digital businesses
- **Global Trade**: Supply chain improvements noted across major manufacturing sectors

## Risk Assessment
- **Medium Risk**: Potential interest rate adjustments in Q4
- **Low Risk**: Stable employment figures across key markets
- **High Risk**: Geopolitical tensions in certain regions affecting trade routes

## Strategic Recommendations
1. Consider increasing exposure to technology and renewable energy sectors
2. Review data compliance procedures in light of new regulations
3. Monitor supply chain resilience for critical business operations
4. Evaluate hedging strategies for currency fluctuations

## Data Sources
This briefing incorporates data from: ${selectedSources.join(', ')}`,
        kpis: [
          { metric: 'Market Sentiment', value: 'Positive', change: '+5%', trend: '↗️' },
          { metric: 'Volatility Index', value: '18.2', change: '-2.1', trend: '↘️' },
          { metric: 'Sector Performance', value: 'Tech +3.2%', change: '+1.8%', trend: '↗️' },
          { metric: 'Economic Confidence', value: '78%', change: '+4%', trend: '↗️' }
        ],
        insights: [
          'Technology sector showing strong momentum with AI investments driving growth',
          'Renewable energy sector continues to attract significant capital inflows',
          'Supply chain resilience improving across major manufacturing sectors',
          'Data protection regulations creating new compliance requirements for digital businesses'
        ],
        sources: selectedSources,
        generatedAt: new Date().toISOString()
      };

      // Create stored briefing object
      const storedBriefing: StoredBriefing = {
        id: briefingId,
        date: briefingDate,
        company: userName,
        sources: selectedSources,
        briefing: result.briefing,
        kpis: result.kpis,
        insights: result.insights,
        generatedAt: result.generatedAt,
        title: briefingTitle
      };

      // Save to storage and update state
      saveBriefing(storedBriefing);
      const updatedBriefings = getStoredBriefings();
      setBriefings(updatedBriefings);
      
      setBriefingResult(result);
      setLastBriefingDate(new Date(briefingDate).toLocaleDateString('en-GB'));
      setIsGenerating(false);
    }, 2000); // Simulate 2 second delay
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
              <span>Memory active - Last briefing: {getLastBriefingDate()}</span>
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
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-neutral-900">Generate Intelligence Briefing</h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-neutral-500">
                      {briefings.length} of {MAX_BRIEFINGS} briefings
                    </span>
                    <button
                      onClick={() => setShowBriefingSidebar(true)}
                      className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                    >
                      📋 History
                    </button>
                  </div>
                </div>
                <p className="text-neutral-600 mb-6">Create a comprehensive daily briefing with key insights and metrics</p>
        
        <div className="space-y-4">
          {/* Briefing Date */}
            <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Briefing Date</label>
            <div className="relative">
              <input
                type="date"
                value={briefingDate}
                onChange={(e) => setBriefingDate(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-neutral-900"
              />
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
              <button
            onClick={generateBriefing}
            disabled={isGenerating}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Intelligence Briefing'}
              </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <p className="text-red-700 font-medium">Error generating briefing</p>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

              {/* Briefing Result */}
              {briefingResult && (
                <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden" data-briefing-result>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Generated Intelligence Briefing</h3>
                <p className="text-primary-100 text-sm">Generated on {new Date(briefingResult.generatedAt).toLocaleDateString('en-GB', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">Data Sources</div>
                <div className="text-primary-100 text-xs">{briefingResult.sources?.join(' • ') || 'news, market'}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Briefing Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-neutral-700 leading-relaxed">
                {(briefingResult.briefing || briefingResult.content || briefingResult.message || 'Briefing generated successfully!')
                  .split('\n')
                  .map((line: string, index: number) => {
                    if (line.startsWith('## ')) {
                      return (
                        <h2 key={index} className="text-xl font-bold text-neutral-900 mt-6 mb-3 first:mt-0">
                          {line.replace('## ', '')}
                        </h2>
                      );
                    } else if (line.startsWith('# ')) {
                      return (
                        <h1 key={index} className="text-2xl font-bold text-neutral-900 mt-6 mb-4 first:mt-0">
                          {line.replace('# ', '')}
                        </h1>
                      );
                    } else if (line.startsWith('- **') && line.includes('**:')) {
                      const [boldPart, rest] = line.split('**:');
                      const boldText = boldPart.replace('- **', '');
                      return (
                        <div key={index} className="mb-2">
                          <span className="font-semibold text-neutral-900">{boldText}:</span>
                          <span className="text-neutral-700">{rest}</span>
                        </div>
                      );
                    } else if (line.startsWith('- ')) {
                      return (
                        <div key={index} className="ml-4 mb-2">
                          <span className="text-neutral-700">{line.replace('- ', '')}</span>
                        </div>
                      );
                    } else if (line.match(/^\d+\./)) {
                      return (
                        <div key={index} className="ml-4 mb-2">
                          <span className="text-neutral-700">{line}</span>
                        </div>
                      );
                    } else if (line.trim() === '') {
                      return <br key={index} />;
                    } else {
                      return (
                        <p key={index} className="mb-3">
                          <span className="text-neutral-700">{line}</span>
                        </p>
                      );
                    }
                  })}
              </div>
            </div>
            
            {/* KPIs Display */}
            {briefingResult.kpis && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-primary-500 rounded"></div>
                  <h4 className="text-lg font-semibold text-neutral-900">Key Performance Indicators</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {briefingResult.kpis.map((kpi: any, index: number) => (
                    <div key={index} className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-xl p-4 border border-neutral-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-neutral-600">{kpi.metric}</p>
                        <span className="text-lg">{kpi.trend}</span>
                      </div>
                      <p className="text-2xl font-bold text-neutral-900 mb-1">{kpi.value}</p>
                      <p className={`text-sm font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change}
                      </p>
            </div>
          ))}
        </div>
      </div>
            )}
            
            {/* Insights Display */}
            {briefingResult.insights && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-primary-500 rounded"></div>
                  <h4 className="text-lg font-semibold text-neutral-900">Key Insights</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {briefingResult.insights.map((insight: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200">
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <span>Powered by Mercury CI Intelligence Engine</span>
              <span>Confidence: High • Updated: Real-time</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Briefing History Sidebar Component
function BriefingHistorySidebar({ 
  briefings, 
  showSidebar, 
  setShowSidebar, 
  loadBriefing, 
  deleteBriefingById 
}: { 
  briefings: StoredBriefing[], 
  showSidebar: boolean, 
  setShowSidebar: (show: boolean) => void,
  loadBriefing: (briefing: StoredBriefing | null) => void,
  deleteBriefingById: (id: string) => void
}) {
  const recentBriefings = briefings.slice(0, 5);
  const allBriefings = briefings;

    return (
    <>
      {/* Backdrop */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
        showSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <h3 className="text-lg font-semibold text-neutral-900">Briefing History</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              ✕
            </button>
        </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Recent Briefings */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-neutral-600 mb-3">Recent Briefings</h4>
              <div className="space-y-2">
                {recentBriefings.map((briefing) => (
                  <div
                    key={briefing.id}
                    className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer"
                    onClick={() => {
                      console.log('Clicked briefing:', briefing);
                      loadBriefing(briefing);
                    }}
                  >
        <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {briefing.title}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(briefing.date).toLocaleDateString('en-GB')} • {briefing.sources.join(', ')}
                        </p>
          </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBriefingById(briefing.id);
                        }}
                        className="ml-2 p-1 text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
        </div>
          </div>
                ))}
              </div>
        </div>

            {/* All Briefings */}
            {allBriefings.length > 5 && (
            <div>
                <h4 className="text-sm font-medium text-neutral-600 mb-3">All Briefings</h4>
                <div className="space-y-2">
                  {allBriefings.slice(5).map((briefing) => (
                    <div
                      key={briefing.id}
                      className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-neutral-100 transition-colors cursor-pointer"
                      onClick={() => {
                      console.log('Clicked briefing:', briefing);
                      loadBriefing(briefing);
                    }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {briefing.title}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {new Date(briefing.date).toLocaleDateString('en-GB')} • {briefing.sources.join(', ')}
                          </p>
            </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteBriefingById(briefing.id);
                          }}
                          className="ml-2 p-1 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          🗑️
                        </button>
            </div>
            </div>
                  ))}
          </div>
        </div>
            )}

            {briefings.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500 text-sm">No briefings yet</p>
                <p className="text-neutral-400 text-xs mt-1">Generate your first briefing to get started</p>
      </div>
            )}
    </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200">
            <div className="text-xs text-neutral-500 text-center">
              Briefings are stored locally and archived after 30 days
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Data Tab Component
function DataTab() {
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    id: string;
    name: string;
    size: string;
    status: 'uploaded' | 'analysing' | 'processed' | 'error';
    insights: number;
    data?: string;
    analysisResult?: any;
    uploadedAt: string;
  }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // File storage utilities
  const DATA_FILES_STORAGE_KEY = 'mercury-data-files';
  const MAX_FILES = 10;

  const saveFiles = (files: typeof uploadedFiles) => {
    localStorage.setItem(DATA_FILES_STORAGE_KEY, JSON.stringify(files));
  };

  const loadFiles = (): typeof uploadedFiles => {
    try {
      const stored = localStorage.getItem(DATA_FILES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Load files on component mount
  useEffect(() => {
    const storedFiles = loadFiles();
    setUploadedFiles(storedFiles);
  }, []);

  // Delete file
  const deleteFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      saveFiles(updated);
      return updated;
    });
    
    // Clear selected file if it was deleted
    if (selectedFile === fileId) {
      setSelectedFile(null);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    const filePromises = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const fileId = `file-${Date.now()}-${i}`;
        const fileSize = (file.size / 1024 / 1024).toFixed(1) + 'MB';
        
        // Create a promise for each file read
        const filePromise = new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            console.log('File uploaded:', file.name, 'Size:', fileSize);
            setUploadedFiles(prev => {
              const newFile = {
                id: fileId,
                name: file.name,
                size: fileSize,
                status: 'uploaded' as const,
                insights: 0,
                data: content,
                uploadedAt: new Date().toISOString()
              };
              const newFiles = [...prev, newFile];
              
              // Keep only the most recent files
              if (newFiles.length > MAX_FILES) {
                newFiles.splice(0, newFiles.length - MAX_FILES);
              }
              
              console.log('Updated files:', newFiles);
              saveFiles(newFiles);
              return newFiles;
            });
            resolve();
          };
          reader.readAsText(file);
        });
        
        filePromises.push(filePromise);
      }
    }
    
    // Wait for all files to be read before setting uploading to false
    await Promise.all(filePromises);
    setIsUploading(false);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', e.target.files);
    if (e.target.files && e.target.files[0]) {
      console.log('Files selected:', e.target.files.length);
      handleFileUpload(e.target.files);
    }
  };

  // Analyse file
  const analyseFile = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.data) return;

    // Update status to analysing
    setUploadedFiles(prev => {
      const updated = prev.map(f => 
        f.id === fileId ? { ...f, status: 'analysing' as const } : f
      );
      saveFiles(updated);
      return updated;
    });

    try {
      // For now, simulate the analysis with dynamic data based on the CSV
      // TODO: Connect to real dataAnalysisTool when API integration is ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const csvLines = file.data.split('\n');
      const headers = csvLines[0]?.split(',') || [];
      const rowCount = csvLines.length - 1;
      
      // Generate dynamic analysis based on actual CSV data
      const analysisResult = {
        keyFindings: [
          `Dataset contains ${rowCount} rows with ${headers.length} columns`,
          `Columns identified: ${headers.slice(0, 3).join(', ')}${headers.length > 3 ? '...' : ''}`,
          'Data structure analysis completed successfully'
        ],
        recommendations: [
          'Review data quality and completeness',
          'Consider additional data validation rules',
          'Implement regular data monitoring'
        ],
        visualisations: [
          { type: 'line', title: 'Trend Analysis', data: 'trend_data' },
          { type: 'bar', title: 'Category Breakdown', data: 'category_data' },
          { type: 'scatter', title: 'Correlation Matrix', data: 'correlation_data' }
        ],
        confidence: 0.85,
        dataQuality: rowCount > 100 ? 'High' : 'Medium',
        processedRows: rowCount
      };

      // Update file with analysis result
      setUploadedFiles(prev => {
        const updated = prev.map(f => 
          f.id === fileId ? { 
            ...f, 
            status: 'processed' as const, 
            insights: analysisResult.keyFindings.length,
            analysisResult 
          } : f
        );
        saveFiles(updated);
        return updated;
      });

      setSelectedFile(fileId);
      
      // Scroll to analysis results
      setTimeout(() => {
        const analysisElement = document.querySelector('[data-analysis-result]');
        if (analysisElement) {
          analysisElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    } catch (error) {
      console.error('Analysis error:', error);
      setUploadedFiles(prev => {
        const updated = prev.map(f => 
          f.id === fileId ? { ...f, status: 'error' as const } : f
        );
        saveFiles(updated);
        return updated;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">CSV Data Analysis</h2>
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? 'border-primary-500 bg-primary-50' : 'border-neutral-300 hover:border-primary-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Upload CSV Files</h3>
          <p className="text-neutral-600 mb-4">Drag and drop your CSV files here or click to browse</p>
          <input
            type="file"
            id="csv-upload"
            multiple
            accept=".csv"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <label 
            htmlFor="csv-upload"
            className="mercury-button cursor-pointer"
          >
            {isUploading ? 'Uploading...' : 'Choose Files'}
          </label>
        </div>
      </div>

      {/* File List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Uploaded Files</h3>
        <div className="space-y-3">
          {uploadedFiles.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <p>No files uploaded yet</p>
              <p className="text-sm">Upload CSV files to get started with analysis</p>
            </div>
          ) : (
            uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600">📄</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{file.name}</p>
                    <p className="text-sm text-neutral-600">
                      {file.size} • {file.insights} insights • 
                      {new Date(file.uploadedAt).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            file.status === 'processed' ? 'bg-green-100 text-green-800' : 
                            file.status === 'analysing' ? 'bg-yellow-100 text-yellow-800' :
                            file.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {file.status}
                          </span>
                          {file.status === 'processed' ? (
                            <button 
                              onClick={() => {
                                setSelectedFile(file.id);
                                // Scroll to analysis results
                                setTimeout(() => {
                                  const analysisElement = document.querySelector('[data-analysis-result]');
                                  if (analysisElement) {
                                    analysisElement.scrollIntoView({ 
                                      behavior: 'smooth', 
                                      block: 'start' 
                                    });
                                  }
                                }, 100);
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              View Analysis
                            </button>
                          ) : (
                            <button 
                              onClick={() => analyseFile(file.id)}
                              disabled={file.status === 'analysing'}
                              className="text-primary-600 hover:text-primary-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
                            >
                              {file.status === 'analysing' ? 'Analysing...' : 'Analyse'}
                            </button>
                          )}
                          <button
                            onClick={() => deleteFile(file.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete file"
                          >
                            🗑️
                          </button>
                        </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {selectedFile && (() => {
        const file = uploadedFiles.find(f => f.id === selectedFile);
        if (!file?.analysisResult) return null;
        
  return (
          <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden" data-analysis-result>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Analysis Results</h3>
                  <p className="text-primary-100 text-sm">{file.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">Confidence: {Math.round(file.analysisResult.confidence * 100)}%</div>
                  <div className="text-primary-100 text-xs">Data Quality: {file.analysisResult.dataQuality}</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Key Findings */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-primary-500 rounded"></div>
                  <h4 className="text-lg font-semibold text-neutral-900">Key Findings</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {file.analysisResult.keyFindings.map((finding: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-primary-500 rounded"></div>
                  <h4 className="text-lg font-semibold text-neutral-900">Recommendations</h4>
                </div>
                <div className="space-y-3">
                  {file.analysisResult.recommendations.map((recommendation: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">✓</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visualisations */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-1 h-6 bg-primary-500 rounded"></div>
                  <h4 className="text-lg font-semibold text-neutral-900">Suggested Visualisations</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {file.analysisResult.visualisations.map((viz: any, index: number) => (
                    <div key={index} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {viz.type === 'line' ? '📈' : viz.type === 'bar' ? '📊' : '🥧'}
                        </div>
                        <h5 className="font-medium text-neutral-900">{viz.title}</h5>
                        <p className="text-sm text-neutral-600 capitalize">{viz.type} chart</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200">
              <div className="flex items-center justify-between text-sm text-neutral-500">
                <span>Processed {file.analysisResult.processedRows} rows</span>
                <span>Powered by Mercury CI Analysis Engine</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// Artifacts Tab Component
function ArtifactsTab() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<string>('');
  const [reports, setReports] = useState<StoredReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Load reports on component mount
  useEffect(() => {
    const storedReports = getStoredReports();
    setReports(storedReports);
  }, []);

  // Generate report function
  const generateReport = async (type: string) => {
    setIsGenerating(true);
    setError(null);
    setReportType(type);
    
    try {
      // Simulate API call to reportTool
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock report data based on type
      const reportData = {
        id: `report-${Date.now()}`,
        reportType: type,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Intelligence Report`,
        executiveSummary: `This comprehensive ${type} intelligence report provides strategic insights and actionable recommendations based on current market conditions and data analysis. The report covers key market trends, competitive landscape, and strategic opportunities for business growth and optimisation.`,
        sections: [
          {
            title: 'Executive Summary',
            content: `This section provides detailed analysis of executive summary including key findings, trends, and strategic implications for business decision-making.`
          },
          {
            title: 'Market Analysis',
            content: `This section provides detailed analysis of market analysis including key findings, trends, and strategic implications for business decision-making.`
          },
          {
            title: 'Competitive Landscape',
            content: `This section provides detailed analysis of competitive landscape including key findings, trends, and strategic implications for business decision-making.`
          },
          {
            title: 'Strategic Recommendations',
            content: `This section provides detailed analysis of strategic recommendations including key findings, trends, and strategic implications for business decision-making.`
          }
        ],
        recommendations: [
          'Implement data-driven decision making processes across all departments',
          'Invest in technology infrastructure to support advanced analytics',
          'Develop strategic partnerships to enhance market position',
          'Establish regular intelligence briefings for senior leadership',
          'Create automated reporting systems for continuous monitoring'
        ],
        metadata: {
          generatedAt: new Date().toISOString(),
          reportType: type,
          dataSources: ['Market Data', 'Internal Analytics', 'Industry Reports', 'Public Information'],
          confidence: 0.87
        },
        generatedAt: new Date().toISOString()
      };
      
      // Save report to localStorage
      saveReport(reportData);
      setReports(prev => [reportData, ...prev]);
      setGeneratedReport(reportData);
      setSelectedReport(reportData.id);
      
      // Scroll to report results
      setTimeout(() => {
        const reportElement = document.querySelector('[data-report-result]');
        if (reportElement) {
          reportElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
      
    } catch (error) {
      console.error('Report generation error:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Load a specific report
  const loadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      setGeneratedReport(report);
      setSelectedReport(reportId);
      
      // Scroll to report results
      setTimeout(() => {
        const reportElement = document.querySelector('[data-report-result]');
        if (reportElement) {
          reportElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  };

  // Delete a report
  const deleteReportById = (reportId: string) => {
    deleteReport(reportId);
    setReports(prev => prev.filter(r => r.id !== reportId));
    
    // Clear selected report if it was deleted
    if (selectedReport === reportId) {
      setSelectedReport(null);
      setGeneratedReport(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">Reports & Exports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => generateReport('executive')}
            disabled={isGenerating}
            className="bg-neutral-800 rounded-xl p-4 text-left hover:bg-neutral-700 transition-all animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ animationDelay: '0s' }}
          >
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-medium text-white">Generate Executive Summary</h3>
            <p className="text-sm text-neutral-400">Create executive intelligence report</p>
          </button>
          <button 
            onClick={() => generateReport('market')}
            disabled={isGenerating}
            className="bg-neutral-800 rounded-xl p-4 text-left hover:bg-neutral-700 transition-all animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-2xl mb-2">📈</div>
            <h3 className="font-medium text-white">Generate Market Analysis</h3>
            <p className="text-sm text-neutral-400">Create market intelligence report</p>
          </button>
          <button 
            onClick={() => generateReport('strategic')}
            disabled={isGenerating}
            className="bg-neutral-800 rounded-xl p-4 text-left hover:bg-neutral-700 transition-all animate-slide-up disabled:opacity-50 disabled:cursor-not-allowed" 
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-medium text-white">Generate Strategic Report</h3>
            <p className="text-sm text-neutral-400">Create strategic intelligence report</p>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-500 mr-2">⚠️</div>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-neutral-600">Generating {reportType} report...</span>
          </div>
        </div>
      )}

      {/* Report History */}
      {reports.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Reports</h3>
            <span className="text-sm text-neutral-500">{reports.length} of {MAX_REPORTS} reports</span>
          </div>
          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <span className="text-primary-600">📊</span>
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{report.title}</p>
                    <p className="text-sm text-neutral-600">
                      {new Date(report.generatedAt).toLocaleDateString('en-GB')} • 
                      {report.recommendations.length} recommendations • 
                      {Math.round(report.metadata.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => loadReport(report.id)}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    View Report
                  </button>
                  <button
                    onClick={() => deleteReportById(report.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete report"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Report Display */}
      {generatedReport && (
        <div className="bg-white rounded-xl shadow-lg border border-neutral-200 overflow-hidden" data-report-result>
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{generatedReport.title}</h3>
                <p className="text-primary-100 text-sm">
                  Generated on {new Date(generatedReport.metadata.generatedAt).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-white text-sm">Confidence: {Math.round(generatedReport.metadata.confidence * 100)}%</div>
                <div className="text-primary-100 text-xs">Type: {generatedReport.metadata.reportType}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Executive Summary */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-6 bg-primary-500 rounded"></div>
                <h4 className="text-lg font-semibold text-neutral-900">Executive Summary</h4>
              </div>
              <p className="text-neutral-700 leading-relaxed">{generatedReport.executiveSummary}</p>
            </div>

            {/* Report Sections */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-6 bg-primary-500 rounded"></div>
                <h4 className="text-lg font-semibold text-neutral-900">Report Sections</h4>
              </div>
              <div className="space-y-4">
                {generatedReport.sections.map((section: any, index: number) => (
                  <div key={index} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <h5 className="font-medium text-neutral-900 mb-2">{section.title}</h5>
                    <p className="text-neutral-700 text-sm leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-1 h-6 bg-primary-500 rounded"></div>
                <h4 className="text-lg font-semibold text-neutral-900">Key Recommendations</h4>
              </div>
              <div className="space-y-3">
                {generatedReport.recommendations.map((recommendation: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 px-6 py-3 border-t border-neutral-200">
            <div className="flex items-center justify-between text-sm text-neutral-500">
              <span>Data Sources: {generatedReport.metadata.dataSources.join(', ')}</span>
              <span>Powered by Mercury CI Report Engine</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

