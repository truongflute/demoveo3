import React, { useState } from 'react';
import type { Script } from './types';
import { Tab } from './types';
import Tabs from './components/Tabs';
import ScriptGenerator from './components/ScriptGenerator';
import VideoRenderer from './components/VideoRenderer';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>(Tab.GENERATE_SCRIPT);
    const [script, setScript] = useState<Script | null>(null);

    const handleScriptGenerated = (newScript: Script) => {
        setScript(newScript);
        setActiveTab(Tab.RENDER_VIDEO);
    };
    
    const handleReset = () => {
        setScript(null);
        setActiveTab(Tab.GENERATE_SCRIPT);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <header className="py-6">
                <h1 className="text-4xl font-extrabold text-center tracking-tight">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
                        Veo AI Script & Video Generator
                    </span>
                </h1>
            </header>
            
            <main>
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={[Tab.GENERATE_SCRIPT, Tab.RENDER_VIDEO]}
                    disabledTabs={!script ? [Tab.RENDER_VIDEO] : []}
                />
                
                <div className="mt-8">
                    {activeTab === Tab.GENERATE_SCRIPT && <ScriptGenerator onScriptGenerated={handleScriptGenerated} />}
                    {activeTab === Tab.RENDER_VIDEO && script && <VideoRenderer script={script} onReset={handleReset} />}
                </div>
            </main>
        </div>
    );
};

export default App;