import { WorkMode, TaskItem, ChallengePhase } from './types.ts';

export const MORNING_ROUTINE: Omit<TaskItem, 'isCompleted'>[] = [
  { id: 'm1', timeRange: '5:30 – 5:45', title: 'Wake up + water + breathing (no phone)', category: 'morning' },
  { id: 'm2', timeRange: '5:45 – 6:30', title: 'Exercise (cardio + bodyweight)', category: 'morning' },
  { id: 'm3', timeRange: '6:30 – 6:45', title: 'Stretch / cool down', category: 'morning' },
  { id: 'm4', timeRange: '6:45 – 7:00', title: 'Freshen up', category: 'morning' },
  { id: 'm5', timeRange: '7:00 – 8:15', title: 'Deep Coding / Learning', category: 'morning' },
  { id: 'm6', timeRange: '8:15 – 8:30', title: 'Breakfast (light & healthy)', category: 'morning' },
];

export const EVENING_ROUTINE: Omit<TaskItem, 'isCompleted'>[] = [
  { id: 'e1', timeRange: '7:00 – 8:00', title: 'Video Editing / Creative Skill', category: 'evening' },
  { id: 'e2', timeRange: '8:00 – 8:30', title: 'Dinner + family time', category: 'evening' },
  { id: 'e3', timeRange: '8:30 – 9:30', title: 'Light learning / reading', category: 'evening' },
  { id: 'e4', timeRange: '9:30 – 9:45', title: 'Daily review + gratitude', category: 'evening' },
  { id: 'e5', timeRange: '10:00 – 10:30', title: 'Wind down + sleep', category: 'evening' },
];

export const WORK_WFH: Omit<TaskItem, 'isCompleted'>[] = [
  { id: 'wfh1', timeRange: '9:00 – 11:00', title: 'Work – Deep focus', category: 'work' },
  { id: 'wfh2', timeRange: '11:00 – 11:10', title: 'Walk + stretch', category: 'work' },
  { id: 'wfh3', timeRange: '11:10 – 1:00', title: 'Work', category: 'work' },
  { id: 'wfh4', timeRange: '1:00 – 2:00', title: 'Lunch + short rest', category: 'work' },
  { id: 'wfh5', timeRange: '2:00 – 5:00', title: 'Work', category: 'work' },
  { id: 'wfh6', timeRange: '5:00 – 5:30', title: 'Break / walk', category: 'work' },
];

export const WORK_OFFICE: Omit<TaskItem, 'isCompleted'>[] = [
  { id: 'off1', timeRange: '9:00', title: 'Commute / Start Work', category: 'work' },
  { id: 'off2', timeRange: '9:30 – 6:30', title: 'Job (focus mode)', category: 'work' },
  { id: 'off3', timeRange: 'hourly', title: 'Water + movement every 1 hour', category: 'work' },
  { id: 'off4', timeRange: '1:00', title: 'Lunch + 10min Walk', category: 'work' },
];

export const CHALLENGE_PHASES = [
  {
    phase: ChallengePhase.DISCIPLINE,
    days: [1, 10],
    color: 'bg-green-500',
    textColor: 'text-green-600',
    borderColor: 'border-green-500',
    bgLight: 'bg-green-50',
    title: 'Discipline Phase',
    goal: 'Build consistency',
    desc: 'Focus on showing up, not perfection.',
    prompt: 'What did I complete today?'
  },
  {
    phase: ChallengePhase.GROWTH,
    days: [11, 20],
    color: 'bg-yellow-500',
    textColor: 'text-yellow-600',
    borderColor: 'border-yellow-500',
    bgLight: 'bg-yellow-50',
    title: 'Growth Phase',
    goal: 'Skill improvement',
    desc: 'Increase intensity. Reduce distractions.',
    prompt: 'What skill improved today?'
  },
  {
    phase: ChallengePhase.TRANSFORMATION,
    days: [21, 30],
    color: 'bg-blue-500',
    textColor: 'text-blue-600',
    borderColor: 'border-blue-500',
    bgLight: 'bg-blue-50',
    title: 'Transformation Phase',
    goal: 'Identity change',
    desc: 'You should feel different.',
    prompt: 'How am I better than Day 1?'
  },
];