
import React from 'react';
import type { Tab } from '../types';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  tabs: Tab[];
  disabledTabs?: Tab[];
}

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, tabs, disabledTabs = [] }) => {
  return (
    <div className="border-b border-gray-700">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        {tabs.map((tab) => {
          const isDisabled = disabledTabs.includes(tab);
          return (
            <button
              key={tab}
              onClick={() => !isDisabled && setActiveTab(tab)}
              disabled={isDisabled}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {tab}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Tabs;
