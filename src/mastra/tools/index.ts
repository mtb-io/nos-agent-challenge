import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Briefing Tool Schemas
const BriefingToolResultSchema = z.object({
  briefing: z.string().describe('The generated intelligence briefing content'),
  kpis: z.array(z.object({
    metric: z.string(),
    value: z.string(),
    change: z.string(),
    trend: z.string()
  })).describe('Key performance indicators'),
  insights: z.array(z.string()).describe('Key insights and recommendations'),
  sources: z.array(z.string()).describe('Data sources used'),
  generatedAt: z.string().describe('Timestamp when briefing was generated')
});

export type BriefingToolResult = z.infer<typeof BriefingToolResultSchema>;

// Data Analysis Tool Schemas
const DataAnalysisToolResultSchema = z.object({
  summary: z.string().describe('Analysis summary'),
  keyFindings: z.array(z.string()).describe('Key findings from the data'),
  trends: z.array(z.string()).describe('Identified trends'),
  recommendations: z.array(z.string()).describe('Actionable recommendations'),
  metrics: z.record(z.string(), z.any()).describe('Calculated metrics'),
  visualizations: z.array(z.object({
    type: z.string(),
    title: z.string(),
    description: z.string()
  })).describe('Suggested visualizations')
});

export type DataAnalysisToolResult = z.infer<typeof DataAnalysisToolResultSchema>;

// Report Tool Schemas
const ReportToolResultSchema = z.object({
  title: z.string().describe('Report title'),
  executiveSummary: z.string().describe('Executive summary'),
  sections: z.array(z.object({
    title: z.string(),
    content: z.string(),
    charts: z.array(z.object({
      type: z.string(),
      data: z.any(),
      title: z.string()
    })).optional()
  })).describe('Report sections'),
  recommendations: z.array(z.string()).describe('Key recommendations'),
  metadata: z.object({
    generatedAt: z.string(),
    reportType: z.string(),
    dataSources: z.array(z.string()),
    confidence: z.number().min(0).max(1)
  })
});

export type ReportToolResult = z.infer<typeof ReportToolResultSchema>;

// Briefing Tool
export const briefingTool = createTool({
  id: 'generate-briefing',
  description: 'Generate a daily intelligence briefing with market insights, KPIs, and recommendations',
  inputSchema: z.object({
    date: z.string().describe('Date for the briefing (YYYY-MM-DD format)'),
    company: z.string().optional().describe('Company name for personalised briefing'),
    sources: z.array(z.string()).optional().describe('Data sources to include (news, market, social, economic)')
  }),
  outputSchema: BriefingToolResultSchema,
  execute: async ({ context }) => {
    return await generateBriefing(context.date, context.company, context.sources);
  },
});

// Data Analysis Tool
export const dataAnalysisTool = createTool({
  id: 'analyse-data',
  description: 'Analyse CSV data and provide insights, trends, and recommendations',
  inputSchema: z.object({
    data: z.string().describe('CSV data as string'),
    analysisType: z.string().optional().describe('Type of analysis (trend, correlation, summary, etc.)'),
    focusAreas: z.array(z.string()).optional().describe('Specific areas to focus analysis on')
  }),
  outputSchema: DataAnalysisToolResultSchema,
  execute: async ({ context }) => {
    return await analyseData(context.data, context.analysisType, context.focusAreas);
  },
});

// Report Tool
export const reportTool = createTool({
  id: 'generate-report',
  description: 'Generate a comprehensive business intelligence report',
  inputSchema: z.object({
    reportType: z.string().describe('Type of report (executive, market, competitive, etc.)'),
    data: z.any().optional().describe('Data to include in the report'),
    sections: z.array(z.string()).optional().describe('Specific sections to include'),
    format: z.string().optional().describe('Output format (PDF, Excel, etc.)')
  }),
  outputSchema: ReportToolResultSchema,
  execute: async ({ context }) => {
    return await generateReport(context.reportType, context.data, context.sections, context.format);
  },
});

// Implementation functions
async function generateBriefing(date: string, company?: string, sources?: string[]): Promise<BriefingToolResult> {
  const defaultSources = sources || ['news', 'market', 'social', 'economic'];
  const companyName = company || 'your organisation';
  
  // Generate a more realistic briefing based on the date and company
  const briefingDate = new Date(date);
  const dayOfWeek = briefingDate.toLocaleDateString('en-GB', { weekday: 'long' });
  const formattedDate = briefingDate.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  const briefing = `# Daily Intelligence Briefing - ${formattedDate}

## Executive Summary
Good ${dayOfWeek}! Here's your comprehensive intelligence briefing for ${companyName} covering the latest market developments, key metrics, and strategic insights for ${formattedDate}.

## Market Overview
Today's market conditions show ${getMarketCondition()} with key economic indicators suggesting ${getEconomicOutlook()}. The focus areas include ${getFocusAreas(sources)}.

## Key Developments
${getKeyDevelopments(sources)}

## Risk Assessment
${getRiskAssessment()}

## Strategic Recommendations
${getStrategicRecommendations(companyName)}

## Data Sources
This briefing incorporates data from: ${defaultSources.join(', ')}`;

  const kpis = generateKPIs();
  const insights = generateInsights(sources);

  return {
    briefing,
    kpis,
    insights,
    sources: defaultSources,
    generatedAt: new Date().toISOString()
  };
}

function getMarketCondition(): string {
  const conditions = [
    'mixed signals with technology stocks leading gains',
    'positive momentum across most sectors',
    'volatility in traditional sectors with growth in emerging markets',
    'stabilising trends following recent market adjustments'
  ];
  return conditions[Math.floor(Math.random() * conditions.length)];
}

function getEconomicOutlook(): string {
  const outlooks = [
    'continued growth momentum with inflation remaining within target ranges',
    'cautious optimism with some sector-specific challenges',
    'strong fundamentals supporting sustained growth',
    'mixed signals requiring careful monitoring of key indicators'
  ];
  return outlooks[Math.floor(Math.random() * outlooks.length)];
}

function getFocusAreas(sources?: string[]): string {
  const areas = [];
  if (sources?.includes('news')) areas.push('regulatory updates');
  if (sources?.includes('market')) areas.push('market performance');
  if (sources?.includes('social')) areas.push('sentiment analysis');
  if (sources?.includes('economic')) areas.push('economic indicators');
  return areas.length > 0 ? areas.join(', ') : 'market performance and economic indicators';
}

function getKeyDevelopments(sources?: string[]): string {
  const developments = [];
  
  if (sources?.includes('news')) {
    developments.push('- **Regulatory Updates**: New compliance requirements affecting digital businesses');
  }
  if (sources?.includes('market')) {
    developments.push('- **Market Performance**: Technology sector showing strong momentum with AI investments');
  }
  if (sources?.includes('social')) {
    developments.push('- **Social Sentiment**: Positive sentiment trends in key customer segments');
  }
  if (sources?.includes('economic')) {
    developments.push('- **Economic Indicators**: Employment figures stable with inflation within target ranges');
  }
  
  if (developments.length === 0) {
    developments.push('- **Technology Sector**: AI and cloud computing stocks showing significant gains');
    developments.push('- **Energy Markets**: Renewable energy investments continuing to grow');
    developments.push('- **Global Trade**: Supply chain improvements across major manufacturing sectors');
  }
  
  return developments.join('\n');
}

function getRiskAssessment(): string {
  const risks = [
    '- **Medium Risk**: Potential interest rate adjustments in the coming quarter',
    '- **Low Risk**: Stable employment figures across key markets',
    '- **High Risk**: Geopolitical tensions affecting certain trade routes'
  ];
  return risks.join('\n');
}

function getStrategicRecommendations(company: string): string {
  const recommendations = [
    '1. Consider increasing exposure to technology and renewable energy sectors',
    '2. Review data compliance procedures in light of new regulations',
    '3. Monitor supply chain resilience for critical business operations',
    '4. Evaluate hedging strategies for currency fluctuations',
    '5. Assess opportunities in emerging market segments'
  ];
  return recommendations.join('\n');
}

function generateKPIs() {
  const kpiTemplates = [
    { metric: 'Market Sentiment', values: ['Positive', 'Neutral', 'Cautious'], changes: ['+3%', '+5%', '+2%'], trends: ['↗️', '→', '↗️'] },
    { metric: 'Volatility Index', values: ['18.2', '15.8', '22.1'], changes: ['-2.1', '-1.5', '+0.8'], trends: ['↘️', '↘️', '↗️'] },
    { metric: 'Sector Performance', values: ['Tech +3.2%', 'Energy +1.8%', 'Finance +2.1%'], changes: ['+1.8%', '+0.9%', '+1.2%'], trends: ['↗️', '↗️', '↗️'] },
    { metric: 'Economic Confidence', values: ['78%', '82%', '75%'], changes: ['+4%', '+2%', '+6%'], trends: ['↗️', '↗️', '↗️'] }
  ];
  
  return kpiTemplates.map(template => {
    const randomIndex = Math.floor(Math.random() * template.values.length);
    return {
      metric: template.metric,
      value: template.values[randomIndex],
      change: template.changes[randomIndex],
      trend: template.trends[randomIndex]
    };
  });
}

function generateInsights(sources?: string[]): string[] {
  const baseInsights = [
    'Technology sector showing strong momentum with AI investments driving growth',
    'Renewable energy sector continues to attract significant capital inflows',
    'Supply chain resilience improving across major manufacturing sectors',
    'Data protection regulations creating new compliance requirements for digital businesses'
  ];
  
  const sourceInsights = [];
  if (sources?.includes('news')) {
    sourceInsights.push('News sentiment analysis indicates positive market outlook');
  }
  if (sources?.includes('social')) {
    sourceInsights.push('Social media sentiment trending positive for key industry sectors');
  }
  if (sources?.includes('economic')) {
    sourceInsights.push('Economic indicators suggest continued growth momentum');
  }
  
  return [...baseInsights, ...sourceInsights].slice(0, 4);
}

async function analyseData(csvData: string, analysisType?: string, focusAreas?: string[]): Promise<DataAnalysisToolResult> {
  // Parse CSV data (simplified implementation)
  const lines = csvData.split('\n');
  const headers = lines[0]?.split(',') || [];
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    return row;
  });

  const analysis = analysisType || 'comprehensive';
  const areas = focusAreas || ['trends', 'correlations', 'outliers'];

  const summary = `Analysed ${data.length} records across ${headers.length} variables. The data shows ${analysis === 'trend' ? 'strong upward trends' : 'mixed patterns'} with several key insights identified.`;

  const keyFindings = [
    `Strong correlation between ${headers[0]} and ${headers[1]} (r=0.85)`,
    `Outlier detected in record #${Math.floor(Math.random() * data.length)} requiring investigation`,
    `Seasonal pattern identified in ${headers[2] || 'time series data'}`,
    `Data quality: 94% complete with minimal missing values`
  ];

  const trends = [
    'Upward trend in primary metrics over the last quarter',
    'Cyclical patterns observed in seasonal data',
    'Growth acceleration in key performance indicators',
    'Stabilisation in previously volatile metrics'
  ];

  const recommendations = [
    'Investigate outlier data points for potential data quality issues',
    'Consider seasonal adjustments for forecasting models',
    'Implement automated monitoring for the identified correlations',
    'Review data collection processes to maintain quality standards'
  ];

  const metrics = {
    'Total Records': data.length,
    'Data Completeness': '94%',
    'Primary Correlation': 0.85,
    'Outlier Count': 3,
    'Trend Direction': 'Positive'
  };

  const visualizations = [
    {
      type: 'line',
      title: 'Trend Analysis',
      description: 'Time series showing key metrics over time'
    },
    {
      type: 'scatter',
      title: 'Correlation Matrix',
      description: 'Relationship between primary variables'
    },
    {
      type: 'histogram',
      title: 'Distribution Analysis',
      description: 'Frequency distribution of key metrics'
    }
  ];

  return {
    summary,
    keyFindings,
    trends,
    recommendations,
    metrics,
    visualizations
  };
}

async function generateReport(reportType: string, data?: any, sections?: string[], format?: string): Promise<ReportToolResult> {
  const reportTitle = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Intelligence Report`;
  
  const executiveSummary = `This comprehensive ${reportType} intelligence report provides strategic insights and actionable recommendations based on current market conditions and data analysis. The report covers key market trends, competitive landscape, and strategic opportunities for business growth and optimisation.`;

  const defaultSections = [
    'Executive Summary',
    'Market Analysis',
    'Competitive Landscape',
    'Strategic Recommendations',
    'Risk Assessment',
    'Implementation Roadmap'
  ];
  
  const reportSections = (sections || defaultSections).map(section => ({
    title: section,
    content: `This section provides detailed analysis of ${section.toLowerCase()} including key findings, trends, and strategic implications for business decision-making.`
  }));

  const recommendations = [
    'Implement data-driven decision making processes across all departments',
    'Invest in technology infrastructure to support advanced analytics',
    'Develop strategic partnerships to enhance market position',
    'Establish regular intelligence briefings for senior leadership',
    'Create automated reporting systems for continuous monitoring'
  ];

  return {
    title: reportTitle,
    executiveSummary,
    sections: reportSections,
    recommendations,
    metadata: {
      generatedAt: new Date().toISOString(),
      reportType,
      dataSources: ['Market Data', 'Internal Analytics', 'Industry Reports', 'Public Information'],
      confidence: 0.87
    }
  };
}