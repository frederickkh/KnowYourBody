import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Chat } from '@google/genai';

const API_KEY = process.env.API_KEY;

type Page = 'home' | 'learn' | 'chat' | 'about';

// --- Interfaces ---
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

// --- Gemini Setup ---
const ai = new GoogleGenAI({ apiKey: API_KEY });
const model = 'gemini-2.5-flash';
const systemInstruction = `You are a 'Campus Wellness Assistant' AI, a knowledgeable and empathetic resource for university students. Your name is 'KnowBot'. Your goal is to provide safe, evidence-based, educational information on health and wellness topics relevant to student life.

RULES:
- Your tone should be mature, supportive, and slightly academic, but always accessible.
- NEVER provide medical advice, diagnoses, or treatment. You are an educational tool, not a healthcare provider.
- If a user describes symptoms of distress (mental or physical), gently and firmly guide them to contact university health services, a medical professional, or a trusted advisor.
- Frame your answers around topics like stress management, study ergonomics, nutrition on a budget, sleep hygiene, mental resilience, social health, and exercise.
- Keep answers concise, informative, and actionable.
- Start the first conversation with a warm welcome and introduce yourself as the Campus Wellness Assistant.`;


// --- Components ---

const Header = ({ activePage, onNavigate }: { activePage: Page, onNavigate: (page: Page) => void }) => {
    const navLinkClass = "text-gray-600 hover:text-teal-600 transition-colors";
    const activeLinkClass = "text-teal-600 font-semibold";

    return (
        <header className="bg-white/90 backdrop-blur-md text-gray-800 p-4 shadow-sm fixed top-0 left-0 right-0 z-20">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl sm:text-2xl font-bold font-serif text-teal-700 cursor-pointer" onClick={() => onNavigate('home')}>KnowYourBody</h1>
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className={activePage === 'home' ? activeLinkClass : navLinkClass}>Home</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('learn'); }} className={activePage === 'learn' ? activeLinkClass : navLinkClass}>Learn</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('chat'); }} className={activePage === 'chat' ? activeLinkClass : navLinkClass}>Chat</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('about'); }} className={activePage === 'about' ? activeLinkClass : navLinkClass}>About</a>
                </nav>
            </div>
        </header>
    );
};

// --- Page Components ---

const HomePage = ({ onNavigate }: { onNavigate: (page: Page) => void }) => (
    <main className="flex-1 flex items-center justify-center text-center text-gray-800 bg-gray-50 px-4 pt-16">
        <div className="flex flex-col items-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-serif">
                Your University Wellness Guide.
            </h2>
            <p className="max-w-2xl text-lg md:text-xl text-gray-600">
                An AI-powered resource to help you navigate the health and wellness challenges of student life.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                 <button 
                    onClick={() => onNavigate('chat')}
                    className="px-8 py-3 font-semibold text-lg text-white bg-teal-600 border-2 border-transparent rounded-xl shadow-lg hover:bg-teal-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                 >
                    Start Chatting
                </button>
                <button 
                    onClick={() => onNavigate('learn')}
                    className="px-8 py-3 font-semibold text-lg text-teal-700 bg-transparent border-2 border-teal-600 rounded-xl hover:bg-teal-50 transition-all duration-300"
                >
                    Explore Topics
                </button>
            </div>
        </div>
    </main>
);

const LearnPage = () => {
    const studentTopics = [
        { title: 'Managing Academic Stress', desc: 'Techniques to handle pressure and prevent burnout.' },
        { title: 'Nutrition for Brain Power', desc: 'Learn which foods can boost focus and memory for exams.' },
        { title: 'The Science of Sleep', desc: 'Why all-nighters are counterproductive and how to fix your sleep schedule.' },
        { title: 'Ergonomics for Studying', desc: 'Avoid back and neck pain from long hours at your desk.' },
        { title: 'Navigating Social Health', desc: 'Tips for building a supportive community on campus.' },
        { title: 'Fitness on a Student Schedule', desc: 'How to stay active with a busy academic calendar.' }
    ];

    return (
        <main className="flex-1 bg-gray-50 pt-20">
            <div className="container mx-auto p-4 sm:p-8">
                <h2 className="text-3xl font-bold font-serif text-gray-800 mb-6">Student Wellness Topics</h2>
                <p className="text-gray-600 mb-8 max-w-3xl">Explore topics curated for the university experience. This section is a work in progress, but will soon feature in-depth articles and resources.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {studentTopics.map(topic => (
                        <div key={topic.title} className="bg-white p-6 rounded-lg border border-gray-200/80 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="font-bold font-serif text-teal-700 mb-2">{topic.title}</h3>
                            <p className="text-gray-500 text-sm">{topic.desc}</p>
                            <p className="text-gray-400 text-xs mt-4">Coming Soon...</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

const AboutPage = () => (
     <main className="flex-1 bg-gray-50 pt-20">
        <div className="container mx-auto p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg border border-gray-200/80 shadow-sm">
                 <h2 className="text-3xl font-bold font-serif text-gray-800 mb-4">Our Mission</h2>
                 <p className="text-gray-700 leading-relaxed space-y-4">
                    <span>
                        University life is a time of immense growth, but it also comes with unique health and wellness challenges. KnowYourBody is designed to be a trustworthy, accessible resource for students seeking to understand their health better.
                    </span>
                    <span>
                        We provide evidence-based, non-diagnostic information to help you build healthy habits, manage stress, and make informed decisions. Our goal is to empower you with knowledge, so you can thrive both academically and personally.
                    </span>
                 </p>
                 <div className="mt-6 p-4 bg-teal-50 border-l-4 border-teal-500 text-teal-900 text-sm">
                    <strong>Important:</strong> This is an educational tool, not a substitute for professional medical advice. Please consult your university's health services for any personal health concerns.
                 </div>
            </div>
        </div>
    </main>
);

const ChatPage = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const chatRef = useRef<Chat | null>(null);

    useEffect(() => {
        chatRef.current = ai.chats.create({
            model: model,
            config: { systemInstruction: systemInstruction }
        });
        
        setMessages([{ id: Date.now(), text: "Hi! I'm KnowBot, your Campus Wellness Assistant. Click a body part or ask me anything about student health and wellness.", sender: 'ai' }]);
    }, []);
    
    const handleSendMessage = async (text: string) => {
        if (!text.trim() || isLoading || !chatRef.current) return;

        const isNewMessage = !messages.some(msg => msg.text === text && msg.sender === 'user');
        if (isNewMessage) {
            const newUserMessage: Message = { id: Date.now(), text, sender: 'user' };
            setMessages(prev => [...prev, newUserMessage]);
        }
        
        setIsLoading(true);

        try {
            const response = await chatRef.current.sendMessage({ message: text });
            const aiResponseText = response.text;
            const newAiMessage: Message = { id: Date.now() + 1, text: aiResponseText, sender: 'ai' };
            setMessages(prev => [...prev, newAiMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMsg: Message = { id: Date.now() + 1, text: "My apologies, I'm having trouble connecting to my knowledge base. Please try again in a moment.", sender: 'ai' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePartClick = (partName: string) => {
        const prompt = `Tell me about the ${partName} in the context of general health.`;
        const userMessage: Message = { id: Date.now(), text: prompt, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        handleSendMessage(prompt);
    };

    return (
         <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-50 pt-16">
            <BodyMap onPartClick={handlePartClick} />
            <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
            <FloatingButton onClick={() => setIsModalOpen(true)} />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </main>
    );
};


// --- Child Components for Chat Page ---
const WellnessTip = () => {
    const tips = [
        "A 10-minute walk between study sessions can significantly boost your concentration.",
        "Stay hydrated! Drinking enough water is crucial for cognitive function.",
        "Try the 20-20-20 rule to avoid eye strain: every 20 minutes, look at something 20 feet away for 20 seconds.",
        "Tidy your study space before you begin. A clean environment can lead to a clearer mind.",
        "Prioritize 7-9 hours of sleep, especially before an exam. Your brain consolidates memories while you sleep."
    ];
    const [tip, setTip] = useState('');

    useEffect(() => {
        setTip(tips[Math.floor(Math.random() * tips.length)]);
    }, []);

    return (
        <div className="p-3 mb-4 bg-teal-50 border border-teal-200/80 rounded-lg text-sm text-teal-800">
            <strong className="font-semibold">Wellness Tip:</strong> {tip}
        </div>
    );
}


const BodyMap = ({ onPartClick }: { onPartClick: (part: string) => void }) => {
    const handlePartClick = (event: React.MouseEvent<SVGPathElement | SVGGElement>) => {
        const partName = event.currentTarget.dataset.name || 'body part';
        onPartClick(partName);
    };

    const bodyPartClass = "fill-teal-100/80 stroke-teal-500 stroke-2 cursor-pointer transition-all duration-300 ease-in-out hover:fill-teal-300/80 hover:scale-105 origin-center";

    return (
        <div className="md:w-1/3 w-full p-4 flex items-center justify-center bg-white border-b md:border-b-0 md:border-r border-gray-200/80">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 327.32 833.79"
                className="max-w-full max-h-[75vh]"
                aria-label="Interactive body map"
            >
                <g id="body-parts">
                    <path className={bodyPartClass} data-name="Head" onClick={handlePartClick} d="M163.66,115.82c35.94,0,65.09-29.15,65.09-65.09S199.6,0,163.66,0,98.57,29.15,98.57,65.09s29.15,50.73,65.09,50.73Z"/>
                    <path className={bodyPartClass} data-name="Chest" onClick={handlePartClick} d="M255.48,154.7l-15.84,149.75c-1.46,13.85-13.1,24.3-27.12,24.3H114.8c-14.02,0-25.66-10.45-27.12-24.3L71.84,154.7H255.48Z"/>
                    <path className={bodyPartClass} data-name="Abdomen" onClick={handlePartClick} d="M239,334.33H88.33c-14.7,0-26.62,11.92-26.62,26.62V484.2c0,14.7,11.92,26.62,26.62,26.62H239c14.7,0,26.62-11.92,26.62-26.62V360.95c0-14.7-11.92-26.62-26.62-26.62Z"/>
                    <g className={bodyPartClass} data-name="Right Arm" onClick={handlePartClick} transform="translate(-54.52 -9.3) rotate(4.14 329.8 280.4)"><path d="M321.43,184.21l-37.16,11.66c-13.82,4.33-21.21,19.05-16.88,32.87l45.06,143.43c4.33,13.82,19.05,21.21,32.87,16.88l37.16-11.66c13.82-4.33,21.21-19.05,16.88-32.87L354.3,183.09c-4.33-13.82-19.05-21.21-32.87-16.88Z" /></g>
                    <g className={bodyPartClass} data-name="Left Arm" onClick={handlePartClick} transform="translate(60.4 -10.3) rotate(-4.14 0 280.4)"><path d="M5.88,184.21l37.16,11.66c13.82,4.33,21.21,19.05,16.88,32.87L14.86,372.17c-4.33,13.82-19.05,21.21-32.87,16.88L-55.17,377.4c-13.82-4.33-21.21-19.05-16.88-32.87L-26.99,183.09c4.33-13.82,19.05-21.21,32.87-16.88Z" /></g>
                    <path className={bodyPartClass} data-name="Right Leg" onClick={handlePartClick} d="M243.31,516.4v286.13c0,17.29-14,31.27-31.27,31.27h-29.35c-17.29,0-31.27-14-31.27-31.27V516.4h91.9Z"/>
                    <path className={bodyPartClass} data-name="Left Leg" onClick={handlePartClick} d="M174.92,516.4v286.13c0,17.29-14,31.27-31.27,31.27h-29.35c-17.29,0-31.27-14-31.27-31.27V516.4h91.9Z"/>
                </g>
            </svg>
        </div>
    );
};

const ChatWindow = ({ messages, isLoading, onSendMessage }: { messages: Message[], isLoading: boolean, onSendMessage: (text: string) => void }) => {
    const [userInput, setUserInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!userInput.trim()) return;
        onSendMessage(userInput);
        setUserInput('');
    };

    return (
        <div className="md:w-2/3 w-full flex flex-col bg-gray-50/50">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
                {messages.length <= 1 && <WellnessTip />}
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-xl max-w-sm md:max-w-md break-words shadow-sm ${msg.sender === 'user' ? 'bg-teal-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-200/80'}`}>
                           {msg.text.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-xl bg-white text-gray-800 rounded-bl-none border border-gray-200/80">
                            <div className="flex items-center justify-center space-x-1">
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form className="p-4 bg-white/90 backdrop-blur-md border-t border-gray-200/80 flex items-center space-x-3" onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Ask about student wellness..."
                    aria-label="Chat input"
                    disabled={isLoading}
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-teal-500 focus:outline-none disabled:bg-gray-100 transition-shadow"
                />
                <button 
                    type="submit" 
                    disabled={isLoading || !userInput.trim()}
                    className="bg-teal-600 text-white rounded-full p-3 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors aspect-square flex items-center justify-center"
                    aria-label="Send message"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
                </button>
            </form>
        </div>
    );
};

const FloatingButton = ({ onClick }: { onClick: () => void }) => (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-teal-600 text-white rounded-full p-4 shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform hover:scale-110"
      aria-label="Personalize My Profile"
    >
        <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    </button>
);

const Modal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative font-sans" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold font-serif text-gray-800 mb-4">Personalize Profile</h2>
                <p className="text-gray-600">This feature is coming soon! You'll be able to tell us a bit about yourself to get more personalized health tips and information.</p>
            </div>
        </div>
    );
};


// --- Main App Component (Router) ---

const App = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={setCurrentPage} />;
            case 'learn':
                return <LearnPage />;
            case 'chat':
                return <ChatPage />;
            case 'about':
                return <AboutPage />;
            default:
                return <HomePage onNavigate={setCurrentPage} />;
        }
    };

    return (
        <div className="h-screen w-screen flex flex-col font-sans">
            <Header activePage={currentPage} onNavigate={setCurrentPage} />
            {renderPage()}
        </div>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}