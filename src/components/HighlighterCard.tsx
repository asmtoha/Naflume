import React, { useMemo } from 'react';

export interface HighlighterItem {
  id: string;
  userId: string;
  title: string;
  durationNumber: number;
  durationUnit: 'days' | 'weeks' | 'months' | 'years';
  startDate: any; // Firestore Timestamp
  endDate: any;   // Firestore Timestamp
}

interface HighlighterCardProps {
  item: HighlighterItem;
  onEdit: (item: HighlighterItem) => void;
  onDelete: (item: HighlighterItem) => void;
}

const HighlighterCard: React.FC<HighlighterCardProps> = ({ item, onEdit, onDelete }) => {
  const { progressPercent, timeLeftLabel } = useMemo(() => {
    const now = new Date().getTime();
    const startMs = item.startDate?.toDate ? item.startDate.toDate().getTime() : new Date(item.startDate).getTime();
    const endMs = item.endDate?.toDate ? item.endDate.toDate().getTime() : new Date(item.endDate).getTime();
    const total = Math.max(endMs - startMs, 1);
    const elapsed = Math.min(Math.max(now - startMs, 0), total);
    const percent = Math.round((elapsed / total) * 100);

    const millisLeft = Math.max(endMs - now, 0);
    const days = Math.ceil(millisLeft / (24 * 60 * 60 * 1000));
    const timeLeft = days > 0 ? `${days} day${days === 1 ? '' : 's'} left` : 'Ends today';
    return { progressPercent: percent, timeLeftLabel: timeLeft };
  }, [item]);

  return (
    <div className="relative w-64 max-w-full h-32 rounded-2xl overflow-hidden group transform hover:scale-105 transition-all duration-500 flex-shrink-0" style={{
      filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3)) drop-shadow(0 0 30px rgba(99,102,241,0.2))'
    }}>
      {/* Living Neo-Light Border with flowing energy */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none">
        <div className="neo-light-border"></div>
        <div className="neo-light-border neo-light-border-delayed"></div>
      </div>

      {/* Ethereal Fire Effect - Top Right Corner */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
        <div className="ethereal-fire"></div>
        <div className="ethereal-fire ethereal-fire-delayed"></div>
        <div className="ethereal-fire ethereal-fire-delayed-2"></div>
      </div>

      {/* Transparent Card Background - Only Effects Visible */}
      <div className="absolute inset-0 rounded-2xl">
        {/* Progress Background - Enhanced Visibility */}
        <div className="absolute inset-0 rounded-2xl">
          {/* Progress Bar Background */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200/30 rounded-b-2xl"></div>
          {/* Progress Bar Fill */}
          <div
            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-all duration-1000 rounded-b-2xl shadow-lg"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Progress Bar Glow Effect */}
          <div
            className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-purple-500/50 transition-all duration-1000 rounded-b-2xl blur-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Magical Shimmer Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 -skew-x-12" style={{
            background: 'linear-gradient(110deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 70%)',
            animation: 'magicalShimmer 3s infinite'
          }} />
        </div>

        {/* Floating Particles Inside Card */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="card-particle" style={{ top: '20%', left: '15%', animationDelay: '0.5s' }}></div>
          <div className="card-particle" style={{ top: '70%', left: '80%', animationDelay: '2.5s' }}></div>
          <div className="card-particle" style={{ top: '50%', left: '60%', animationDelay: '1.8s' }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full p-5 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-bold text-gray-800 pr-8 line-clamp-2 leading-tight">{item.title}</h4>
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-white/60 transition-colors duration-200" title="Edit">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m2 0h2m-2 0l-7 7-2 4 4-2 7-7m0 0V5" /></svg>
            </button>
            <button onClick={() => onDelete(item)} className="p-1.5 rounded-lg hover:bg-white/60 transition-colors duration-200" title="Delete">
              <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0V5a2 2 0 012-2h2a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-600 font-medium">{timeLeftLabel}</div>
          <div className="flex items-center gap-1">
            <div className="text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{progressPercent}%</div>
            <div className="w-1 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighlighterCard;


