import React from 'react';
import './SystemNavbar.css';

export const SystemNavbar = () => {
  const items = [
    { label: 'Overview', href: '#overview' },
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'Tech', href: '#tech' },
    { label: 'Docs', href: '#docs' }
  ];

  return (
    <nav className="system-navbar" aria-label="Main navigation">
      <div className="system-navbar__inner container">
        <div className="system-navbar__brand" aria-label="SERA">SERA</div>
        <ul className="system-navbar__list" role="menubar">
          {items.map((it) => (
            <li key={it.label} role="none">
              <a className="system-navbar__item" role="menuitem" href={it.href}>
                {it.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default SystemNavbar;
