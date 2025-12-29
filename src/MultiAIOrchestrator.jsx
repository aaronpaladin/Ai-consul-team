import React, { useState, useRef, useEffect } from 'react';
import { Brain, Zap, Sparkles, Send, Users, MessageSquare, GitBranch, CheckCircle, AlertTriangle, Lightbulb, Code, Search, Presentation, Scale, ThumbsUp } from 'lucide-react';

const MultiAIOrchestrator = () => {
  const [task, setTask] = useState('');
  const [workflow, setWorkflow] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [sharedContext, setSharedContext] = useState([]);
  const [userDecision, setUserDecision] = useState(null);
  const workflowEndRef = useRef(null);

  useEffect(() => {
    if (workflowEndRef.current) {
      workflowEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [workflow]);

  const aiModels = {
    claude: { name: 'Claude', icon: Brain, color: 'bg-orange-500', borderColor: 'border-orange-500' },
    gemini: { name: 'Gemini', icon: Sparkles, color: 'bg-blue-500', borderColor: 'border-blue-500' },
    grok: { name: 'Grok', icon: Zap, color: 'bg-purple-500', borderColor: 'border-purple-500' }
  };

  const roleIcons = {
    coordinator: Users, programmer: Code, researcher: Search, analyst: Brain,
    presenter: Presentation, critic: AlertTriangle, synthesizer: Lightbulb, candidate: MessageSquare
  };

  const addWorkflowStep = (step) => {
    setWorkflow(prev => [...prev, { ...step, timestamp: new Date().toISOString(), id: `step-${Date.now()}-${Math.random()}` }]);
  };

  const addToContext = (ai, role, content) => {
    setSharedContext(prev => [...prev, { ai, role, content, timestamp: new Date().toISOString() }]);
  };

  const simulateThinking = async (duration = 1000) => {
    await new Promise(resolve => setTimeout(resolve, duration));
  };

  const waitForUserDecision = () => {
    return new Promise((resolve) => {
      const checkDecision = setInterval(() => {
        if (userDecision !== null) {
          clearInterval(checkDecision);
          resolve(userDecision);
        }
      }, 100);
    });
  };

  const phaseDebate = async () => {
    setCurrentPhase('Debate & Critique Phase');
    
    addWorkflowStep({ phase: 'debate', type: 'group_chat', content: 'Team reviewing work with full context...' });
    await simulateThinking(600);
    
    addWorkflowStep({
      phase: 'debate', ai: 'gemini', role: 'critic', action: 'challenging',
      content: `I see a potential issue. Have we considered scalability? The current design might face bottlenecks.`
    });
    await simulateThinking(800);
    
    addWorkflowStep({
      phase: 'debate', ai: 'claude', role: 'programmer', action: 'defending',
      content: `I designed it with scalability in mind using lazy loading. However, I see two valid approaches here.`
    });
    await simulateThinking(600);
    
    addWorkflowStep({
      phase: 'debate', ai: 'grok', role: 'analyst', action: 'disagreeing',
      content: `I disagree with both. Based on current trends, we should prioritize real-time features. The architecture should be event-driven from the start.`
    });
    await simulateThinking(800);
    
    addWorkflowStep({
      phase: 'disagreement', type: 'user_input_needed',
      disagreementData: {
        topic: 'Architecture Approach',
        options: [
          { ai: 'claude', position: 'Traditional Scalability First', reasoning: 'Build on proven patterns with lazy loading and pagination. Solid foundation, then add features.' },
          { ai: 'grok', position: 'Event-Driven Real-Time First', reasoning: 'Modern users expect real-time. Build event-driven architecture from the start, optimize later.' }
        ]
      }
    });
    
    const decision = await waitForUserDecision();
    const disagreementData = workflow.find(s => s.type === 'user_input_needed')?.disagreementData;
    
    if (disagreementData) {
      addWorkflowStep({
        phase: 'user_decision', type: 'user_referee',
        content: `You chose: ${disagreementData.options[decision].position}\n\nReasoning: ${disagreementData.options[decision].reasoning}\n\nThe team will proceed with this direction.`
      });
      
      addToContext('user', 'referee', `Decision: ${disagreementData.options[decision].position}`);
      await simulateThinking(600);
      
      addWorkflowStep({
        phase: 'debate', type: 'team_alignment',
        content: `Team acknowledges your decision. All members are now aligned on the ${disagreementData.options[decision].position.toLowerCase()} approach.`
      });
    }
    
    setUserDecision(null);
  };

  const handleSubmit = async () => {
    if (!task.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setWorkflow([]);
    setSharedContext([]);
    setUserDecision(null);
    
    try {
      setCurrentPhase('Task Analysis');
      addWorkflowStep({ phase: 'init', ai: 'claude', role: 'coordinator', action: 'analyzing', content: `Analyzing: "${task}"` });
      await simulateThinking(800);
      
      addWorkflowStep({ phase: 'roles', type: 'consensus', content: `Roles Assigned:\n• Claude: Programmer\n• Gemini: Researcher\n• Grok: Analyst` });
      await simulateThinking(600);
      
      setCurrentPhase('Initial Work');
      addWorkflowStep({ phase: 'work', ai: 'claude', role: 'programmer', action: 'delivering', content: `Programming Approach:\n\n• Modular design\n• Error handling covered\n• Performance optimized` });
      addToContext('claude', 'programmer', 'Modular architecture proposed');
      await simulateThinking(1000);
      
      addWorkflowStep({ phase: 'work', ai: 'gemini', role: 'researcher', action: 'delivering', content: `Research Findings:\n\n• Best practices identified\n• Multiple approaches compared\n• Industry standards reviewed` });
      addToContext('gemini', 'researcher', 'Research validates approach');
      await simulateThinking(1000);
      
      addWorkflowStep({ phase: 'work', ai: 'grok', role: 'analyst', action: 'delivering', content: `Context Analysis:\n\n• Recent trends reviewed\n• Real-world patterns analyzed\n• Community feedback considered` });
      addToContext('grok', 'analyst', 'Current trends analyzed');
      await simulateThinking(1000);
      
      await phaseDebate();
      
      setCurrentPhase('Final Synthesis');
      addWorkflowStep({ phase: 'synthesis', ai: 'claude', role: 'presenter', action: 'synthesizing', content: `Pulling together all insights...` });
      await simulateThinking(1000);
      
      addWorkflowStep({
        phase: 'final', type: 'team_result',
        content: `Team Collaborative Solution\n\nYour Task: "${task}"\n\nAfter team discussion, YOUR guidance on key decisions, and iterative refinement:\n\n1. Core Implementation (Claude)\n• Architecture based on YOUR decision\n• Context-aware design\n• Performance-optimized\n\n2. Research-Backed (Gemini)\n• Industry best practices\n• Your guidance confirmed\n\n3. Context Integration (Grok)\n• Real-time considerations\n• Latest trends\n\nContext Exchanges: ${sharedContext.length}\n\nTeam Confidence: High ✓\nUser Guidance: Yes ✓\nConsensus: Yes ✓`
      });
    } catch (error) {
      addWorkflowStep({ phase: 'error', type: 'error', content: 'An error occurred. Please try again.' });
    } finally {
      setIsProcessing(false);
      setCurrentPhase('');
    }
  };

  const handleUserChoice = (choiceIndex) => {
    setUserDecision(choiceIndex);
  };

  const getStepStyle = (step) => {
    if (step.type === 'group_chat') return 'bg-slate-700/50 border-slate-600';
    if (step.type === 'consensus') return 'bg-green-900/30 border-green-500/50';
    if (step.type === 'team_result') return 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500';
    if (step.type === 'user_input_needed') return 'bg-cyan-900/50 border-l-4 border-cyan-400';
    if (step.type === 'user_referee') return 'bg-cyan-900/30 border-cyan-500/50';
    if (step.type === 'team_alignment') return 'bg-green-900/30 border-green-500/50';
    if (step.ai && aiModels[step.ai]) return `bg-slate-800/50 border-l-4 ${aiModels[step.ai].borderColor}`;
    return 'bg-slate-800/50 border-slate-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GitBranch className="w-10 h-10 text-purple-400" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Collaborative AI Team
            </h1>
          </div>
          <p className="text-slate-300">AI models collaborate • You referee disagreements</p>
        </div>

        {sharedContext.length > 0 && (
          <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Shared Context: {sharedContext.length} exchanges</span>
            </div>
          </div>
        )}

        <div className="bg-slate-800/50 rounded-2xl p-4 mb-4 border border-slate-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            What should the team work on?
          </h2>
          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="e.g., 'Build a task management app with real-time collaboration'"
            className="w-full h-24 bg-slate-700/50 border border-slate-600 rounded-xl p-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 resize-none text-sm"
            disabled={isProcessing}
          />
          <button
            onClick={handleSubmit}
            disabled={isProcessing || !task.trim()}
            className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
          >
            {isProcessing ? <><Users className="w-5 h-5 animate-pulse" />Team Collaborating...</> : <><Send className="w-5 h-5" />Start Team</>}
          </button>
        </div>

        {currentPhase && (
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-3 mb-4 flex items-center gap-3 animate-pulse">
            <GitBranch className="w-5 h-5 text-purple-400" />
            <span className="font-semibold text-purple-200 text-sm">{currentPhase}</span>
          </div>
        )}

        {workflow.length > 0 && (
          <div className="space-y-3">
            {workflow.map((step) => {
              const model = step.ai && aiModels[step.ai] ? aiModels[step.ai] : null;
              const ModelIcon = model ? model.icon : null;
              const RoleIcon = step.role && roleIcons[step.role] ? roleIcons[step.role] : MessageSquare;
              
              return (
                <div key={step.id} className={`${getStepStyle(step)} rounded-xl p-4 border transition-all`}>
                  {step.type === 'group_chat' && (
                    <div className="flex items-center gap-3 text-slate-400 text-sm">
                      <Users className="w-4 h-4" />
                      <span className="italic">{step.content}</span>
                    </div>
                  )}
                  
                  {step.type === 'consensus' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
                        <CheckCircle className="w-4 h-4" />Consensus Reached
                      </div>
                      <div className="text-slate-200 whitespace-pre-line text-sm">{step.content}</div>
                    </div>
                  )}
                  
                  {step.type === 'user_input_needed' && step.disagreementData && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Scale className="w-6 h-6 text-cyan-400" />
                        <div>
                          <h3 className="text-lg font-bold text-cyan-300">Your Decision Needed</h3>
                          <p className="text-cyan-200 text-xs">{step.disagreementData.topic}</p>
                        </div>
                      </div>
                      <p className="text-slate-200 text-sm">The team needs your guidance:</p>
                      <div className="space-y-3">
                        {step.disagreementData.options.map((option, idx) => {
                          const optModel = aiModels[option.ai];
                          const OptIcon = optModel.icon;
                          return (
                            <button
                              key={idx}
                              onClick={() => handleUserChoice(idx)}
                              disabled={userDecision !== null}
                              className="w-full bg-slate-700/50 hover:bg-slate-600/50 border-2 border-slate-500 hover:border-cyan-400 disabled:border-green-500 disabled:bg-green-900/30 rounded-xl p-4 text-left transition-all group disabled:cursor-not-allowed"
                            >
                              <div className="flex items-start gap-3">
                                <div className={`${optModel.color} p-2 rounded-lg`}>
                                  <OptIcon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm text-white">{option.position}</span>
                                    <span className="text-slate-400 text-xs">({optModel.name})</span>
                                  </div>
                                  <p className="text-slate-300 text-xs">{option.reasoning}</p>
                                  {userDecision === null && (
                                    <div className="mt-2 flex items-center gap-2 text-cyan-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ThumbsUp className="w-3 h-3" />Click to choose
                                    </div>
                                  )}
                                  {userDecision === idx && (
                                    <div className="mt-2 flex items-center gap-2 text-green-400 text-xs font-semibold">
                                      <CheckCircle className="w-3 h-3" />Selected ✓
                                    </div>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {step.type === 'user_referee' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                        <Scale className="w-5 h-5" />Your Decision
                      </div>
                      <div className="text-slate-200 whitespace-pre-line text-sm">{step.content}</div>
                    </div>
                  )}
                  
                  {step.type === 'team_alignment' && (
                    <div className="flex items-center gap-3 text-green-400 italic text-sm">
                      <CheckCircle className="w-5 h-5" />{step.content}
                    </div>
                  )}
                  
                  {step.type === 'team_result' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-purple-300 font-bold">
                        <Lightbulb className="w-5 h-5" />Final Team Solution
                      </div>
                      <div className="text-slate-200 whitespace-pre-line text-sm leading-relaxed">{step.content}</div>
                    </div>
                  )}
                  
                  {step.ai && !step.type && model && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 flex-wrap text-sm">
                        {ModelIcon && <ModelIcon className="w-4 h-4" />}
                        <span className="font-bold">{model.name}</span>
                        <span className="text-slate-400">•</span>
                        <RoleIcon className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400 text-xs capitalize">{step.role}</span>
                        {step.action && <><span className="text-slate-400">•</span><span className="text-purple-400 text-xs">{step.action}</span></>}
                      </div>
                      <div className="text-slate-200 whitespace-pre-line text-sm leading-relaxed">{step.content}</div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={workflowEndRef} />
          </div>
        )}

        {workflow.length === 0 && !isProcessing && (
          <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />How It Works
            </h3>
            <div className="space-y-2 text-xs text-blue-200">
              <p><strong>1. Task Analysis:</strong> Team self-assigns roles</p>
              <p><strong>2. Sequential Work:</strong> Each AI builds on previous context</p>
              <p><strong>3. Debate:</strong> AIs challenge each other</p>
              <p><strong>4. YOUR Decision:</strong> You resolve fundamental disagreements</p>
              <p><strong>5. Refinement:</strong> Team refines based on your guidance</p>
              <p><strong>6. Synthesis:</strong> Final solution incorporating your judgment</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiAIOrchestrator;
