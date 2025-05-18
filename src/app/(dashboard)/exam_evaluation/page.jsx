"use client"
import { useState, useEffect } from 'react';
import {
  FileUp,
  FileQuestion,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon,
  AlertCircle,
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle2,
  Brain
} from 'lucide-react';
import axios from 'axios';
import {
  Legend,
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function ExamAnalyzer() {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Show entry animation
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
   
    return () => clearTimeout(timer);
  }, []);

  // Handle file drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
   
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
   
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setAnalysis(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setUploadProgress(0);
   
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/analyze-exam', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setAnalysis(res.data);
      setActiveTab('overview');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to analyze exam');
    }
    setLoading(false);
  };

  // Data processing functions
  const bloomData = () => {
    if (!analysis) return [];
    const counts = {};
    analysis.questions.forEach(q => {
      counts[q['Bloom Level']] = (counts[q['Bloom Level']] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  };

  const topicData = () => {
    if (!analysis) return [];
    const counts = {};
    analysis.questions.forEach(q => {
      counts[q['Topic']] = (counts[q['Topic']] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
  };

  const pointData = () => {
    if (!analysis) return [];
    return analysis.questions.map(q => ({
      name: q['Question Number'],
      points: q['Final Points']
    }));
  };

  const difficultyData = () => {
    if (!analysis) return [];
   
    // Calculate counts of each difficulty level
    const levels = ['Easy', 'Medium', 'Hard'];
    const counts = {
      'Easy': 0,
      'Medium': 0,
      'Hard': 0
    };
   
    analysis.questions.forEach(q => {
      // Assuming question has difficulty level; you might need to derive this from Bloom level
      const difficulty = q['Difficulty'] || 'Medium'; // Default to Medium if not specified
      counts[difficulty] = (counts[difficulty] || 0) + 1;
    });
   
    return levels.map(level => ({
      subject: level,
      A: counts[level],
      fullMark: analysis.questions.length
    }));
  };

  // Calculate overall exam quality score (example metric)
  const calculateQualityScore = () => {
    if (!analysis) return 0;
   
    // This is a simplified example. You could create a more sophisticated scoring system
    const bloomLevels = bloomData();
    const topics = topicData();
   
    // Score based on bloom taxonomy distribution (better if higher levels are included)
    const hasHigherOrderThinking = bloomLevels.some(item =>
      ['Analysis', 'Synthesis', 'Evaluation', 'Creating', 'Evaluating', 'Analyzing'].includes(item.name)
    );
   
    // Score based on topic coverage (better if more topics)
    const topicCoverageScore = Math.min(topics.length * 10, 50);
   
    // Score based on question quality (using recommendations as a proxy)
    const recommendationScore = analysis.questions.reduce((score, q) => {
      // If recommendation suggests improvements, reduce score slightly
      return score - (q['Recommendation'].includes('improve') ? 5 : 0);
    }, 50);
   
    const totalScore = (hasHigherOrderThinking ? 30 : 0) + topicCoverageScore + recommendationScore;
    return Math.min(Math.max(totalScore, 0), 100);
  };

  // UI color constants
  const COLORS = ['#3b82f6', '#dc2626', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];
  const qualityScore = calculateQualityScore();
  const qualityColor =
    qualityScore >= 80 ? 'text-emerald-500' :
    qualityScore >= 60 ? 'text-amber-500' : 'text-rose-500';

  // Get suggested improvements count
  const getSuggestionsCount = () => {
    if (!analysis) return 0;
    return analysis.questions.filter(q =>
      q['Recommendation'] && q['Recommendation'].trim() !== '' &&
      !q['Recommendation'].toLowerCase().includes('excellent')
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      {/* Animated intro - only shows on first load */}
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <div className="text-center">
            <Brain size={64} className="mx-auto text-red-600 animate-pulse" />
            <h1 className="mt-4 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
              Exam Analyzer AI
            </h1>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-600">
            AI Exam Analyzer
          </h1>
          <p className="mt-2 text-lg text-slate-600">Upload your exam document for AI-powered insights and recommendations</p>
        </header>

        {!analysis && !loading && (
          <div
            className={`max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${dragActive ? 'ring-2 ring-red-500 shadow-red-100' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="bg-red-50 rounded-full p-4 inline-flex">
                  <FileQuestion size={40} className="text-red-600" />
                </div>
                <h2 className="text-2xl font-bold mt-4 text-slate-800">Upload Your Exam</h2>
                <p className="text-slate-500 mt-2">Analyze bloom taxonomy, difficulty, and get improvement suggestions</p>
              </div>
             
              <div className="flex flex-col items-center">
                <label className={`cursor-pointer border-2 border-dashed ${dragActive ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'} rounded-xl px-6 py-10 w-full text-center transition-all duration-200 hover:bg-slate-100 hover:border-slate-400`}>
                  <FileUp className="mx-auto text-slate-400 mb-4" size={32} />
                  <span className="text-sm text-slate-500 block mb-2">Drag and drop your file here or click to browse</span>
                  <span className="text-xs text-slate-400">Supported formats: PDF, DOCX</span>
                  {file && (
                    <div className="mt-4 py-2 px-3 bg-red-50 rounded-lg inline-flex items-center">
                      <FileUp size={16} className="text-red-500 mr-2" />
                      <span className="text-sm font-medium text-red-700">{file.name}</span>
                    </div>
                  )}
                  <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" />
                </label>
               
                <button
                  onClick={handleAnalyze}
                  disabled={!file}
                  className={`mt-8 px-8 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 ${
                    file
                      ? 'bg-gradient-to-r from-red-600 to-red-400 text-white hover:shadow-red-200 hover:translate-y-[-2px]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Analyze Exam
                </button>
              </div>
            </div>
           
            <div className="bg-gradient-to-r from-red-600 to-red-400 px-8 py-4 text-white">
              <h3 className="font-medium mb-2 flex items-center">
                <Brain size={18} className="mr-2" />
                AI-Powered Analysis
              </h3>
              <p className="text-red-100 text-sm">Our AI examines question structure, bloom taxonomy levels, and provides actionable suggestions for improvement.</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-6 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-medium text-red-600">{uploadProgress}%</span>
                </div>
                <svg className="w-20 h-20 transform rotate-[-90deg]">
                  <circle
                    cx="40" cy="40" r="36"
                    className="stroke-slate-200"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="40" cy="40" r="36"
                    className="stroke-red-600"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={36 * 2 * Math.PI}
                    strokeDashoffset={36 * 2 * Math.PI - (36 * 2 * Math.PI * uploadProgress / 100)}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Analyzing Your Exam</h3>
              <div className="mt-6 space-y-3 text-left max-w-sm mx-auto">
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 rounded-full ${uploadProgress >= 25 ? 'bg-red-600' : 'bg-slate-200'} mr-3`}></div>
                  <span className={uploadProgress >= 25 ? 'text-slate-800' : 'text-slate-400'}>Parsing document structure</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 rounded-full ${uploadProgress >= 50 ? 'bg-red-600' : 'bg-slate-200'} mr-3`}></div>
                  <span className={uploadProgress >= 50 ? 'text-slate-800' : 'text-slate-400'}>Analyzing questions and topics</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 rounded-full ${uploadProgress >= 75 ? 'bg-red-600' : 'bg-slate-200'} mr-3`}></div>
                  <span className={uploadProgress >= 75 ? 'text-slate-800' : 'text-slate-400'}>Generating recommendations</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-4 h-4 rounded-full ${uploadProgress >= 100 ? 'bg-red-600' : 'bg-slate-200'} mr-3`}></div>
                  <span className={uploadProgress >= 100 ? 'text-slate-800' : 'text-slate-400'}>Finalizing results</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {analysis && !loading && (
          <div className="space-y-8">
            {/* Top summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Questions Analyzed</p>
                    <h3 className="text-3xl font-bold text-slate-800">{analysis.questions.length}</h3>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FileQuestion size={20} className="text-blue-600" />
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Total Points</p>
                    <h3 className="text-3xl font-bold text-slate-800">
                      {analysis.questions.reduce((sum, q) => sum + (q['Final Points'] || 0), 0)}
                    </h3>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <BarChart3 size={20} className="text-green-600" />
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Topics Covered</p>
                    <h3 className="text-3xl font-bold text-slate-800">{topicData().length}</h3>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <PieChartIcon size={20} className="text-purple-600" />
                  </div>
                </div>
              </div>
             
              <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Exam Quality</p>
                    <h3 className={`text-3xl font-bold ${qualityColor}`}>{qualityScore}%</h3>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-lg">
                    {qualityScore >= 80 ? (
                      <CheckCircle2 size={20} className="text-amber-600" />
                    ) : (
                      <AlertTriangle size={20} className="text-amber-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
           
            {/* Tabs Navigation */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="border-b border-slate-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-6 flex items-center font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <BarChart3 size={16} className="mr-2" />
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`py-4 px-6 flex items-center font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'recommendations'
                        ? 'border-red-400 text-red-400'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <AlertCircle size={16} className="mr-2" />
                    Recommendations
                    {getSuggestionsCount() > 0 && (
                      <span className="ml-2 bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-xs">
                        {getSuggestionsCount()}
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('questions')}
                    className={`py-4 px-6 flex items-center font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'questions'
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <FileQuestion size={16} className="mr-2" />
                    Questions
                  </button>
                </nav>
              </div>
             
              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Charts grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold mb-6 text-slate-800">Bloom Taxonomy Levels</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={bloomData()}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={90}
                              fill="#8884d8"
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {bloomData().map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} Questions`, 'Count']} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                                           
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold mb-6 text-slate-800">Topic Distribution</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            layout="vertical"
                            data={topicData()}
                            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
                            barSize={24}
                          >
                            <defs>
                              {topicData().map((entry, index) => (
                                <linearGradient key={`gradient-${index}`} id={`topicGradient${index}`} x1="0" y1="0" x2="1" y2="0">
                                  <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.7} />
                                  <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={1} />
                                </linearGradient>
                              ))}
                            </defs>
                            <XAxis
                              type="number"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis
                              dataKey="name"
                              type="category"
                              width={100}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
                            />
                            <Tooltip
                              formatter={(value) => [`${value} Questions`, 'Count']}
                              contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                border: 'none'
                              }}
                            />
                            <Bar
                              dataKey="value"
                              name="Questions"
                              radius={[0, 8, 8, 0]}
                              label={{
                                position: 'right',
                                fill: '#334155',
                                fontSize: 12,
                                fontWeight: 500,
                                formatter: (value) => `${value}`
                              }}
                            >
                              {topicData().map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={`url(#topicGradient${index})`}
                                />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                     
                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="font-semibold mb-6 text-slate-800">Question Difficulty</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <RadarChart data={difficultyData()}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar name="Questions" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                   
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-semibold mb-6 text-slate-800">Points Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={pointData()}>
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="points" fill="#dc2626" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
               
                {activeTab === 'recommendations' && (
                  <div className="space-y-8">
                    <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                      <h3 className="text-xl font-bold text-red-800 mb-4">Overall Exam Assessment</h3>
                      <div className="prose prose-slate prose-indigo max-w-none text-slate-700">
                        <p>{analysis.recommendations}</p>
                      </div>
                    </div>
                   
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-slate-800">Key Improvement Areas</h3>
                     
                      {analysis.questions
                        .filter(q => q['Recommendation'] && q['Recommendation'].trim() !== '')
                        .map((q, idx) => (
                          <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className={`rounded-full p-2 ${
                                q['Recommendation'].toLowerCase().includes('excellent')
                                  ? 'bg-green-50 text-green-600'
                                  : 'bg-amber-50 text-amber-600'
                              }`}>
                                {q['Recommendation'].toLowerCase().includes('excellent')
                                  ? <CheckCircle2 size={20} />
                                  : <AlertTriangle size={20} />
                                }
                              </div>
                              <div>
                                <p className="font-medium text-slate-800 mb-1">Question {q['Question Number']}</p>
                                <p className="text-sm text-slate-600 mb-3">{q['Question Text']}</p>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">{q['Bloom Level']}</span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700">{q['Topic']}</span>
                                  <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">{q['Final Points']} points</span>
                                </div>
                                <p className="text-sm bg-slate-50 p-3 rounded border border-slate-200">{q['Recommendation']}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
               
                {activeTab === 'questions' && (
                  <div className="space-y-6">
                    <div className="overflow-hidden overflow-x-auto sm:rounded-lg">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              #
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Question Text
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Bloom Level
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Topic
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                              Points
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                          {analysis.questions.map((q, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">
                                {q['Question Number']}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                                {q['Question Text']}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 py-1 text-xs rounded-full bg-blue-50 text-blue-700">
                                  {q['Bloom Level']}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 py-1 text-xs rounded-full bg-purple-50 text-purple-700">
                                  {q['Topic']}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className="px-2 py-1 text-xs rounded-full bg-green-50 text-green-700">
                                  {q['Final Points']}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
           
            {/* Action buttons */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setFile(null);
                  setAnalysis(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
              >
                <ArrowLeft size={16} className="mr-2" />
                Analyze Another Exam
              </button>
             
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                <Download size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
        )}
      </div>
     
      {/* Animated footer with gradient */}
      <footer className="mt-16 py-6 bg-gradient-to-r from-gray-600 to-gray-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Brain size={24} className="mr-2" />
              <span className="font-bold text-lg">Exam Analyzer AI</span>
            </div>
            <p className="text-red-100 text-sm">
              Powered by advanced AI to help educators create better assessments
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}