import React, { useState } from 'react';
import { Search, Home, ChevronLeft, ChevronRight, RotateCw, Code, Globe, ExternalLink, Sparkles } from 'lucide-react';

const projectsData = [
  { id: 'videxa', name: 'Videxa', description: 'AI-powered video intelligence platform combining transcription, semantic search, and contextual chat.', tech: 'Next.js, TypeScript, MongoDB, FAISS, Python, FastAPI', url: null, githubUrl: 'https://github.com/dakshbatra01/Videxa', color: '#ef4444' },
  { id: 'mentorconnect', name: 'MentorConnect', description: 'Full-stack student-mentor matching and learning platform with JWT authentication, scheduling, and analytics.', tech: 'React, Node.js, Express, MongoDB, TailwindCSS', url: null, githubUrl: 'https://github.com/dakshbatra01/MentorConnect', color: '#3b82f6' },
  { id: 'whatif', name: 'What-If Engine', description: 'Interactive IPL cricket simulation and ball-by-ball scenario analytics engine.', tech: 'Next.js, FastAPI, Python, Pandas, NumPy, TailwindCSS', url: null, githubUrl: 'https://github.com/dakshbatra01/What-If', color: '#f59e0b' },
  { id: 'sentivox', name: 'SentiVox', description: 'Speech sentiment analysis platform and API.', tech: 'TypeScript, React, FastAPI, Python', url: null, githubUrl: 'https://github.com/dakshbatra01/SentiVox', color: '#10b981' },
  { id: 'poker', name: 'Poker', description: 'A web-based simulator and interactive client for playing Poker.', tech: 'HTML5, CSS3, JavaScript', url: null, githubUrl: 'https://github.com/dakshbatra01/Poker', color: '#a855f7' },
  { id: 'dvacapstone', name: 'DVA Capstone G2', description: 'Data visualization and analytics capstone project focused on interactive dashboard creation.', tech: 'Python, Jupyter Notebook, Pandas, NumPy', url: null, githubUrl: 'https://github.com/dakshbatra01/DVA_Capstone_G2', color: '#8b5cf6' },
  { id: 'finshield', name: 'FinShield', description: 'Financial risk and credit fraud analysis/prediction engine using machine learning.', tech: 'Python, Jupyter Notebook, Machine Learning, Pandas', url: null, githubUrl: 'https://github.com/dakshbatra01/SectionD_G1_FinShield', color: '#ec4899' },
  { id: 'houseprice', name: 'House Price Predictor', description: 'Machine learning regression models predicting housing prices from structural features.', tech: 'Python, Jupyter Notebook, Scikit-Learn, Pandas', url: null, githubUrl: 'https://github.com/shourya2006/HousePricePredictor', color: '#06b6d4' },
  { id: 'hrattrition', name: 'HR Attrition Analysis', description: 'Data-driven analysis of employee turnover factors using ML algorithms.', tech: 'Python, Machine Learning, Data Analytics', url: null, githubUrl: 'https://github.com/dakshbatra01/HR_Attrition_Analysis', color: '#f472b6' },
  { id: 'netflixdata', name: 'Netflix Data Analysis', description: 'Exploratory data analysis on Netflix titles, genres, and trend correlations.', tech: 'Python, Pandas, NumPy, Matplotlib', url: null, githubUrl: 'https://github.com/dakshbatra01/Netflix_Data_Analysis', color: '#f97316' },
  { id: 'tripwallet', name: 'TripWallet Re-Design', description: 'A redesigned, intuitive expense-tracking application for groups and trips.', tech: 'JavaScript, HTML5, CSS3', url: null, githubUrl: 'https://github.com/shourya2006/TripWallet-ReDesign', color: '#14b8a6' },
  { id: 'dvaportfolio', name: 'DVA Portfolio', description: 'Data visualization and analysis showcase containing laboratory works and visualization reports.', tech: 'HTML5, CSS3, JavaScript', url: null, githubUrl: 'https://github.com/dakshbatra01/DVA_Portfolio', color: '#6366f1' }
];

export default function Browser() {
  const [urlBar, setUrlBar] = useState('');
  const [currentView, setCurrentView] = useState('home');
  const [activeSite, setActiveSite] = useState(null);
  const [history, setHistory] = useState([{ view: 'home', site: null, query: '' }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const navigate = (view, site = null, query = '') => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ view, site, query });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    applyView(view, site, query);
  };

  const applyView = (view, site, query) => {
    setCurrentView(view);
    setActiveSite(site);
    if (view === 'home') setUrlBar('');
    else if (view === 'search') setUrlBar(query);
    else if (view === 'site' && site) setUrlBar(site.url || `daksh://${site.id}`);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      applyView(prev.view, prev.site, prev.query);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      applyView(next.view, next.site, next.query);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!urlBar.trim()) return;
    navigate('search', null, urlBar);
  };

  const renderHome = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, #0a0f1e 70%)', color: '#f8fafc', padding: '20px', overflowY: 'auto' }}>
      
      {/* Logo */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <Sparkles size={18} color="#f59e0b" style={{ position: 'absolute', top: -8, right: -14, animation: 'pulse 2s infinite' }} />
        <Globe size={56} color="#60a5fa" strokeWidth={1.2} />
      </div>
      <h1 style={{ fontSize: '28px', marginBottom: '6px', fontWeight: '700', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Daksh Search</h1>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '28px' }}>Explore my projects and creations</p>
      
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} style={{ width: '100%', maxWidth: '480px', position: 'relative' }}>
        <Search size={16} color="#64748b" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input 
          type="text" 
          value={urlBar}
          onChange={(e) => setUrlBar(e.target.value)}
          placeholder="Search projects..." 
          style={{ width: '100%', padding: '14px 20px 14px 44px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backgroundColor: 'rgba(30,41,59,0.8)', color: '#f8fafc', outline: 'none', fontSize: '15px', backdropFilter: 'blur(8px)', transition: 'border 0.2s, box-shadow 0.2s' }}
          onFocus={e => { e.target.style.border = '1px solid rgba(96,165,250,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(96,165,250,0.1)'; }}
          onBlur={e => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
        />
      </form>
      
      {/* Quick-access project cards */}
      <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%', maxWidth: '480px' }}>
        {projectsData.map(p => (
          <div key={p.id} onClick={() => navigate('site', p)} style={{ padding: '16px', background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden' }}
               onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = p.color; e.currentTarget.style.boxShadow = `0 8px 24px ${p.color}20`; }}
               onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}>
            {/* Color accent line */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: p.color }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color, boxShadow: `0 0 6px ${p.color}` }} />
              <h3 style={{ margin: 0, fontSize: '14px', color: '#f1f5f9', fontWeight: '600' }}>{p.name}</h3>
            </div>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>{p.tech}</p>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );

  const renderSearch = () => {
    const query = urlBar.toLowerCase();
    const results = projectsData.filter(p => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || p.tech.toLowerCase().includes(query));
    
    return (
      <div style={{ padding: '24px 28px', background: '#0a0f1e', height: '100%', color: '#f8fafc', overflowY: 'auto' }}>
        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>About {results.length} result{results.length !== 1 ? 's' : ''} for "<span style={{ color: '#94a3b8' }}>{urlBar}</span>"</div>
        {results.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '60px' }}>
            <Search size={40} color="#334155" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#64748b', fontSize: '15px' }}>No projects found matching your query.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {results.map(p => (
              <div key={p.id} onClick={() => navigate('site', p)} style={{ cursor: 'pointer', padding: '0', transition: 'all 0.2s' }}
                   onMouseEnter={e => e.currentTarget.querySelector('.title').style.textDecoration = 'underline'}
                   onMouseLeave={e => e.currentTarget.querySelector('.title').style.textDecoration = 'none'}>
                <div style={{ color: '#10b981', fontSize: '12px', marginBottom: '2px' }}>{p.url || `daksh://${p.id}`}</div>
                <h3 className="title" style={{ color: '#60a5fa', fontSize: '17px', margin: '0 0 4px 0', fontWeight: '500' }}>{p.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{p.description} <span style={{ color: '#64748b' }}>— {p.tech}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSite = () => {
    if (!activeSite) return null;
    if (activeSite.url) {
      return (
        <iframe 
          src={activeSite.url} 
          style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }}
          title={activeSite.name}
        />
      );
    }
    return (
      <div style={{ padding: '40px', background: 'radial-gradient(ellipse at 50% 30%, rgba(59,130,246,0.1) 0%, #0a0f1e 70%)', height: '100%', color: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '16px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '700' }}>{activeSite.name}</h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', maxWidth: '500px', textAlign: 'center', lineHeight: '1.6' }}>{activeSite.description}</p>
        <div style={{ marginTop: '30px', padding: '12px 20px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <RotateCw size={16} />
          <span>Currently running locally</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#0a0f1e', overflow: 'hidden' }}>
      {/* Browser Nav Bar */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', background: 'rgba(15,23,42,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '10px' }}>
        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { action: goBack, disabled: historyIndex === 0, icon: <ChevronLeft size={18} /> },
            { action: goForward, disabled: historyIndex === history.length - 1, icon: <ChevronRight size={18} /> },
            { action: () => applyView(currentView, activeSite, urlBar), disabled: false, icon: <RotateCw size={15} /> },
            { action: () => navigate('home'), disabled: false, icon: <Home size={16} /> },
          ].map((btn, i) => (
            <button key={i} onClick={btn.action} disabled={btn.disabled} style={{ background: 'none', border: 'none', color: btn.disabled ? '#334155' : '#94a3b8', cursor: btn.disabled ? 'default' : 'pointer', padding: '4px', borderRadius: '6px', transition: 'color 0.15s' }}
                    onMouseEnter={e => { if (!btn.disabled) e.currentTarget.style.color = '#f1f5f9'; }}
                    onMouseLeave={e => { if (!btn.disabled) e.currentTarget.style.color = '#94a3b8'; }}>
              {btn.icon}
            </button>
          ))}
        </div>
        
        {/* URL bar */}
        <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '6px 14px', transition: 'border 0.2s' }}
              onFocus={e => e.currentTarget.style.border = '1px solid rgba(96,165,250,0.3)'}
              onBlur={e => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'}>
          <Search size={13} color="#64748b" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input 
            type="text" 
            value={urlBar}
            onChange={(e) => setUrlBar(e.target.value)}
            style={{ flex: 1, background: 'transparent', border: 'none', color: '#e2e8f0', outline: 'none', fontSize: '12px', fontFamily: 'var(--font-ui)' }}
            placeholder="Search or enter web address"
          />
          {currentView === 'site' && activeSite?.githubUrl && (
            <button 
              type="button"
              onClick={() => window.open(activeSite.githubUrl, '_blank')}
              style={{ background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '6px', padding: '2px 8px', color: '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '10px', fontWeight: '600', marginLeft: '8px', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(139,92,246,0.15)'; }}
            >
              <Code size={12} /> View Code
            </button>
          )}
        </form>

        {/* GitHub button */}
        <button onClick={() => window.open('https://github.com/dakshbatra01', '_blank')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 12px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '500', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#f1f5f9'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
          <Code size={14} /> GitHub <ExternalLink size={10} />
        </button>
      </div>

      {/* Viewport */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {currentView === 'home' && renderHome()}
        {currentView === 'search' && renderSearch()}
        {currentView === 'site' && renderSite()}
      </div>
    </div>
  );
}
