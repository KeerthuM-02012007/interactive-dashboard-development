// Business Performance Dashboard
let charts = {};
let dashboardData = [];
let filters = {
    region: 'all',
    month: 'all',
    category: 'all'
};

// Color palette
const colors = {
    primary: '#2563EB',
    success: '#22C55E',
    warning: '#F59E0B',
    text: '#1E293B',
    subtle: '#475569',
    grid: 'rgba(30, 41, 59, 0.08)',
    neutral: '#64748B',
    lightNeutral: '#94A3B8',
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    loadDashboardData();
    updateTime();
    setInterval(updateTime, 1000);
});

function setupFilters() {
    document.querySelectorAll('.filter-select').forEach(select => {
        select.addEventListener('change', function() {
            filters[this.dataset.filter] = this.value;
            updateDashboard();
        });
    });
}

function populateFilterOptions() {
    const regions = [...new Set(dashboardData.map(d => d.region))].sort();
    const months = [...new Set(dashboardData.map(d => d.month))].sort((a, b) => new Date(a) - new Date(b));
    const categories = [...new Set(dashboardData.map(d => d.category))].sort();

    const regionSelect = document.getElementById('regionFilter');
    const monthSelect = document.getElementById('monthFilter');
    const categorySelect = document.getElementById('categoryFilter');

    regionSelect.innerHTML = '<option value="all">All Regions</option>';
    monthSelect.innerHTML = '<option value="all">All Months</option>';
    categorySelect.innerHTML = '<option value="all">All Categories</option>';

    regions.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    months.forEach(month => {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

function applyFilters() {
    return dashboardData.filter(item => {
        const regionMatch = filters.region === 'all' || item.region === filters.region;
        const monthMatch = filters.month === 'all' || item.month === filters.month;
        const categoryMatch = filters.category === 'all' || item.category === filters.category;
        return regionMatch && monthMatch && categoryMatch;
    });
}

function destroyCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
}

function updateDashboard() {
    destroyCharts();
    const filteredData = applyFilters();
    renderDashboard(filteredData);
}

// Load and parse CSV data
function loadDashboardData() {
    fetch('data/dashboard_data.csv')
        .then(response => response.text())
        .then(data => {
            dashboardData = parseCSV(data);
            console.log('Data loaded:', dashboardData);
            populateFilterOptions();
            setupFilters();
            renderDashboard();
        })
        .catch(error => {
            console.error('Error loading data:', error);
        });
}

// Parse CSV string into array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = isNaN(values[index]) ? values[index] : Number(values[index]);
        });
        obj.month = new Date(obj.date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
        return obj;
    });
}

// Render all dashboard components
function renderDashboard(data = dashboardData) {
    calculateKPIs(data);
    createRevenueTrendChart(data);
    createTopProductsChart(data);
    createRegionChart(data);
    createCategorySplitChart(data);
    createMonthlyGrowthChart(data);
    generateInsights(data);
}




// ===== KPI CALCULATIONS =====
function calculateKPIs(data) {
    const revenue = data.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const profit = data.reduce((sum, d) => sum + (d.profit || 0), 0);
    const orders = data.reduce((sum, d) => sum + (d.orders || 0), 0);
    const customers = data.reduce((sum, d) => sum + (d.customers || 0), 0);

    document.getElementById('kpiRevenue').textContent = '$' + revenue.toLocaleString();
    document.getElementById('kpiProfit').textContent = '$' + profit.toLocaleString();
    document.getElementById('kpiOrders').textContent = orders.toLocaleString();
    document.getElementById('kpiCustomers').textContent = customers.toLocaleString();
}

// ===== REVENUE TREND CHART (Line) =====
function createRevenueTrendChart(data) {
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
    const dates = sortedData.map(d => d.date).slice(0, 10);
    const revenues = sortedData.map(d => d.revenue || 0).slice(0, 10);
    
    const ctx = document.getElementById('revenueTrendChart').getContext('2d');
    charts.revenueTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Daily Revenue',
                data: revenues,
                borderColor: colors.success,
                backgroundColor: colors.success + '15',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: colors.success,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: { size: 12, weight: 'bold' }, color: colors.text }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: colors.subtle, callback: (v) => '$' + v.toLocaleString() },
                    grid: { color: colors.grid }
                },
                x: { ticks: { color: colors.subtle }, grid: { color: colors.grid } }
            }
        }
    });
}

// ===== TOP PRODUCTS CHART (Horizontal Bar) =====
function createTopProductsChart(data) {
    const productRevenue = data.reduce((acc, item) => {
        const name = item.product || 'Unknown';
        acc[name] = (acc[name] || 0) + (item.revenue || 0);
        return acc;
    }, {});

    const products = Object.entries(productRevenue)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5);

    const ctx = document.getElementById('topProductsChart').getContext('2d');
    charts.topProducts = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.name),
            datasets: [{
                label: 'Sales Amount',
                data: products.map(p => p.total),
                backgroundColor: colors.primary,
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: colors.subtle, callback: (v) => '$' + v.toLocaleString() },
                    grid: { color: colors.grid }
                },
                y: { ticks: { color: colors.subtle }, grid: { drawBorder: false } }
            }
        }
    });
}

// ===== SALES BY REGION CHART (Bar) =====
function createRegionChart(data) {
    const regionRevenue = data.reduce((acc, item) => {
        const region = item.region || 'Unassigned';
        acc[region] = (acc[region] || 0) + (item.revenue || 0);
        return acc;
    }, {});

    const regions = Object.entries(regionRevenue)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total);

    const ctx = document.getElementById('regionChart').getContext('2d');
    charts.region = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regions.map(r => r.name),
            datasets: [{
                label: 'Sales by Region',
                data: regions.map(r => r.total),
                backgroundColor: colors.primary,
                borderRadius: 6,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: colors.subtle, callback: (v) => '$' + v.toLocaleString() },
                    grid: { color: colors.grid }
                },
                x: { ticks: { color: colors.subtle }, grid: { drawBorder: false } }
            }
        }
    });
}

// ===== CATEGORY DISTRIBUTION CHART (Pie) =====
function createCategorySplitChart(data) {
    const categoryRevenue = data.reduce((acc, item) => {
        const category = item.category || 'Other';
        acc[category] = (acc[category] || 0) + (item.revenue || 0);
        return acc;
    }, {});

    const categories = Object.entries(categoryRevenue)
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total);

    const colorsForChart = [
        colors.primary,
        colors.success,
        colors.warning,
        colors.neutral,
        colors.lightNeutral
    ];

    const ctx = document.getElementById('categorySplitChart').getContext('2d');
    charts.categorySplit = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories.map(c => c.name),
            datasets: [{
                data: categories.map(c => c.total),
                backgroundColor: categories.map((_, index) => colorsForChart[index % colorsForChart.length]),
                borderColor: '#fff',
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { size: 11, weight: 'bold' }, color: colors.text, padding: 15 }
                }
            }
        }
    });
}

// ===== GROWTH RATE CHART (Line) =====
function createMonthlyGrowthChart(data) {
    const revenueByMonth = data.reduce((acc, item) => {
        acc[item.month] = (acc[item.month] || 0) + (item.revenue || 0);
        return acc;
    }, {});

    const months = Object.keys(revenueByMonth).sort((a, b) => new Date(a) - new Date(b));
    const totals = months.map(month => revenueByMonth[month]);
    const growth = totals.map((value, index) => {
        if (index === 0) return 0;
        const previous = totals[index - 1];
        return previous ? Math.round(((value - previous) / previous) * 100) : 0;
    });

    const ctx = document.getElementById('monthlyGrowthChart').getContext('2d');
    charts.monthlyGrowth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Growth Rate %',
                data: growth,
                borderColor: colors.primary,
                backgroundColor: colors.primary + '15',
                borderWidth: 3,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: colors.primary,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: { font: { size: 12, weight: 'bold' }, color: colors.text }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: colors.subtle, callback: (v) => v + '%' },
                    grid: { color: colors.grid }
                },
                x: { ticks: { color: colors.subtle }, grid: { color: colors.grid } }
            }
        }
    });
}

// ===== GENERATE INSIGHTS & RECOMMENDATIONS =====
function generateInsights() {
    const insights = [
        'Revenue increased 18% in Q2.',
        'Product A generated 35% of total sales.',
        'South region performed best.',
        'April recorded highest monthly growth.'
    ];

    const recommendations = [
        'Increase inventory for Product A.',
        'Focus marketing on South region.',
        'Improve sales strategy in West region.'
    ];

    const insightsList = document.getElementById('keyInsights');
    const recommendationsList = document.getElementById('recommendations');

    insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');
    recommendationsList.innerHTML = recommendations.map(r => `<li>${r}</li>`).join('');
}

// ===== UPDATE TIME =====
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('updateTime').textContent = timeString;
}
