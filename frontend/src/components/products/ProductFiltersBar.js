const roastOptions = ['light', 'medium-light', 'medium', 'medium-dark', 'dark'];
const processOptions = ['Washed', 'Natural', 'Honey'];
const gradeOptions = ['Grade 1', 'Grade 2'];
const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'best-seller', label: 'Best Selling' },
    { value: 'latest', label: 'Newest Arrivals' },
    { value: 'rating', label: 'Highest Rated' },
];

export default function ProductFiltersBar({ filters, setFilters, count, regions = [] }) {
    const activeCount = ['region', 'roastLevel', 'process', 'grade']
        .filter(key => Boolean(filters[key]))
        .length + ((filters.priceMin || filters.priceMax) ? 1 : 0);

    return (
        <section className="collection-toolbar collection-toolbar-upgraded">
            <div>
                <p className="toolbar-kicker">Coffee atlas</p>
                <h2>{count} premium Ethiopian coffees</h2>
                <span className="active-filter-line">{activeCount} active filters</span>
            </div>

            <div className="toolbar-controls toolbar-controls-upgraded">
                <label className="toolbar-select">
                    <span>Region</span>
                    <select
                        value={filters.region || ''}
                        onChange={event => setFilters(current => ({ ...current, region: event.target.value, page: 1 }))}
                    >
                        <option value="">All Regions</option>
                        {regions.map(region => <option key={region} value={region}>{region}</option>)}
                    </select>
                </label>

                <label className="toolbar-select">
                    <span>Roast</span>
                    <select
                        value={filters.roastLevel || ''}
                        onChange={event => setFilters(current => ({ ...current, roastLevel: event.target.value, page: 1 }))}
                    >
                        <option value="">All Roasts</option>
                        {roastOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </label>

                <label className="toolbar-select">
                    <span>Process</span>
                    <select
                        value={filters.process || ''}
                        onChange={event => setFilters(current => ({ ...current, process: event.target.value, page: 1 }))}
                    >
                        <option value="">All Processes</option>
                        {processOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </label>

                <label className="toolbar-select">
                    <span>Grade</span>
                    <select
                        value={filters.grade || ''}
                        onChange={event => setFilters(current => ({ ...current, grade: event.target.value, page: 1 }))}
                    >
                        <option value="">All Grades</option>
                        {gradeOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </label>

                <label className="toolbar-select">
                    <span>Sort</span>
                    <select
                        value={filters.sortBy || 'featured'}
                        onChange={event => setFilters(current => ({ ...current, sortBy: event.target.value, page: 1 }))}
                    >
                        {sortOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                </label>

                <div className="price-chip-group">
                    <input
                        type="number"
                        min="200"
                        placeholder="Min ETB"
                        value={filters.priceMin || ''}
                        onChange={event => setFilters(current => ({ ...current, priceMin: event.target.value, page: 1 }))}
                    />
                    <input
                        type="number"
                        min="200"
                        placeholder="Max ETB"
                        value={filters.priceMax || ''}
                        onChange={event => setFilters(current => ({ ...current, priceMax: event.target.value, page: 1 }))}
                    />
                </div>

                <button
                    type="button"
                    className="filter-clear-button"
                    onClick={() => setFilters({
                        region: '',
                        roastLevel: '',
                        process: '',
                        grade: '',
                        priceMin: '',
                        priceMax: '',
                        sortBy: 'featured',
                        page: 1,
                    })}
                >
                    Clear All
                </button>
            </div>
        </section>
    );
}
