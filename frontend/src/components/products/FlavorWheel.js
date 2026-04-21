const labels = [
    { key: 'floral', label: 'Floral' },
    { key: 'citrus', label: 'Citrus' },
    { key: 'stoneFruit', label: 'Stone Fruit' },
    { key: 'cacao', label: 'Cacao' },
    { key: 'spice', label: 'Spice' },
    { key: 'sweetness', label: 'Sweetness' },
];

export default function FlavorWheel({ flavorWheel }) {
    return (
        <div className="flavor-wheel-panel">
            <div className="flavor-wheel-core">
                <span>Taste</span>
                <strong>Profile</strong>
            </div>

            <div className="flavor-wheel-rings">
                {labels.map(item => (
                    <div key={item.key} className="flavor-band">
                        <div className="flavor-band-copy">
                            <span>{item.label}</span>
                            <strong>{flavorWheel[item.key]}%</strong>
                        </div>
                        <div className="flavor-band-track">
                            <div className="flavor-band-fill" style={{ width: `${flavorWheel[item.key]}%` }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
