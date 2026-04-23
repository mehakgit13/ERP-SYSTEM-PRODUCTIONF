import { useEffect, useState } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  ArcElement, Tooltip, Legend,
} from 'chart.js';
import api from '../../api/axiosInstance';
import StatusBadge from '../../components/common/StatusBadge';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const DEMO = {
  counts: {
    totalRevenue: 284530, pendingOrders: 47, lowStockProducts: 12,
    unpaidInvoices: 8, totalProducts: 124, totalUsers: 18,
    confirmedOrders: 32, shippedOrders: 15, deliveredOrders: 67,
  },
  revenue: { totalRevenue: 284530, unpaidAmount: 42000 },
  monthlyRevenue: [
    { _id: { month: 1 }, revenue: 42000 },
    { _id: { month: 2 }, revenue: 58000 },
    { _id: { month: 3 }, revenue: 51000 },
    { _id: { month: 4 }, revenue: 73000 },
    { _id: { month: 5 }, revenue: 68000 },
    { _id: { month: 6 }, revenue: 84000 },
  ],
  lowStockList: [],
  recentOrders: [
    { _id:'1', orderNumber:'SO-1042', customer:{ name:'Nexus Corp' }, grandTotal:12450, status:'confirmed', createdAt: new Date() },
    { _id:'2', orderNumber:'SO-1041', customer:{ name:'BlueSky Ltd' }, grandTotal:8320,  status:'pending',   createdAt: new Date() },
    { _id:'3', orderNumber:'SO-1040', customer:{ name:'Orion Tech' }, grandTotal:24100, status:'shipped',    createdAt: new Date() },
    { _id:'4', orderNumber:'SO-1039', customer:{ name:'Vertex Inc' }, grandTotal:5800,  status:'delivered',  createdAt: new Date() },
  ],
};

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background:'#161D2F', border:'1px solid #1E2A40', borderRadius:12,
    padding:'18px 20px', position:'relative', overflow:'hidden',
  }}>
    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:color, borderRadius:'12px 12px 0 0' }} />
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
      <div style={{ fontSize:11, color:'#475569', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</div>
      <span style={{ fontSize:20 }}>{icon}</span>
    </div>
    <div style={{ fontSize:30, fontWeight:800, letterSpacing:'-1px', marginBottom:6 }}>{value}</div>
    <div style={{ fontSize:12, color }}>{sub}</div>
  </div>
);

const Dashboard = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(r => setData(r.data.data))
      .catch(() => setData(DEMO))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', paddingTop:80 }}>
      <span className="spinner" />
    </div>
  );

  const { counts, revenue, monthlyRevenue, lowStockList, recentOrders } = data;

  // Build bar chart from real monthly data
  const monthLabels  = monthlyRevenue.map(m => MONTHS[m._id.month - 1]);
  const monthValues  = monthlyRevenue.map(m => m.revenue);

  const barData = {
    labels: monthLabels.length ? monthLabels : MONTHS.slice(0, 6),
    datasets: [{
      label: 'Revenue ($)',
      data: monthValues.length ? monthValues : [42000,58000,51000,73000,68000,84000],
      backgroundColor: 'rgba(59,130,246,0.7)',
      borderRadius: 6,
    }],
  };

  const doughnutData = {
    labels: ['Pending','Confirmed','Shipped','Delivered'],
    datasets: [{
      data: [
        counts.pendingOrders   || 0,
        counts.confirmedOrders || 0,
        counts.shippedOrders   || 0,
        counts.deliveredOrders || 0,
      ],
      backgroundColor: ['#F59E0B','#3B82F6','#8B5CF6','#10B981'],
      borderWidth: 0,
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color:'#94A3B8', font:{ size:11 } } } },
    scales: {
      x: { ticks:{ color:'#475569' }, grid:{ color:'#1E2A40' } },
      y: { ticks:{ color:'#475569' }, grid:{ color:'#1E2A40' } },
    },
  };

  return (
    <div className="fade-in">
      {/* Stat Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
        <StatCard label="Total Revenue"   value={`$${((revenue?.totalRevenue||0)/1000).toFixed(0)}k`}  sub="▲ from paid invoices"     color="#3B82F6" icon="💰" />
        <StatCard label="Pending Orders"  value={counts.pendingOrders  || 0} sub="Awaiting confirmation"    color="#F59E0B" icon="⏳" />
        <StatCard label="Low Stock Items" value={counts.lowStockProducts|| 0} sub="▼ Needs reorder"          color="#EF4444" icon="⚠️" />
        <StatCard label="Total Products"  value={counts.totalProducts  || 0} sub="Across all categories"    color="#8B5CF6" icon="📦" />
        <StatCard label="Unpaid Invoices" value={`$${((revenue?.unpaidAmount||0)/1000).toFixed(0)}k`} sub={`${counts.unpaidInvoices||0} invoices pending`} color="#F59E0B" icon="🧾" />
        <StatCard label="Team Members"    value={counts.totalUsers     || 0} sub="Active accounts"           color="#EC4899" icon="👥" />
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1.8fr 1fr', gap:16, marginBottom:24 }}>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>Monthly Revenue</div>
          <div style={{ height:200 }}>
            <Bar data={barData} options={chartOpts} />
          </div>
        </div>
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontWeight:700, marginBottom:16, fontSize:14 }}>Orders by Status</div>
          <div style={{ height:200, display:'flex', justifyContent:'center' }}>
            <Doughnut data={doughnutData} options={{ ...chartOpts, scales:undefined, cutout:'65%' }} />
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockList?.length > 0 && (
        <div style={{
          background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.25)',
          borderRadius:10, padding:'12px 16px', marginBottom:20,
        }}>
          <div style={{ fontWeight:700, color:'#EF4444', marginBottom:10, fontSize:13 }}>
            ⚠️ Low Stock Alert ({lowStockList.length} items)
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {lowStockList.map(p => (
              <span key={p._id} style={{
                background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)',
                borderRadius:6, padding:'4px 10px', fontSize:12, color:'#FCA5A5',
              }}>
                {p.title} — {p.stock} left (min {p.reorderLevel})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="card">
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #1E2A40', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontWeight:700, fontSize:14 }}>Recent Sales Orders</span>
        </div>
        <div className="table-container">
          <table>
            <thead><tr>
              {['Order #','Customer','Amount','Status','Date'].map(h => <th key={h}>{h}</th>)}
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o._id}>
                  <td className="mono" style={{ color:'#3B82F6', fontWeight:600 }}>{o.orderNumber}</td>
                  <td style={{ color:'#F1F5F9' }}>{o.customer?.name || '—'}</td>
                  <td style={{ fontWeight:700, color:'#F1F5F9' }}>${(o.grandTotal||0).toLocaleString()}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
