/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Zap, Shield, Swords, Flame, MessageSquare, Wind } from 'lucide-react';

interface CombatActionsProps {
  onSelectAction: (actionText: string) => void;
  disabled: boolean;
}

export const CombatActions: React.FC<CombatActionsProps> = ({ onSelectAction, disabled }) => {
  const actions = [
    {
      id: 'black_flash',
      icon: Zap,
      label: 'Black Flash Strike',
      color: 'text-purple-400 hover:text-purple-300 border-purple-900/60 hover:bg-purple-950/40',
      prompt: 'I channel all my cursed energy into a high-speed strike, timing the impact to within 0.000001 seconds—Black Flash!',
    },
    {
      id: 'simple_domain',
      icon: Shield,
      label: 'Simple Domain',
      color: 'text-blue-400 hover:text-blue-300 border-blue-900/60 hover:bg-blue-950/40',
      prompt: 'I drop into a stance and deploy New Shadow Style: Simple Domain to neutralize the surrounding sure-hit cursed energy!',
    },
    {
      id: 'cursed_tool',
      icon: Swords,
      label: 'Special Grade Thrust',
      color: 'text-red-400 hover:text-red-300 border-red-900/60 hover:bg-red-950/40',
      prompt: 'I feint through the falling rubble, driving a Special Grade cursed spear straight toward his unguarded blind spot!',
    },
    {
      id: 'challenge_fuga',
      icon: Flame,
      label: 'Challenge Fuga',
      color: 'text-amber-400 hover:text-amber-300 border-amber-900/60 hover:bg-amber-950/40',
      prompt: 'I refuse to yield. "You speak of flames like a true king—let me see you draw that flame arrow, Sukuna!"',
    },
    {
      id: 'taunt',
      icon: MessageSquare,
      label: 'Defiant Mockery',
      color: 'text-orange-400 hover:text-orange-300 border-orange-900/60 hover:bg-orange-950/40',
      prompt: '"Is this truly all the King of Curses has to offer? Even the disaster curses fought with more fire!"',
    },
    {
      id: 'evasive_dash',
      icon: Wind,
      label: 'Evasive Smoke Dash',
      color: 'text-emerald-400 hover:text-emerald-300 border-emerald-900/60 hover:bg-emerald-950/40',
      prompt: 'I kick off a collapsing skyscraper, weaving through the dust and embers to flank him from above!',
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 text-xs no-scrollbar">
      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider shrink-0 pl-1">
        Tactical Moves:
      </span>
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={() => onSelectAction(act.prompt)}
            disabled={disabled}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border bg-black/60 backdrop-blur-sm shrink-0 font-cinzel font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed ${act.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
};
