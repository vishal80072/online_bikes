import React from 'react';
import { NavLink } from 'react-router-dom';

export default function AdminSidebar() {
  return (
    <div className="bb-sidebar d-flex flex-column">
      <nav className="d-flex flex-column">
        <NavLink to="/admin" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-speedometer2" /> Dashboard
        </NavLink>
        <NavLink to="/admin/bikes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <i className="bi bi-bicycle" /> Manage Bikes
        </NavLink>
      </nav>
    </div>
  );
}