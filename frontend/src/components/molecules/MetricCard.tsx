'use client';

import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: string;
  colorClass?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  colorClass = 'text-primary',
}) => {
  return (
    <div className="col-12 col-sm-6 col-xl-3 mb-4">
      <div 
        className="card border-0 shadow-sm p-4 bg-white bg-opacity-75 h-100" 
        style={{ backdropFilter: 'blur(10px)', borderRadius: '1rem' }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-muted text-uppercase fs-7 fw-bold mb-1" style={{ fontSize: '0.75rem' }}>
              {title}
            </p>
            <h3 className={`fw-bold mb-0 ${colorClass}`}>
              {value} {unit && <span className="fs-6 text-muted fw-normal">{unit}</span>}
            </h3>
          </div>
          {icon && (
            <div className={`fs-2 p-3 rounded-circle bg-light bg-opacity-50 ${colorClass}`}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};