# Mercury CI - Commercial Intelligence Platform
**AI-powered commercial intelligence for teams**

![Mercury CI](./assets/NosanaBuildersChallenge03.jpg)

## Welcome to Mercury CI

Mercury CI is an AI-powered commercial intelligence platform that helps teams generate daily briefings, analyse CSV data, and create actionable business insights. Built with the **Mastra framework** and deployed on the **Nosana decentralized compute network**.

## 🎯 Platform Overview

**Mission:** Transform raw data into actionable intelligence through AI-powered analysis and automated reporting.

### Key Features

Mercury CI provides intelligent business analysis through:
- **Daily Intelligence Briefings** - Automated market and business insights
- **CSV Data Analysis** - Upload and analyse business data with AI insights
- **Automated Reporting** - Generate comprehensive reports and exports
- **Natural Language Queries** - Ask questions about your data in plain English
- **Memory System** - Learns from your preferences and gets smarter over time

### Technology Stack

Mercury CI is built with modern technologies:
- **Mastra Framework** - AI agent orchestration and management
- **CopilotKit** - Natural language chat interface
- **Next.js** - React-based frontend framework
- **OpenAI GPT-4o** - Advanced language model for intelligence
- **Docker** - Containerized deployment
- **Nosana Network** - Decentralized compute infrastructure

## Getting Started

### Quick Start with Docker Compose

The fastest way to get Mercury CI running:

```bash
# Clone the repository
git clone https://github.com/mtb-io/nos-agent-challenge.git
cd nos-agent-challenge

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start with Docker Compose
docker compose up --build

# Access Mercury CI at http://localhost:3000
```

### Prerequisites & Registration

To participate in the challenge and get Nosana credits/NOS tokens, complete these steps:

1. Register at [SuperTeam](https://earn.superteam.fun/listing/nosana-builders-challenge-agents-102)
2. Register at the [Luma Page](https://luma.com/zkob1iae)
3. Star these repos:
   - [this repo](https://github.com/nosana-ci/agent-challenge)
   - [Nosana CLI](https://github.com/nosana-ci/nosana-cli)
   - [Nosana SDK](https://github.com/nosana-ci/nosana-sdk)
4. Complete [this registration form](https://e86f0b9c.sibforms.com/serve/MUIFALaEjtsXB60SDmm1_DHdt9TOSRCFHOZUSvwK0ANbZDeJH-sBZry2_0YTNi1OjPt_ZNiwr4gGC1DPTji2zdKGJos1QEyVGBzTq_oLalKkeHx3tq2tQtzghyIhYoF4_sFmej1YL1WtnFQyH0y1epowKmDFpDz_EdGKH2cYKTleuTu97viowkIIMqoDgMqTD0uBaZNGwjjsM07T)

### Setup Your Development Environment

#### **Step 1: Fork, Clone and Quickstart**

```bash
# Fork this repo on GitHub, then clone your fork
git clone https://github.com/YOUR-USERNAME/agent-challenge

cd agent-challenge

cp .env.example .env

pnpm i

pnpm run dev:ui      # Start UI server (port 3000)
pnpm run dev:agent   # Start Mastra agent server (port 4111)
```

Open <http://localhost:3000> to see your agent in action in the frontend.
Open <http://localhost:4111> to open up the Mastra Agent Playground.

#### **Step 2: Choose Your LLM for Development (Optional)**

Pick one option below to power your agent during development:

##### Option A: Use Shared Nosana LLM Endpoint (Recommended - No Setup!)

We provide a free LLM endpoint hosted on Nosana for development. Edit your `.env`:

```env
# Qwen3:8b - Nosana Endpoint
# Note baseURL for Ollama needs to be appended with `/api`
OLLAMA_API_URL=https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/api
MODEL_NAME_AT_ENDPOINT=qwen3:8b
```

If it goes down, reach out on [Discord](https://discord.com/channels/236263424676331521/1354391113028337664)

##### Option B: Use Local LLM

Run Ollama locally (requires [Ollama installed](https://ollama.com/download)):

```bash
ollama pull qwen3:0.6b
ollama serve
```

Edit your `.env`:
```env
OLLAMA_API_URL=http://127.0.0.1:11434/api
MODEL_NAME_AT_ENDPOINT=qwen3:0.6b
```

##### Option C: Use OpenAI

Add to your `.env` and uncomment the OpenAI line in `src/mastra/agents/index.ts`:

```env
OPENAI_API_KEY=your-key-here
```

## 🏗️ Implementation Timeline

**Important Dates:**
- Start Challenge: 10 October
- Submission Deadline: 31 October
- Winners Announced: 07 October

### Phase 1: Development

1. **Setup** : Fork repo, install dependencies, choose template
2. **Build** : Implement your tool functions and agent logic
3. **Test** : Validate functionality at http://localhost:3000

### Phase 2: Containerization

1. **Clean up**: Remove unused agents from `src/mastra/index.ts`
2. **Build**: Create Docker container using the provided `Dockerfile`
3. **Test locally**: Verify container works correctly

#### Option A: Using Docker Compose (Recommended)

```bash
# Build and start Mercury CI with Docker Compose
docker compose up --build

# Stop the services
docker compose down

# View logs
docker compose logs -f
```

#### Option B: Manual Docker Commands

```bash
# Build your container (using the provided Dockerfile)
docker build -t mtb-io/nos-agent-challenge:latest .

# Test locally first
docker run -p 3000:3000 -p 4111:4111 mtb-io/nos-agent-challenge:latest 

# Push to Docker Hub
docker login
docker push mtb-io/nos-agent-challenge:latest
```

#### Docker Compose Configuration

The included `docker-compose.yml` provides:
- **Frontend**: Next.js app on port 3000
- **Backend**: Mastra agent API on port 4111
- **Environment**: Automatic `.env` file loading
- **Networking**: Internal service communication

### Phase 3: Deployment to Nosana
1. **Deploy your complete stack**: The provided `Dockerfile` will deploy:
   - Your Mastra agent
   - Your frontend interface
   - An LLM to power your agent (all in one container!)
2. **Verify**: Test your deployed agent on Nosana network
3. **Capture proof**: Screenshot or get deployment URL for submission

### Phase 4: Video Demo

Record a 1-3 minute video demonstrating:
- Your agent **running on Nosana** (show the deployed version!)
- Key features and functionality
- The frontend interface in action
- Real-world use case demonstration
- Upload to YouTube, Loom, or similar platform

### Phase 5: Documentation

Update this README with:
- Agent description and purpose
- What tools/APIs your agent uses
- Setup instructions
- Environment variables required
- Example usage and screenshots

## ✅ Mercury CI Features

Current implementation includes:

- [x] **Mercury CI Agent** - Commercial intelligence assistant with OpenAI integration
- [x] **Modern UI** - Three-tab interface (Briefing, Data, Artifacts) with animations
- [x] **Docker Support** - Complete containerization with Docker Compose
- [x] **British English** - Proper UK spelling and date formats throughout
- [x] **MIT License** - Open source distribution
- [x] **Comprehensive Documentation** - Setup and deployment instructions
- [ ] **Google OAuth** - User authentication (planned)
- [ ] **CSV Analysis** - Real data processing (planned)
- [ ] **Report Generation** - Automated PDF/Excel exports (planned)

## 🚀 Next Steps

### Phase 1: Core Functionality (Current)
- ✅ Mercury CI UI and branding
- ✅ Docker Compose setup
- ✅ OpenAI integration
- ✅ Basic agent configuration

### Phase 2: Data Integration (Planned)
- 🔄 Google OAuth authentication
- 🔄 Gmail/Calendar API integration
- 🔄 CSV file upload and analysis
- 🔄 Real-time data collection

### Phase 3: Advanced Features (Future)
- 🔄 Automated report generation
- 🔄 Advanced analytics and insights
- 🔄 Multi-user collaboration
- 🔄 Nosana deployment

## 🚀 Deploying to Nosana


### Using Nosana Dashboard
1. Open [Nosana Dashboard](https://dashboard.nosana.com/deploy)
2. Click `Expand` to open the job definition editor
3. Edit `nos_job_def/nosana_mastra.json` with your Docker image:
   ```json
   {
     "image": "yourusername/agent-challenge:latest"
   }
   ```
4. Copy and paste the edited job definition
5. Select a GPU
6. Click `Deploy`

### Using Nosana CLI (Alternative)
```bash
npm install -g @nosana/cli
nosana job post --file ./nos_job_def/nosana_mastra.json --market nvidia-3090 --timeout 30
```

## 🏆 Judging Criteria

Submissions evaluated on 4 key areas (25% each):

### 1. Innovation 🎨
- Originality of agent concept
- Creative use of AI capabilities
- Unique problem-solving approach

### 2. Technical Implementation 💻
- Code quality and organization
- Proper use of Mastra framework
- Efficient tool implementation
- Error handling and robustness

### 3. Nosana Integration ⚡
- Successful deployment on Nosana
- Resource efficiency
- Stability and performance
- Proper containerization

### 4. Real-World Impact 🌍
- Practical use cases
- Potential for adoption
- Clear value proposition
- Demonstration quality

## 🎁 Prizes

**Top 10 submissions will be rewarded:**
- 🥇 1st Place: $1,000 USDC
- 🥈 2nd Place: $750 USDC
- 🥉 3rd Place: $450 USDC
- 🏅 4th Place: $200 USDC
- 🏅 5th-10th Place: $100 USDC each

## 📚 Learning Resources

For more information, check out the following resources:

- [Nosana Documentation](https://docs.nosana.io)
- [Mastra Documentation](https://mastra.ai/en/docs) - Learn more about Mastra and its features
- [CopilotKit Documentation](https://docs.copilotkit.ai) - Explore CopilotKit's capabilities
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Docker Documentation](https://docs.docker.com)
- [Nosana CLI](https://github.com/nosana-ci/nosana-cli)
- [Mastra Agents Overview](https://mastra.ai/en/docs/agents/overview)
- [Build an AI Stock Agent Guide](https://mastra.ai/en/guides/guide/stock-agent)
- [Mastra Tool Calling Documentation](https://mastra.ai/en/docs/agents/tools)

## 🆘 Support & Community

### Get Help
- **Discord**: Join [Nosana Discord](https://nosana.com/discord) 
- **Dedicated Channel**: [Builders Challenge Dev Chat](https://discord.com/channels/236263424676331521/1354391113028337664)
- **Twitter**: Follow [@nosana_ai](https://x.com/nosana_ai) for live updates

## 🎉 Ready to Build?

1. **Fork** this repository
2. **Build** your AI agent
3. **Deploy** to Nosana
4. **Present** your creation

Good luck, builders! We can't wait to see the innovative AI agents you create for the Nosana ecosystem.

**Happy Building!** 🚀

## Stay in the Loop

Want access to exclusive builder perks, early challenges, and Nosana credits?
Subscribe to our newsletter and never miss an update.

👉 [ Join the Nosana Builders Newsletter ](https://e86f0b9c.sibforms.com/serve/MUIFALaEjtsXB60SDmm1_DHdt9TOSRCFHOZUSvwK0ANbZDeJH-sBZry2_0YTNi1OjPt_ZNiwr4gGC1DPTji2zdKGJos1QEyVGBzTq_oLalKkeHx3tq2tQtzghyIhYoF4_sFmej1YL1WtnFQyH0y1epowKmDFpDz_EdGKH2cYKTleuTu97viowkIIMqoDgMqTD0uBaZNGwjjsM07T)

Be the first to know about:
- 🧠 Upcoming Builders Challenges
- 💸 New reward opportunities
- ⚙ Product updates and feature drops
- 🎁 Early-bird credits and partner perks

Join the Nosana builder community today — and build the future of decentralized AI.


