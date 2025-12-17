import React from 'react';

const SkeletonCard = () => (
  <div className="skeleton-card" style={{padding: 12, borderRadius: 6, background: '#f2f2f2'}}>
    <div style={{width: '100%', height: 140, background: '#e6e6e6', borderRadius: 4}} />
    <div style={{height: 12, width: '70%', background: '#e9e9e9', marginTop: 12, borderRadius: 4}} />
    <div style={{height: 12, width: '40%', background: '#e9e9e9', marginTop: 8, borderRadius: 4}} />
  </div>
);

export default function SkeletonGrid({count = 6}) {
  const items = Array.from({length: count});
  return (
    <div className="skeleton-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12}}>
      {items.map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}
