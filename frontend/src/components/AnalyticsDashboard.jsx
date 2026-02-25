
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AnalyticsDashboard.css"; // Ensure this exists or add styles inline (better here as we use inline js styles mostly but need hover)
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = () => {
    const [data, setData] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);
    const API = `http://${window.location.hostname}:8000/api`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [res, predRes] = await Promise.all([
                    axios.get(`${API}/analytics/`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${API}/analytics/sales-prediction/`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                setData(res.data);
                setPrediction(predRes.data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div style={styles.loading}>Loading Analytics...</div>;
    if (!data) return <div style={styles.error}>Failed to load data.</div>;

    // Data for Pie Chart (Category Sales) support
    const pieData = data.category_sales || [];

    // Prepare Prediction Chart Data
    const predictionChartData = prediction ? [
        ...prediction.history,
        {
            month: "Next Month (Est)",
            y: prediction.prediction,
            isPrediction: true
        }
    ] : [];

    return (
        <div style={styles.container} className="animate-fade-in">
            <h2 style={styles.heading}>Dashboard Overview</h2>

            {/* KPI CARDS */}
            <div style={styles.kpiGrid}>
                <KPICard title="Today's Sales" value={`Rs. ${data.daily_sales.toLocaleString()}`} icon="💰" color="#3498db" />
                <KPICard title="Weekly Revenue" value={`Rs. ${data.weekly_sales.toLocaleString()}`} icon="📅" color="#2ecc71" />
                <KPICard title="Monthly Revenue" value={`Rs. ${data.monthly_sales.toLocaleString()}`} icon="📈" color="#9b59b6" />
                <KPICard title="Low Stock Items" value={data.low_stock_products.length} icon="⚠️" color="#e74c3c" />
            </div>



            {/* CHARTS ROW 1 */}
            <div style={styles.chartsRow} className="charts-row">
                {/* REVENUE TREND (Line Chart) */}
                <div style={styles.chartCard} className="hover-lift">
                    <h3 style={styles.chartTitle}>Revenue Trend (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.revenue_trend}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" stroke="#888" />
                            <YAxis stroke="#888" />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                            <Legend />
                            <Line type="monotone" dataKey="sales" stroke="#3498db" strokeWidth={3} activeDot={{ r: 8 }} name="Sales (Rs)" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* CATEGORY SALES (Pie Chart) */}
                <div style={styles.chartCard} className="hover-lift">
                    <h3 style={styles.chartTitle}>Sales by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* PREDICTION SECTION */}
            {prediction && (
                <div style={styles.predictionSection} className="prediction-section animate-fade-in-up">
                    <div style={styles.predictionCard}>
                        <div style={styles.predictionHeader}>
                            <span style={{ fontSize: '24px' }}>🤖</span>
                            <h3 style={{ margin: 0, color: '#fff' }}>AI Revenue Forecast</h3>
                        </div>
                        <div style={styles.predictionValue}>
                            Rs. {prediction.prediction.toLocaleString()}
                        </div>
                        <div style={styles.predictionSub}>
                            Estimated for Next Month
                            <div className="tooltip-container" style={styles.tooltip}>ℹ️
                                <span className="tooltip-text">Prediction based on previous 6 months data ({prediction.formula})</span>
                            </div>
                        </div>
                    </div>

                    <div style={styles.chartCard}>
                        <h3 style={styles.chartTitle}>6-Month Revenue Forecast</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={predictionChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="month" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="y"
                                    stroke="#8e44ad"
                                    strokeWidth={3}
                                    name="Revenue"
                                    activeDot={{ r: 8 }}
                                />
                                {/* We could add a separate dashed line for prediction if we structured data differently, 
                                    but marking the last point or just letting it be one line is simpler for now. 
                                    Let's emphasize the prediction point if possible. */}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* DATA TABLES ROW */}
            <div style={styles.tablesGrid} className="tables-grid">
                {/* TOP PRODUCTS */}
                <div style={styles.tableCard} className="hover-lift">
                    <h3 style={styles.chartTitle}>🏆 Top Selling Products</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.th}>
                                <th style={{ ...styles.td, fontWeight: 'bold' }}>Product</th>
                                <th style={{ ...styles.td, fontWeight: 'bold', textAlign: 'right' }}>Sold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.top_products.map((p, i) => (
                                <tr key={i} style={styles.tr}>
                                    <td style={styles.td}>{p.name}</td>
                                    <td style={{ ...styles.td, textAlign: 'right', color: '#2ecc71', fontWeight: 'bold' }}>{p.sold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* LOW STOCK */}
                <div style={styles.tableCard} className="hover-lift">
                    <h3 style={styles.chartTitle}>⚠️ Low Stock Alerts</h3>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.th}>
                                <th style={{ ...styles.td, fontWeight: 'bold' }}>Product</th>
                                <th style={{ ...styles.td, fontWeight: 'bold', textAlign: 'right' }}>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.low_stock_products.map((p, i) => (
                                <tr key={i} style={styles.tr}>
                                    <td style={styles.td}>{p.name}</td>
                                    <td style={{ ...styles.td, textAlign: 'right', color: '#e74c3c', fontWeight: 'bold' }}>{p.stock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, icon, color }) => (
    <div style={{ ...styles.kpiCard, borderLeft: `5px solid ${color}` }} className="hover-lift">
        <div style={{ ...styles.kpiIcon, color: color, background: `${color}20` }}>{icon}</div>
        <div>
            <div style={styles.kpiTitle}>{title}</div>
            <div style={styles.kpiValue}>{value}</div>
        </div>
    </div>
);

const styles = {
    container: {
        padding: "20px",
        background: "#f8f9fa",
        borderRadius: "20px",
        minHeight: "80vh",
    },
    heading: {
        fontSize: "24px",
        fontWeight: "800",
        color: "#2c3e50",
        marginBottom: "30px",
    },
    kpiGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "24px",
        marginBottom: "40px",
    },
    kpiCard: {
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        transition: "transform 0.3s ease",
    },
    kpiIcon: {
        width: "50px",
        height: "50px",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "24px",
    },
    kpiTitle: {
        fontSize: "13px",
        color: "#7f8c8d",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        marginBottom: "4px",
    },
    kpiValue: {
        fontSize: "22px",
        fontWeight: "800",
        color: "#2c3e50",
    },
    chartsRow: {
        display: "grid",
        gridTemplateColumns: "2fr 1fr",
        gap: "24px",
        marginBottom: "40px",
        // Responsive styles moved to CSS
    },
    chartCard: {
        background: "white",
        padding: "24px",
        borderRadius: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
        height: "400px",
    },
    chartTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#2c3e50",
        marginBottom: "20px",
    },
    tablesGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        // Responsive styles moved to CSS
    },
    tableCard: {
        background: "white",
        padding: "24px",
        borderRadius: "24px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
        overflow: "hidden",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        borderBottom: "2px solid #f1f1f1",
        paddingBottom: "12px",
        color: "#7f8c8d",
        fontSize: "13px",
        textAlign: "left",
    },
    tr: {
        borderBottom: "1px solid #f8f9fa",
    },
    td: {
        padding: "16px 8px",
        fontSize: "14px",
        color: "#2c3e50",
    },
    loading: {
        padding: "40px",
        textAlign: "center",
        fontSize: "18px",
        color: "#7f8c8d",
    },
    error: {
        padding: "40px",
        textAlign: "center",
        fontSize: "18px",
        color: "#e74c3c",
    },
    predictionSection: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "24px",
        marginBottom: "40px",
        // Responsive styles moved to CSS
    },
    predictionCard: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "24px",
        padding: "30px",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        boxShadow: "0 10px 25px rgba(118, 75, 162, 0.3)",
        position: "relative",
    },
    predictionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "15px",
        opacity: 0.9,
    },
    predictionValue: {
        fontSize: "36px",
        fontWeight: "800",
        marginBottom: "10px",
        textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    predictionSub: {
        fontSize: "14px",
        opacity: 0.8,
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    tooltip: {
        cursor: "pointer",
        position: "relative",
        display: "inline-block",
        marginLeft: "5px",
    },
};

export default AnalyticsDashboard;
