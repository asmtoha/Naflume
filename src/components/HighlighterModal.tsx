import React, { useEffect, useState } from 'react';

type DurationUnit = 'days' | 'weeks' | 'months' | 'years';

export interface HighlighterDraft {
  id?: string;
  title: string;
  durationNumber: number;
  durationUnit: DurationUnit;
}

interface HighlighterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (draft: HighlighterDraft) => Promise<void> | void;
  initialData?: HighlighterDraft | null;
}

const HighlighterModal: React.FC<HighlighterModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [durationNumber, setDurationNumber] = useState<number>(30);
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('days');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDurationNumber(initialData.durationNumber || 30);
      setDurationUnit(initialData.durationUnit || 'days');
    } else {
      setTitle('');
      setDurationNumber(30);
      setDurationUnit('days');
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || durationNumber <= 0) return;
    try {
      setSubmitting(true);
      await onSubmit({ id: initialData?.id, title: title.trim(), durationNumber, durationUnit });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md mx-4 rounded-2xl shadow-2xl border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-black">
              {initialData ? 'Edit Highlighter' : 'Add Highlighter'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Praying Five Times Daily"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3 items-end">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    min={1}
                    value={durationNumber}
                    onChange={(e) => setDurationNumber(Number(e.target.value))}
                    className="w-28 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <select
                    value={durationUnit}
                    onChange={(e) => setDurationUnit(e.target.value as DurationUnit)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100">Cancel</button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
              >
                {submitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Highlighter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HighlighterModal;


