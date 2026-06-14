# Interactive Dashboard Development

A modern, interactive dashboard application for data visualization and analytics using **Chart.js**.

## 🎯 Project Overview

A professional, responsive dashboard built with HTML5, CSS3, and JavaScript featuring:
- **Interactive Charts** powered by Chart.js
- **Real-time Data Visualization** from CSV files
- **Responsive Design** for desktop and mobile
- **GitHub Pages Compatible** (no backend required)
- **Filtereable Metrics** (Sales, Revenue, Users)

## 📁 Project Structure

```
interactive-dashboard-development/
│
├── index.html              # Main HTML with Chart.js integration
├── style.css               # Professional responsive styling
├── script.js               # Chart.js and data visualization logic
│
├── data/
│   └── dashboard_data.csv  # CSV data source
│
├── assets/
│   ├── logo.png            # Project logo
│   └── screenshots/        # Screenshot directory
│
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🚀 Phase 2: Dashboard Technology (CURRENT)

### Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Data Format**: CSV
- **Hosting**: GitHub Pages
- **Browser Compatibility**: All modern browsers

### Why Chart.js?
✅ **Easy to Use** - Simple API, minimal setup  
✅ **Professional** - Beautiful, responsive charts  
✅ **Works on GitHub Pages** - No backend required  
✅ **No Dependencies** - Single CDN link  
✅ **Lightweight** - ~11KB minified  
✅ **Highly Customizable** - Colors, animations, interactions  

### Features Implemented
- 📊 **Line Charts** - Sales trend analysis
- 📈 **Bar Charts** - Revenue overview
- 🍩 **Doughnut Charts** - User growth distribution
- 📉 **Multi-metric Charts** - Combined overview
- 🔘 **Filter Buttons** - Category-based filtering
- 📱 **Responsive Design** - Mobile-friendly layout
- ⏰ **Real-time Updates** - Timestamp tracking

## 📊 Chart Types

| Chart Type | Data Category | Purpose |
|-----------|---------------|---------|
| Line | Sales | Trend analysis over time |
| Bar | Revenue | Comparative metrics visualization |
| Doughnut | Users | Distribution and proportions |
| Multi-Line | All Categories | Comprehensive overview |

## 📝 CSV Data Format

```csv
date,category,value,metric
2024-01-01,Sales,1500,Units
2024-01-04,Revenue,45000,USD
2024-01-07,Users,250,Count
```

**Columns:**
- `date` - Data point date (YYYY-MM-DD)
- `category` - Metric type (Sales, Revenue, Users)
- `value` - Numeric value
- `metric` - Unit of measurement

## 🎨 Design Features

- **Color Scheme**: Modern gradient background with card-based layout
- **Typography**: System fonts for optimal performance
- **Responsiveness**: Mobile-first grid layout
- **Interactivity**: Hover effects, filter buttons, real-time updates
- **Accessibility**: Semantic HTML, proper color contrast

## 🛠️ Installation & Setup

### Local Development
```bash
# Clone the repository
git clone https://github.com/KeerthuM-02012007/interactive-dashboard-development.git
cd interactive-dashboard-development

# Open in browser
open index.html
# or
start index.html  # Windows
```

### Deploy to GitHub Pages
1. Enable GitHub Pages in repository settings
2. Select `main` branch as source
3. Dashboard will be live at: `https://KeerthuM-02012007.github.io/interactive-dashboard-development/`

## 📊 Using the Dashboard

1. **View Charts**: Dashboard automatically loads and displays data from `dashboard_data.csv`
2. **Filter by Category**: Click filter buttons (All Metrics, Sales, Revenue, Users)
3. **Hover for Details**: Hover over chart elements for detailed information
4. **Responsive View**: Resize window to see responsive grid layout

## 📦 Dependencies

- **Chart.js 4.x** - CDN: `https://cdn.jsdelivr.net/npm/chart.js`
- No npm packages required

## 🔧 Customization

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #2c3e50;
    --secondary-color: #3498db;
    --accent-color: #e74c3c;
    /* ... more colors */
}
```

### Add New Charts
1. Create canvas element in `index.html`
2. Add chart creation function in `script.js`
3. Call function from `renderDashboard()`

### Update Data
Replace `data/dashboard_data.csv` with your own data following the CSV format.

## 📈 Next Phases (Future)

- **Phase 3**: Advanced analytics (trends, forecasting)
- **Phase 4**: Backend integration (real-time data API)
- **Phase 5**: Export functionality (PDF, PNG)
- **Phase 6**: Database integration (MongoDB, PostgreSQL)

## 📄 License

MIT License - Feel free to use this project for personal and commercial purposes.

## 👨‍💻 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues or questions, please open an [GitHub Issue](https://github.com/KeerthuM-02012007/interactive-dashboard-development/issues).

## 🙏 Acknowledgments

- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
- [MDN Web Docs](https://developer.mozilla.org/)
- Inspired by modern data visualization dashboards