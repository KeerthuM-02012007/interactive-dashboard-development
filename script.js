// Business Performance Dashboard
let charts = {};
let dashboardData = [];

// Color palette
const colors = {
    primary: '#0f3460',
    success: '#00d4ff',
    danger: '#ff6b6b',
    warning: '#ffd93d',
    info: '#3498db',
    secondary: '#9b59b6',
};

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    loadDashboardData();
    updateTime();
    setInterval(updateTime, 1000);
});

// Load and parse CSV data
function loadDashboardData() {
    fetch('data/dashboard_data.csv')
        .then(response => response.text())
        .then(data => {
            dashboardData = parseCSV(data);
            console.log('Data loaded:', dashboardData);
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
        return obj;
    });
}

// Render all dashboard components
function renderDashboard() {
    calculateKPIs();
    createRevenueTrendChart();
    createTopProductsChart();
    createRegionChart();
    createCategorySplitChart();
    createMonthlyGrowthChart();
    generateInsights();
}

// ===== KPI CALCULATIONS =====
function calculateKPIs() {
    const revenue = dashboardData.reduce((sum, d) => sum + (d.revenue || 0), 0);
    const profit = dashboardData.reduce((sum, d) => sum + (d.profit || 0), 0);
    const orders = dashboardData.reduce((sum, d) => sum + (d.orders || 0), 0);
    const customers = dashboardData.reduce((sum, d) => sum + (d.customers || 0), 0);

    document.getElementById('kpiRevenue').textContent = '$' + revenue.toLocaleString();
    document.getElementById('kpiProfit').textContent = '$' + profit.toLocaleString();
    document.getElementById('kpiOrders').textContent = orders.toLocaleString();
    document.getElementById('kpiCustomers').textContent = customers.toLocaleString();
}

// ===== REVENUE TREND CHART (Line) =====
function createRevenueTrendChart() {
    const dates = dashboardData.map(d => d.date).slice(0, 10);
    const revenues = dashboardData.map(d => d.revenue || 0).slice(0, 10);
    
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
                    labels: { font: { size: 12, weight: 'bold' }, color: '#1a1a2e' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#666', callback: (v) => '$' + v.toLocaleString() },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: { ticks: { color: '#666' }, grid: { color: 'rgba(0, 0, 0, 0.05)' } }
            }
        }
    });
}

// ===== TOP PRODUCTS CHART (Bar) =====
function createTopProductsChart() {
    const products = [
        { name: 'Product A', sales: 8500 },
        { name: 'Product B', sales: 7200 },
        { name: 'Product C', sales: 6800 },
        { name: 'Product D', sales: 5400 },
        { name: 'Product E', sales: 4100 }
    ];

    const ctx = document.getElementById('topProductsChart').getContext('2d');
    charts.topProducts = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: products.map(p => p.name),
            datasets: [{
                label: 'Sales Amount',
                data: products.map(p => p.sales),
                backgroundColor: [
                    colors.success,
                    colors.info,
                    colors.warning,
                    colors.secondary,
                    colors.danger
                ],
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true, labels: { font: { size: 11, weight: 'bold' } } }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { color: '#666', callback: (v) => '$' + v.toLocaleString() },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                y: { ticks: { color: '#666' }, grid: { drawBorder: false } }
            }
        }
    });
}

// ===== REGION PERFORMANCE CHART (Horizontal Bar) =====
function createRegionChart() {
    const regions = [
        { name: 'North America', performance: 45 },
        { name: 'Europe', performance: 38 },
        { name: 'Asia Pacific', performance: 32 },
        { name: 'Latin America', performance: 28 }
    ];

    const ctx = document.getElementById('regionChart').getContext('2d');
    charts.region = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regions.map(r => r.name),
            datasets: [{
                label: 'Performance Score',
                data: regions.map(r => r.performance),
                backgroundColor: colors.info,
                borderRadius: 6,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: true, labels: { font: { size: 11, weight: 'bold' } } }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 50,
                    ticks: { color: '#666' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                y: { ticks: { color: '#666' }, grid: { drawBorder: false } }
            }
        }
    });
}

// ===== CATEGORY SPLIT CHART (Pie) =====
function createCategorySplitChart() {
    const categories = [
        { name: 'Electronics', value: 35 },
        { name: 'Clothing', value: 25 },
        { name: 'Home & Garden', value: 20 },
        { name: 'Sports', value: 12 },
        { name: 'Other', value: 8 }
    ];

    const ctx = document.getElementById('categorySplitChart').getContext('2d');
    charts.categorySplit = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories.map(c => c.name),
            datasets: [{
                data: categories.map(c => c.value),
                backgroundColor: [
                    colors.success,
                    colors.info,
                    colors.warning,
                    colors.secondary,
                    colors.danger
                ],
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
                    labels: { font: { size: 11, weight: 'bold' }, color: '#1a1a2e', padding: 15 }
                }
            }
        }
    });
}

// ===== MONTHLY GROWTH CHART (Area) =====
function createMonthlyGrowthChart() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const growth = [12, 19, 15, 25, 22, 30];

    const ctx = document.getElementById('monthlyGrowthChart').getContext('2d');
    charts.monthlyGrowth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Monthly Growth %',
                data: growth,
                borderColor: colors.warning,
                backgroundColor: colors.warning + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: colors.warning,
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
                    labels: { font: { size: 12, weight: 'bold' }, color: '#1a1a2e' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#666', callback: (v) => v + '%' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: { ticks: { color: '#666' }, grid: { color: 'rgba(0, 0, 0, 0.05)' } }
            }
        }
    });
}

// ===== GENERATE INSIGHTS & RECOMMENDATIONS =====
function generateInsights() {
    const insights = [
        'Revenue increased by 12.5% compared to the previous period',
        'Top performing category is Electronics with 35% market share',
        'North America region shows the highest performance at 45 points',
        'Product A leads sales with $8,500 in total revenue',
        'Monthly growth trend shows consistent upward trajectory reaching 30%'
    ];

    const recommendations = [
        'Increase marketing budget for the Electronics category to capitalize on demand',
        'Expand operations in North America and Europe regions given their strong performance',
        'Consider seasonal promotions to boost sales during slower months',
        'Develop Product A variants to maintain market leadership',
        'Implement customer loyalty program to increase repeat purchases'
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
