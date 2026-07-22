/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SKILLS } from '../../data';
import { Skill } from '../../types';
import { motion, AnimatePresence } from 'motion/react';

type CategoryFilter = 'all' | 'lang' | 'frontend' | 'backend' | 'db' | 'cloud' | 'tools';

export default function Skills() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>(SKILLS);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  const tabs: { name: string; id: CategoryFilter }[] = [
    { name: 'All Stack', id: 'all' },
    { name: 'Languages', id: 'lang' },
    { name: 'Frontend', id: 'frontend' },
    { name: 'Backend', id: 'backend' },
    { name: 'Databases', id: 'db' },
    { name: 'Cloud Ops', id: 'cloud' },
    { name: 'Tools', id: 'tools' }
  ];

  const handleTabChange = (tabId: CategoryFilter) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    if (tabId === 'all') {
      setFilteredSkills(SKILLS);
    } else {
      setFilteredSkills(SKILLS.filter(s => s.category === tabId));
    }
  };

  const getProficiencyLabel = (level: number) => {
    if (level >= 80) return 'Intermediate';
    return 'Beginner';
  };

  return (
    <section
      id="skills"
      className="relative w-full py-24 bg-bg border-b border-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="text-accent font-mono text-xs tracking-[0.25em] uppercase mb-4">
            // SKILL MATRIX
          </div>
          <h2 className="font-display font-black text-3xl md:text-5xl text-text mb-4">
            My Technical Stack
          </h2>
          <p className="font-heading text-sm md:text-base text-text-sub">
            A comprehensive overview of tools, environments, and specialized methodologies I leverage to design software.
          </p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-12 max-w-3xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 py-2 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer relative ${
                activeTab === tab.id
                  ? 'text-text bg-card-solid border border-primary/40 shadow-sm shadow-primary/10'
                  : 'text-muted border border-transparent hover:text-text hover:border-border bg-transparent'
              }`}
            >
              {tab.name}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-primary to-accent rounded" />
              )}
            </button>
          ))}
        </div>

        {/* Skills Grid with Framer Motion layout transition */}
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-6xl mx-auto"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.85, y: -10 }}
                transition={{ 
                  opacity: { duration: 0.2 },
                  layout: { type: 'spring', stiffness: 220, damping: 25 },
                  scale: { duration: 0.2 }
                }}
                key={skill.name}
                className="group relative h-[140px] gradient-card border border-border rounded-2xl p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 select-none hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 cursor-pointer"
                onMouseEnter={() => setHoveredSkill(skill.name)}
                onMouseLeave={() => setHoveredSkill(null)}
              >
                {/* Background ambient radial circle on card hover */}
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-primary/2 filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Top Row: Icon + Level Percentage */}
                <div className="flex justify-between items-start">
                  <span className="text-3xl filter drop-shadow-md transform group-hover:scale-115 transition-transform duration-300">
                    {skill.icon}
                  </span>
                  
                  {/* Level Tag */}
                  <span className="text-[10px] font-mono text-muted bg-bg/50 px-2 py-0.5 rounded-md border border-border group-hover:border-primary/20 group-hover:text-primary transition-colors">
                    {skill.level}%
                  </span>
                </div>

                {/* Middle Row: Title + Category label */}
                <div>
                  <h3 className="font-heading font-bold text-sm text-text truncate">
                    {skill.name}
                  </h3>
                  <span className="text-[9px] font-mono text-muted uppercase">
                    {skill.category === 'lang' ? 'Language' : skill.category}
                  </span>
                </div>

                {/* Bottom Row: Animated Proficiency Bar */}
                <div className="w-full h-1 bg-border rounded-full overflow-hidden mt-2 relative">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-1000 ease-out"
                    style={{ width: hoveredSkill === skill.name ? `${skill.level}%` : '15%' }}
                  />
                </div>

                {/* Interactive Tooltip Hover Overlay */}
                <AnimatePresence>
                  {hoveredSkill === skill.name && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.15 }}
                      className="absolute inset-x-0 bottom-0 bg-primary/95 text-white text-[10px] font-mono py-1.5 text-center flex items-center justify-center"
                    >
                      <span>{getProficiencyLabel(skill.level)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
