export function NetWorthCard() {
    return (
        <div className="w-full h-full rounded-3xl p-6 relative overflow-hidden" style={{
            background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
            boxShadow: '0 20px 40px rgba(255, 94, 98, 0.3)'
        }}>
            <h3 className="text-white/90 text-sm font-medium mb-1">Total Net Worth</h3>
            <p className="text-white text-4xl font-bold">$283,164</p>

            {/* Background decoration */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        </div>
    )
}
