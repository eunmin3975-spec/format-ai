
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { PERSONAS } from './constants';
import { ChatMessage, PersonaType } from './types';
import { PersonaCard } from './components/PersonaCard';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '반갑다. 나는 FORMAT 시스템 복구 센터의 인생 선배들이다. 네 마음의 서버에 쌓인 무거운 오류들을 함께 비워내고, 새로운 데이터로 채워보자꾸나. 어떤 고민이 자네를 힘들게 하는가?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const response = await geminiService.generateResponse(inputValue);
    
    let detectedPersona: PersonaType | undefined;
    const responseLower = response.toLowerCase();
    
    if (responseLower.includes('drive_sundo')) detectedPersona = 'YI_SUN_SIN';
    else if (responseLower.includes('logic_check')) detectedPersona = 'SOCRATES';
    else if (responseLower.includes('system_career')) detectedPersona = 'JEONG_YAK_YONG';
    else if (responseLower.includes('ubermensch')) detectedPersona = 'NIETZSCHE';
    else if (responseLower.includes('heart_ex')) detectedPersona = 'HWANG_JIN_I';

    const assistantMsg: ChatMessage = { 
      role: 'assistant', 
      content: response,
      persona: detectedPersona,
      isFormatting: true
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  // 마지막으로 말한 페르소나의 색상 가져오기
  const lastPersonaId = [...messages].reverse().find(m => m.persona)?.persona;
  const currentThemeColor = lastPersonaId ? PERSONAS[lastPersonaId].color.split(' ')[1] : 'text-green-500';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-black text-zinc-300">
      <div className="scanline"></div>
      
      {/* Background Grid */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 h-full w-full">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-zinc-800"></div>
          ))}
        </div>
      </div>

      <main className="w-full max-w-6xl z-10 flex flex-col md:flex-row gap-6 h-[90vh]">
        {/* Sidebar */}
        <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="mb-2">
            <h1 className="text-4xl font-cyber font-bold tracking-widest text-white glitch-text mb-1">FORMAT</h1>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono tracking-widest animate-pulse ${currentThemeColor}`}>
                SYSTEM_RECOVERY_MODE
              </span>
              <div className={`w-2 h-2 rounded-full animate-pulse bg-current ${currentThemeColor}`}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
            {Object.values(PERSONAS).map(p => (
              <PersonaCard 
                key={p.id}
                persona={p}
                isSelected={lastPersonaId === p.id}
                onClick={() => setInputValue(p.tags[0])}
              />
            ))}
          </div>
        </div>

        {/* Chat Terminal */}
        <div className={`w-full flex-1 flex flex-col bg-zinc-950/80 border rounded-2xl overflow-hidden shadow-2xl transition-colors duration-500 ${lastPersonaId ? PERSONAS[lastPersonaId].color.split(' ')[0] : 'border-zinc-800'}`}>
          <div className="bg-zinc-900/50 backdrop-blur-md px-6 py-3 border-b border-white/5 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/30"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/30"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/30"></div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500 tracking-tighter">
              LOG: {lastPersonaId ? `PERS_ID_${lastPersonaId}` : 'INITIALIZING...'}
            </div>
          </div>

          <div 
            ref={scrollRef}
            className="flex-1 p-8 overflow-y-auto font-sans space-y-8 custom-scrollbar scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                <div className={`relative max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'text-green-400 bg-green-950/10 p-5 rounded-2xl rounded-tr-none border border-green-900/40 shadow-[0_0_20px_rgba(34,197,94,0.05)]' 
                    : 'text-zinc-300'
                }`}>
                  {msg.role === 'assistant' && msg.persona && (
                    <div className={`text-[11px] font-bold mb-3 uppercase tracking-widest flex items-center gap-2 ${PERSONAS[msg.persona].color.split(' ')[1]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shadow-[0_0_8px_currentColor]"></span>
                      {PERSONAS[msg.persona].name} 선배
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap leading-relaxed text-lg font-light tracking-wide">
                    {msg.role === 'assistant' && msg.isFormatting && msg.content.includes('시스템 포맷 중...') ? (
                      <div className="text-zinc-500 text-[11px] font-mono mb-3 p-2 bg-white/5 rounded border border-white/5 inline-block italic">
                        [PROCESS: 마음 데이터 최적화 중...]
                      </div>
                    ) : null}
                    <div>
                      {msg.role === 'assistant' && msg.isFormatting 
                        ? msg.content.replace('시스템 포맷 중...', '').trim()
                        : msg.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-center gap-3 text-zinc-500 text-xs font-mono ml-4 p-4 border border-zinc-800/50 rounded-xl bg-zinc-900/30 w-fit animate-pulse">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span>시스템에서 인생의 답을 컴파일하는 중...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6 bg-zinc-900/30 border-t border-white/5 backdrop-blur-xl flex gap-3">
            <div className="flex-1 relative group">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-mono transition-colors duration-300 ${currentThemeColor}`}>❯</span>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="현재 시스템의 오류(고민)를 입력하세요..."
                className={`w-full bg-black border rounded-xl py-4 pl-10 pr-6 text-base transition-all duration-300 focus:outline-none focus:ring-1 focus:bg-zinc-950 ${
                  lastPersonaId ? PERSONAS[lastPersonaId].color.split(' ')[0] : 'border-zinc-700'
                } focus:border-opacity-100 placeholder-zinc-700 text-zinc-200`}
              />
            </div>
            <button 
              type="submit"
              disabled={isTyping || !inputValue.trim()}
              className={`bg-white text-black font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed text-xs font-cyber shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                lastPersonaId ? `shadow-${PERSONAS[lastPersonaId].id === 'SOCRATES' ? 'orange' : PERSONAS[lastPersonaId].id === 'HWANG_JIN_I' ? 'pink' : 'blue'}-500/20` : ''
              }`}
            >
              FORMAT_START
            </button>
          </form>
        </div>
      </main>

      <footer className="mt-8 text-[10px] text-zinc-600 font-mono text-center max-w-2xl tracking-widest uppercase opacity-50">
        Recovery of the soul is a continuous process. <br/>
        v1.0.4-LIFELOG | © FORMAT SYSTEM RECOVERY POP-UP STORE
      </footer>
    </div>
  );
}

export default App;
