import React from 'react';

export default function TreeControls({
  showControls,
  setShowControls,
  showMinimap,
  setShowMinimap,
  showGrid,
  setShowGrid,
  showRelationLabels,
  setShowRelationLabels,
  maxGenerations,
  setMaxGenerations,
  genderFilter,
  setGenderFilter,
  ageFilter,
  setAgeFilter,
  onSearch,
  onFitView,
  onCenter,
  onReset
}) {
  return (
    <div className="card shadow-sm p-3">
      <h6 className="mb-3">Tree Controls</h6>
      
      {/* Display Options */}
      <div className="mb-3">
        <label className="form-label">Display Options</label>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showControls"
            checked={showControls}
            onChange={(e) => setShowControls(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showControls">
            Show Controls
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showMinimap"
            checked={showMinimap}
            onChange={(e) => setShowMinimap(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showMinimap">
            Show Minimap
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showGrid"
            checked={showGrid}
            onChange={(e) => setShowGrid(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showGrid">
            Show Grid
          </label>
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="showRelationLabels"
            checked={showRelationLabels}
            onChange={(e) => setShowRelationLabels(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showRelationLabels">
            Show Relation Labels
          </label>
        </div>
      </div>

      {/* Generation Filter */}
      <div className="mb-3">
        <label htmlFor="maxGenerations" className="form-label">
          Max Generations
        </label>
        <select
          id="maxGenerations"
          className="form-select"
          value={maxGenerations}
          onChange={(e) => setMaxGenerations(Number(e.target.value))}
        >
          <option value="0">Show All</option>
          <option value="1">1 Generation</option>
          <option value="2">2 Generations</option>
          <option value="3">3 Generations</option>
          <option value="4">4 Generations</option>
          <option value="5">5 Generations</option>
        </select>
      </div>

      {/* Gender Filter */}
      <div className="mb-3">
        <label htmlFor="genderFilter" className="form-label">
          Gender Filter
        </label>
        <select
          id="genderFilter"
          className="form-select"
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* Age Filter */}
      <div className="mb-3">
        <label htmlFor="ageFilter" className="form-label">
          Age Filter
        </label>
        <select
          id="ageFilter"
          className="form-select"
          value={ageFilter}
          onChange={(e) => setAgeFilter(e.target.value)}
        >
          <option value="all">All Ages</option>
          <option value="children">Children (0-18)</option>
          <option value="adults">Adults (19-59)</option>
          <option value="seniors">Seniors (60+)</option>
        </select>
      </div>

      {/* Search */}
      <div className="mb-3">
        <label htmlFor="search" className="form-label">
          Search Members
        </label>
        <input
          type="text"
          className="form-control"
          id="search"
          placeholder="Enter name..."
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* View Controls */}
      <div className="d-grid gap-2">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={onFitView}
        >
          Fit View
        </button>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={onCenter}
        >
          Center View
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={onReset}
        >
          Reset View
        </button>
      </div>
    </div>
  );
}