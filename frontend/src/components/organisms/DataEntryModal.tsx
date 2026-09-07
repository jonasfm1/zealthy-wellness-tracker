'use client';

import React, { useState } from 'react';
import { Button } from '@/components/atoms/Button';

export type MetricType = 'water' | 'calories' | 'exercise' | 'journal';

interface DataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (type: MetricType, value: string | number) => void;
}

/**
 * A universal modal component for logging all wellness metrics.
 * Adapts the input field (number vs. text area) based on the selected metric.
 */
export const DataEntryModal: React.FC<DataEntryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [metricType, setMetricType] = useState<MetricType>('water');
  const [inputValue, setInputValue] = useState<string | number>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue !== '') {
      onSubmit(metricType, metricType === 'journal' ? String(inputValue) : Number(inputValue));
      setInputValue('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '1rem' }}>
          <div className="modal-header border-bottom-0">
            <h5 className="modal-title fw-bold text-dark">Log New Metric</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label text-secondary">Select Metric</label>
                <select 
                  className="form-select" 
                  value={metricType} 
                  onChange={(e) => {
                    setMetricType(e.target.value as MetricType);
                    setInputValue('');
                  }}
                >
                  <option value="water">Water (Glasses)</option>
                  <option value="calories">Nutrition (Calories)</option>
                  <option value="exercise">Exercise (Minutes)</option>
                  <option value="journal">Daily Journal (Text)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="form-label text-secondary">
                  {metricType === 'journal' ? 'Your Thoughts' : 'Amount'}
                </label>
                {metricType === 'journal' ? (
                  <textarea 
                    className="form-control" 
                    rows={3}
                    value={inputValue} 
                    onChange={(e) => setInputValue(e.target.value)}
                    required 
                  />
                ) : (
                  <input 
                    type="number" 
                    className="form-control" 
                    value={inputValue} 
                    onChange={(e) => setInputValue(Number(e.target.value))}
                    required 
                    min="1"
                  />
                )}
              </div>
              <div className="d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={onClose}>Cancel</Button>
                <Button variant="primary" type="submit">Save Log</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};