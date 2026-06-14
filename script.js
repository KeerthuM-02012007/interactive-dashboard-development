// Interactive Dashboard with Chart.js
let charts = {};
let dashboardData = [];
let currentFilter = 'all';

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initialized');
    loadDashboardData();
    setupFilterButtons();
    updateTime();
});

// Setup filter button listeners
function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            updateCharts();
        });
    });
}

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
            document.getElementById('dashboard').innerHTML = 
                '<div class="error">Error loading data. Please check the CSV file.</div>';
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

// Render all dashboard charts
function renderDashboard() {
    createSalesChart();
    createRevenueChart();
    createUsersChart();
    createCombinedChart();
}

// Update all charts based on filter
function updateCharts() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    charts = {};
    renderDashboard();
}

// Create Sales Chart
function createSalesChart() {
    const salesData = dashboardData.filter(d => d.category === 'Sales');
    
    if (salesData.length === 0) return;

    const ctx = document.getElementById('salesChart').getContext('2d');
    charts.sales = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.map(d => d.date),
            datasets: [{
                label: 'Sales (Units)',
                data: salesData.map(d => d.value),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#3498db',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        color: '#2c3e50'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#7f8c8d' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    ticks: { color: '#7f8c8d' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                }
            }
        }
    });
}

// Create Revenue Chart
function createRevenueChart() {
    const revenueData = dashboardData.filter(d => d.category === 'Revenue');
    
    if (revenueData.length === 0) return;

    const ctx = document.getElementById('revenueChart').getContext('2d');
    charts.revenue = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: revenueData.map(d => d.date),
            datasets: [{
                label: 'Revenue (USD)',
                data: revenueData.map(d => d.value),
                backgroundColor: [
                    '#27ae60',
                    '#2ecc71',
                    '#16a085'
                ],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        color: '#2c3e50'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#7f8c8d',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    ticks: { color: '#7f8c8d' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                }
            }
        }
    });
}

// Create Users Chart
function createUsersChart() {
    const usersData = dashboardData.filter(d => d.category === 'Users');
    
    if (usersData.length === 0) return;

    const ctx = document.getElementById('usersChart').getContext('2d');
    charts.users = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: usersData.map(d => d.date),
            datasets: [{
                data: usersData.map(d => d.value),
                backgroundColor: [
                    '#e74c3c',
                    '#e67e22',
                    '#f39c12'
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
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        color: '#2c3e50',
                        padding: 15
                    }
                }
            }
        }
    });
}

// Create Combined Chart
function createCombinedChart() {
    const allData = dashboardData;
    const dates = [...new Set(allData.map(d => d.date))];
    const categories = [...new Set(allData.map(d => d.category))];

    const datasets = categories.map((category, index) => {
        const colors = ['#3498db', '#27ae60', '#e74c3c'];
        const categoryData = allData.filter(d => d.category === category);
        
        return {
            label: category,
            data: dates.map(date => {
                const item = categoryData.find(d => d.date === date);
                return item ? item.value : 0;
            }),
            borderColor: colors[index],
            backgroundColor: colors[index] + '20',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 5,
        };
    });

    const ctx = document.getElementById('combinedChart').getContext('2d');
    charts.combined = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        color: '#2c3e50'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#7f8c8d' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    ticks: { color: '#7f8c8d' },
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                }
            }
        }
    });
}

// Update time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('updateTime').textContent = timeString;
}
