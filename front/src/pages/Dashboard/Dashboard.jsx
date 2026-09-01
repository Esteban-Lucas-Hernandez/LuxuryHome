import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  getDashboardStats,
  getAdminOrders,
  updateOrderStatus,
  updateFurnitureStock,
  getCategories,
  getFurnitureList,
  createFurniture,
  updateFurniture,
  deleteFurniture
} from '../../api/orders';
import { authService } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

// Registro de componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Toast estilizado para el panel de administración
const AdminToast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  background: '#161616',
  color: '#ffffff',
  customClass: {
    popup: 'luxury-admin-toast'
  }
});

/**
 * Portal de Administración Completo con Barra Lateral Izquierda (Admin Dashboard).
 * Incluye pestañas para Resumen Analítico, Gestión de Pedidos, Catálogo & 3D,
 * Categorías y Clientes Registrados.
 * 
 * @returns {JSX.Element} Portal administrativo de alta gama.
 */
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Pestaña activa del sidebar: 'overview' | 'orders' | 'products' | 'categories' | 'customers'
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Estados de datos
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [furnitureList, setFurnitureList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros de Pedidos
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  // Filtros de Productos
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');

  // Modales
  const [trackingModal, setTrackingModal] = useState({ isOpen: false, order: null, message: '', status: '' });
  const [orderDetailModal, setOrderDetailModal] = useState({ isOpen: false, order: null });
  const [productModal, setProductModal] = useState({
    isOpen: false,
    isEdit: false,
    data: { id: null, name: '', description: '', price: '', stock: 10, category: '', image_path: '', model_3d_path: '', is_3d_active: true, scale_factor: 1.0 }
  });

  // Carga consolidada de datos
  const loadAllData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const [statsData, ordersData, furnData, catsData, usersData] = await Promise.all([
        getDashboardStats(),
        getAdminOrders(),
        getFurnitureList(),
        getCategories(),
        authService.getAdminUsers().catch(() => [])
      ]);

      setStats(statsData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setFurnitureList(Array.isArray(furnData) ? furnData : []);
      setCategoriesList(Array.isArray(catsData) ? catsData : []);
      setCustomersList(Array.isArray(usersData) ? usersData : []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      AdminToast.fire({
        icon: 'error',
        title: 'Error al sincronizar datos del servidor'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // =========================================================================
  // Control de Pedidos
  // =========================================================================
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
      loadAllData(true);
      AdminToast.fire({
        icon: 'success',
        title: `Pedido #NEX-${orderId.toString().padStart(5, '0')} actualizado a ${newStatus}`
      });
    } catch (err) {
      console.error('Error updating status:', err);
      AdminToast.fire({ icon: 'error', title: 'No se pudo actualizar el estado' });
    }
  };

  const handleSaveTracking = async (e) => {
    e.preventDefault();
    if (!trackingModal.order || !trackingModal.message.trim()) return;

    try {
      await updateOrderStatus(
        trackingModal.order.id,
        trackingModal.status || trackingModal.order.status,
        trackingModal.message
      );
      setTrackingModal({ isOpen: false, order: null, message: '', status: '' });
      loadAllData(true);
      AdminToast.fire({ icon: 'success', title: 'Novedad de tracking registrada' });
    } catch (err) {
      console.error('Error adding tracking message:', err);
      AdminToast.fire({ icon: 'error', title: 'Error al registrar novedad' });
    }
  };

  // =========================================================================
  // Control de Productos & Inventario
  // =========================================================================
  const handleStockDelta = async (furnitureId, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      await updateFurnitureStock(furnitureId, newStock);
      setFurnitureList(prev => prev.map(f => f.id === furnitureId ? { ...f, stock: newStock } : f));
      loadAllData(true);
      AdminToast.fire({ icon: 'info', title: `Stock actualizado a ${newStock} uds.` });
    } catch (err) {
      console.error('Error updating stock:', err);
      AdminToast.fire({ icon: 'error', title: 'No se pudo actualizar el stock' });
    }
  };

  const openCreateProductModal = () => {
    setProductModal({
      isOpen: true,
      isEdit: false,
      data: {
        id: null,
        name: '',
        description: '',
        price: '',
        stock: 10,
        category: categoriesList[0]?.id || '',
        image_path: 'silla.png',
        model_3d_path: 'chair.glb',
        is_3d_active: true,
        scale_factor: 1.0
      }
    });
  };

  const openEditProductModal = (product) => {
    setProductModal({
      isOpen: true,
      isEdit: true,
      data: {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock,
        category: product.category || (categoriesList[0]?.id || ''),
        image_path: product.image_path || '',
        model_3d_path: product.model_3d_path || '',
        is_3d_active: product.is_3d_active ?? true,
        scale_factor: product.scale_factor || 1.0
      }
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const { id, ...payload } = productModal.data;
    try {
      if (productModal.isEdit) {
        await updateFurniture(id, payload);
        AdminToast.fire({ icon: 'success', title: 'Mueble actualizado con éxito' });
      } else {
        await createFurniture(payload);
        AdminToast.fire({ icon: 'success', title: 'Nuevo mueble añadido al catálogo' });
      }
      setProductModal({ isOpen: false, isEdit: false, data: {} });
      loadAllData(true);
    } catch (err) {
      console.error('Error saving furniture:', err);
      AdminToast.fire({ icon: 'error', title: 'Error al guardar el mueble' });
    }
  };

  const handleDeleteProduct = async (id, name) => {
    const result = await Swal.fire({
      title: '¿Eliminar mueble?',
      text: `Se eliminará "${name}" del catálogo de forma permanente.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      background: '#161616',
      color: '#ffffff'
    });

    if (result.isConfirmed) {
      try {
        await deleteFurniture(id);
        AdminToast.fire({ icon: 'success', title: 'Mueble eliminado' });
        loadAllData(true);
      } catch (err) {
        console.error('Error deleting furniture:', err);
        AdminToast.fire({ icon: 'error', title: 'No se pudo eliminar el mueble' });
      }
    }
  };

  // =========================================================================
  // Gráficos Chart.js
  // =========================================================================
  const timelineData = stats?.sales_timeline || [];
  const revenueChartData = {
    labels: timelineData.map(d => {
      const parts = d.date.split('-');
      return `${parts[2]}/${parts[1]}`;
    }),
    datasets: [
      {
        label: 'Ingresos ($ COP)',
        data: timelineData.map(d => d.revenue),
        borderColor: '#c5a059',
        backgroundColor: 'rgba(197, 160, 89, 0.14)',
        fill: true,
        tension: 0.38,
        pointBackgroundColor: '#c5a059',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        yAxisID: 'y'
      },
      {
        label: 'Pedidos',
        data: timelineData.map(d => d.orders),
        borderColor: '#ffffff',
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.2,
        pointRadius: 3,
        yAxisID: 'y1'
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#a0a0a0', usePointStyle: true, font: { family: 'Montserrat', size: 11, weight: '600' } }
      },
      tooltip: {
        backgroundColor: '#111111',
        titleFont: { family: 'Montserrat', size: 12, weight: '700' },
        callbacks: {
          label: (ctx) => ctx.dataset.yAxisID === 'y' ? ` Ingresos: $${ctx.raw.toLocaleString('es-CO')}` : ` Pedidos: ${ctx.raw}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#888888', font: { family: 'Montserrat', size: 10 } } },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: '#888888', font: { family: 'Montserrat', size: 10 }, callback: v => `$${(v / 1000).toFixed(0)}k` }
      },
      y1: {
        position: 'right',
        grid: { display: false },
        ticks: { color: '#888888', stepSize: 1, font: { family: 'Montserrat', size: 10 } }
      }
    }
  };

  const statusData = stats?.orders_by_status || [];
  const doughnutData = {
    labels: statusData.map(s => s.label),
    datasets: [
      {
        data: statusData.map(s => s.count),
        backgroundColor: ['#198754', '#0dcaf0', '#ffc107', '#20c997'],
        borderWidth: 3,
        borderColor: '#1f1f1f',
        hoverOffset: 6
      }
    ]
  };

  const topSellingList = stats?.top_selling || [];
  const topProductsChartData = {
    labels: topSellingList.map(p => p.name.length > 14 ? p.name.substring(0, 14) + '...' : p.name),
    datasets: [
      {
        label: 'Unidades Vendidas',
        data: topSellingList.map(p => p.total_sold),
        backgroundColor: '#c5a059',
        borderRadius: 6,
        barThickness: 16
      }
    ]
  };

  const kpis = stats?.kpis || {};

  return (
    <div className={`admin-portal-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      
      {/* =========================================================================
          BARRA LATERAL IZQUIERDA (LEFT SIDEBAR DE LUJO)
          ========================================================================= */}
      <aside className="admin-sidebar">
        {/* Brand Header */}
        <div className="sidebar-brand-box">
          <Link to="/" className="sidebar-brand-link text-decoration-none">
            <div className="sidebar-brand-typography">
              <span className="brand-word">NEXORA</span>
              <span className="brand-x">X</span>
            </div>
          </Link>
          <span className="sidebar-portal-badge">PORTAL ADMIN</span>
        </div>

        {/* Admin Profile Chip */}
        <div className="sidebar-user-card">
          <div className="sidebar-user-avatar">
            <i className="fas fa-user-shield text-gold"></i>
            <span className="sidebar-user-online-dot"></span>
          </div>
          <div className="sidebar-user-info">
            <h6 className="sidebar-user-name mb-0">{user?.username || 'Administrador'}</h6>
            <span className="sidebar-user-role">Super Admin</span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="sidebar-nav-menu">
          <span className="sidebar-menu-label">PRINCIPAL</span>
          <button
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-pie"></i>
            <span>Resumen & Analítica</span>
          </button>

          <span className="sidebar-menu-label">OPERACIONES</span>
          <button
            className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fas fa-boxes-stacked"></i>
            <span>Gestión de Pedidos</span>
            {kpis.active_orders > 0 && (
              <span className="badge bg-gold text-dark ms-auto">{kpis.active_orders}</span>
            )}
          </button>

          <span className="sidebar-menu-label">CATÁLOGO & 3D</span>
          <button
            className={`sidebar-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <i className="fas fa-couch"></i>
            <span>Muebles & Modelos 3D</span>
          </button>
          <button
            className={`sidebar-nav-item ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <i className="fas fa-layer-group"></i>
            <span>Categorías & Ambientes</span>
          </button>

          <span className="sidebar-menu-label">COMUNIDAD</span>
          <button
            className={`sidebar-nav-item ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            <i className="fas fa-users"></i>
            <span>Clientes VIP</span>
          </button>

          <span className="sidebar-menu-label">SISTEMA</span>
          <a
            href="http://localhost:8000/admin/"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-nav-item sidebar-external-link"
          >
            <i className="fas fa-sliders"></i>
            <span>Django Backend Admin</span>
            <i className="fas fa-arrow-up-right-from-square ms-auto small text-muted"></i>
          </a>
        </nav>

        {/* Sidebar Footer Links */}
        <div className="sidebar-footer-box">
          <Link to="/" className="sidebar-footer-btn mb-2">
            <i className="fas fa-store me-2"></i>
            <span>Ir a Tienda Pública</span>
          </Link>
          <button
            className="sidebar-footer-btn btn-logout"
            onClick={() => { logout(); navigate('/'); }}
          >
            <i className="fas fa-right-from-bracket me-2 text-danger"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          CONTENEDOR PRINCIPAL DERECHO (MAIN CONTENT AREA)
          ========================================================================= */}
      <div className="admin-main-container">
        
        {/* Top Navbar del Dashboard */}
        <header className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button
              className="admin-toggle-sidebar-btn"
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              title="Colapsar menú"
            >
              <i className="fas fa-bars"></i>
            </button>
            <h5 className="admin-topbar-title mb-0">
              {activeTab === 'overview' && '📊 Resumen Ejecutivo & Analítica'}
              {activeTab === 'orders' && '📦 Centro de Control de Pedidos'}
              {activeTab === 'products' && '🛋️ Catálogo de Muebles & Modelos 3D'}
              {activeTab === 'categories' && '🗂️ Arquitectura de Categorías'}
              {activeTab === 'customers' && '👥 Directorio de Clientes Registrados'}
            </h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              className={`btn btn-admin-sync ${refreshing ? 'spinning' : ''}`}
              onClick={() => loadAllData(true)}
              title="Sincronizar en vivo"
            >
              <i className="fas fa-rotate"></i>
              <span className="d-none d-md-inline ms-1">{refreshing ? 'Actualizando...' : 'Sincronizar'}</span>
            </button>
            <span className="admin-live-clock d-none d-lg-block">
              <i className="far fa-clock text-gold me-1"></i>
              {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </header>

        {/* Cuerpo del Contenido por Pestaña */}
        <main className="admin-content-body p-4">
          
          {/* =====================================================================
              PESTAÑA 1: RESUMEN ANALÍTICO (OVERVIEW)
              ===================================================================== */}
          {activeTab === 'overview' && (
            <div className="tab-overview-view">
              
              {/* 4 Tarjetas de KPIs */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="admin-kpi-card p-4 rounded-4">
                    <span className="kpi-tag">INGRESOS GLOBALES</span>
                    <h3 className="kpi-number text-gold mb-1">
                      ${(kpis.total_revenue || 0).toLocaleString('es-CO')}
                    </h3>
                    <small className="text-light-muted">
                      <i className="fas fa-calendar-alt text-gold me-1"></i> Mes actual: ${(kpis.monthly_revenue || 0).toLocaleString('es-CO')}
                    </small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="admin-kpi-card p-4 rounded-4">
                    <span className="kpi-tag">ORDENES TOTALES</span>
                    <h3 className="kpi-number text-white mb-1">{kpis.total_orders || 0}</h3>
                    <div className="d-flex gap-2 mt-1">
                      <span className="badge bg-warning-subtle text-warning small">{kpis.active_orders || 0} activas</span>
                      <span className="badge bg-success-subtle text-success small">{kpis.delivered_orders || 0} entregadas</span>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="admin-kpi-card p-4 rounded-4">
                    <span className="kpi-tag">CLIENTES VIP</span>
                    <h3 className="kpi-number text-white mb-1">{kpis.total_users || 0}</h3>
                    <small className="text-success">
                      <i className="fas fa-user-check me-1"></i> Base de compradores activa
                    </small>
                  </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-3">
                  <div className="admin-kpi-card p-4 rounded-4">
                    <span className="kpi-tag">CATÁLOGO 3D</span>
                    <h3 className="kpi-number text-white mb-1">{kpis.total_furniture || 0} piezas</h3>
                    <small className={kpis.low_stock_count > 0 ? 'text-danger fw-bold' : 'text-success'}>
                      {kpis.low_stock_count > 0 ? `⚠️ ${kpis.low_stock_count} con stock bajo` : '✅ Stock saludable'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Fila de Gráficos */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-lg-8">
                  <div className="admin-chart-box p-4 rounded-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="chart-box-title mb-0">Evolución de Ingresos y Volumen</h6>
                      <span className="badge bg-dark-luxury text-gold border">Últimos 14 días</span>
                    </div>
                    <div className="chart-wrapper" style={{ height: '300px' }}>
                      <Line data={revenueChartData} options={revenueChartOptions} />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="admin-chart-box p-4 rounded-4 h-100">
                    <h6 className="chart-box-title mb-3">Estados de Pedidos</h6>
                    <div className="chart-wrapper" style={{ height: '240px' }}>
                      <Doughnut
                        data={doughnutData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { position: 'bottom', labels: { color: '#a0a0a0', font: { size: 10 } } }
                          },
                          cutout: '70%'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fila Inferior: Top Muebles & Alertas */}
              <div className="row g-4">
                <div className="col-12 col-lg-6">
                  <div className="admin-chart-box p-4 rounded-4 h-100">
                    <h6 className="chart-box-title mb-3">Muebles Más Populares</h6>
                    <div className="chart-wrapper" style={{ height: '180px' }}>
                      <Bar
                        data={topProductsChartData}
                        options={{
                          indexAxis: 'y',
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { ticks: { color: '#888888' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                            y: { ticks: { color: '#ffffff', font: { weight: '600' } }, grid: { display: false } }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="admin-chart-box p-4 rounded-4 h-100">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="chart-box-title text-danger mb-0">Alertas de Stock Crítico</h6>
                      <button className="btn btn-gold-solid btn-sm py-1" onClick={() => setActiveTab('products')}>
                        Gestionar Todo
                      </button>
                    </div>
                    {stats?.inventory_alerts && stats.inventory_alerts.length > 0 ? (
                      <div className="d-flex flex-column gap-2">
                        {stats.inventory_alerts.map(prod => (
                          <div key={prod.id} className="p-2 rounded-3 bg-dark-luxury border border-secondary d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center gap-2">
                              <img src={prod.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&h=80'} alt={prod.name} className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                              <div>
                                <p className="mb-0 fw-bold small text-white">{prod.name}</p>
                                <span className={`badge ${prod.stock === 0 ? 'bg-danger' : 'bg-warning text-dark'} small`}>
                                  {prod.stock === 0 ? 'Agotado' : `${prod.stock} uds.`}
                                </span>
                              </div>
                            </div>
                            <div className="d-flex gap-1">
                              <button className="btn btn-outline-light btn-sm px-2 py-1" onClick={() => handleStockDelta(prod.id, prod.stock, 1)}>+1</button>
                              <button className="btn btn-gold-solid btn-sm px-2 py-1" onClick={() => handleStockDelta(prod.id, prod.stock, 5)}>+5</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted">
                        <i className="fas fa-check-circle text-success fa-2x mb-2 d-block"></i>
                        <span>Todo el inventario cuenta con stock suficiente.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* =====================================================================
              PESTAÑA 2: GESTIÓN DE PEDIDOS (ORDERS)
              ===================================================================== */}
          {activeTab === 'orders' && (
            <div className="tab-orders-view">
              <div className="admin-table-box p-4 rounded-4">
                
                {/* Barra de Filtros */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom border-secondary mb-4">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-gold text-dark px-3 py-2 fw-bold fs-6">
                      {orders.length} Pedidos Registrados
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <div className="input-group input-group-sm" style={{ maxWidth: '260px' }}>
                      <span className="input-group-text bg-dark-luxury border-secondary text-gold">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark-luxury border-secondary text-white"
                        placeholder="Buscar por orden o cliente..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="form-select form-select-sm bg-dark-luxury border-secondary text-white"
                      style={{ width: '170px' }}
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                    >
                      <option value="">Todos los estados</option>
                      <option value="PAID">PAID - Pagado</option>
                      <option value="PREPARING">PREPARING - En Preparación</option>
                      <option value="SHIPPED">SHIPPED - En Camino</option>
                      <option value="DELIVERED">DELIVERED - Entregado</option>
                    </select>
                  </div>
                </div>

                {/* Tabla de Órdenes */}
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle admin-dark-table mb-0">
                    <thead>
                      <tr>
                        <th>ORDEN</th>
                        <th>CLIENTE</th>
                        <th>FECHA</th>
                        <th>PRODUCTOS</th>
                        <th>TOTAL</th>
                        <th>ESTADO</th>
                        <th>CAMBIO RÁPIDO</th>
                        <th className="text-end">ACCIONES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(o => {
                          const matchesStatus = orderStatusFilter ? o.status === orderStatusFilter : true;
                          const matchesSearch = orderSearch
                            ? o.id.toString().includes(orderSearch) ||
                              (o.user?.username || '').toLowerCase().includes(orderSearch.toLowerCase())
                            : true;
                          return matchesStatus && matchesSearch;
                        })
                        .map(order => {
                          const items = order.items || [];
                          const totalQty = order.total_items || items.reduce((a, i) => a + i.quantity, 0);
                          const totalVal = parseFloat(order.total_amount || 0);

                          return (
                            <tr key={order.id}>
                              <td>
                                <span className="fw-bold text-gold font-monospace">
                                  #NEX-{order.id.toString().padStart(5, '0')}
                                </span>
                              </td>
                              <td>
                                <div className="d-flex align-items-center gap-2">
                                  <div className="admin-user-avatar-circle">
                                    <i className="fas fa-user text-gold small"></i>
                                  </div>
                                  <span className="fw-semibold text-white">
                                    {order.user?.username || 'Cliente'}
                                  </span>
                                </div>
                              </td>
                              <td className="small text-light-muted">
                                {new Date(order.created_at).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td>
                                <span className="badge bg-dark-luxury text-white border border-secondary">
                                  {totalQty} {totalQty === 1 ? 'mueble' : 'muebles'}
                                </span>
                              </td>
                              <td>
                                <span className="fw-bold text-gold">
                                  ${totalVal.toLocaleString('es-CO')}
                                </span>
                              </td>
                              <td>
                                {order.status === 'PAID' && <span className="badge badge-status-paid">Pagado</span>}
                                {order.status === 'PREPARING' && <span className="badge badge-status-prep">Preparación</span>}
                                {order.status === 'SHIPPED' && <span className="badge badge-status-ship">En Camino</span>}
                                {order.status === 'DELIVERED' && <span className="badge badge-status-deliv">Entregado</span>}
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm status-quick-select-dark"
                                  value={order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                >
                                  <option value="PAID">1. Pagado</option>
                                  <option value="PREPARING">2. Preparación</option>
                                  <option value="SHIPPED">3. En Camino</option>
                                  <option value="DELIVERED">4. Entregado</option>
                                </select>
                              </td>
                              <td className="text-end">
                                <div className="d-flex justify-content-end gap-1">
                                  <button
                                    className="btn btn-outline-light btn-sm px-2 py-1"
                                    title="Ver detalle"
                                    onClick={() => setOrderDetailModal({ isOpen: true, order })}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-gold-solid btn-sm px-2 py-1"
                                    title="Añadir Novedad de Tracking"
                                    onClick={() => setTrackingModal({ isOpen: true, order, message: '', status: order.status })}
                                  >
                                    <i className="fas fa-location-dot me-1"></i> Tracking
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* =====================================================================
              PESTAÑA 3: CATÁLOGO DE MUEBLES & MODELOS 3D (PRODUCTS)
              ===================================================================== */}
          {activeTab === 'products' && (
            <div className="tab-products-view">
              <div className="admin-table-box p-4 rounded-4">
                
                {/* Header de Productos */}
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 pb-3 border-bottom border-secondary mb-4">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-gold text-dark px-3 py-2 fw-bold fs-6">
                      {furnitureList.length} Muebles en Catálogo
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <div className="input-group input-group-sm" style={{ maxWidth: '240px' }}>
                      <span className="input-group-text bg-dark-luxury border-secondary text-gold">
                        <i className="fas fa-search"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control bg-dark-luxury border-secondary text-white"
                        placeholder="Buscar mueble..."
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                      />
                    </div>

                    <select
                      className="form-select form-select-sm bg-dark-luxury border-secondary text-white"
                      style={{ width: '160px' }}
                      value={productCategoryFilter}
                      onChange={(e) => setProductCategoryFilter(e.target.value)}
                    >
                      <option value="">Todas las categorías</option>
                      {categoriesList.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>

                    <button className="btn btn-gold-solid btn-sm px-3" onClick={openCreateProductModal}>
                      <i className="fas fa-plus me-1"></i> Nuevo Mueble
                    </button>
                  </div>
                </div>

                {/* Tabla de Muebles */}
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle admin-dark-table mb-0">
                    <thead>
                      <tr>
                        <th>PIEZA</th>
                        <th>CATEGORÍA</th>
                        <th>PRECIO</th>
                        <th>STOCK DISPONIBLE</th>
                        <th>SOPORTE 3D</th>
                        <th className="text-end">GESTIÓN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {furnitureList
                        .filter(f => {
                          const matchesCat = productCategoryFilter ? f.category?.toString() === productCategoryFilter : true;
                          const matchesSearch = productSearch ? f.name.toLowerCase().includes(productSearch.toLowerCase()) : true;
                          return matchesCat && matchesSearch;
                        })
                        .map(furn => (
                          <tr key={furn.id}>
                            <td>
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={furn.image || furn.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100'}
                                  alt={furn.name}
                                  className="rounded shadow-sm"
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100'; }}
                                />
                                <div>
                                  <h6 className="mb-0 fw-bold text-white">{furn.name}</h6>
                                  <small className="text-light-muted font-monospace">ID #{furn.id}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-dark-luxury text-gold border border-secondary">
                                {furn.category_name || 'General'}
                              </span>
                            </td>
                            <td>
                              <span className="fw-bold text-white">${parseFloat(furn.price).toLocaleString('es-CO')}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <span className={`badge ${furn.stock <= 0 ? 'bg-danger' : furn.stock <= 3 ? 'bg-warning text-dark' : 'bg-success'}`}>
                                  {furn.stock} uds.
                                </span>
                                <button className="btn btn-outline-secondary btn-sm px-2 py-0" onClick={() => handleStockDelta(furn.id, furn.stock, -1)} disabled={furn.stock <= 0}>-</button>
                                <button className="btn btn-outline-secondary btn-sm px-2 py-0" onClick={() => handleStockDelta(furn.id, furn.stock, 1)}>+</button>
                                <button className="btn btn-gold-solid btn-sm px-2 py-0" onClick={() => handleStockDelta(furn.id, furn.stock, 5)}>+5</button>
                              </div>
                            </td>
                            <td>
                              {furn.is_3d_active && furn.model_3d_url ? (
                                <span className="badge bg-success-subtle text-success">
                                  <i className="fas fa-cube me-1"></i> Modelo GLB Activo
                                </span>
                              ) : (
                                <span className="badge bg-secondary">Solo Imagen 2D</span>
                              )}
                            </td>
                            <td className="text-end">
                              <div className="d-flex justify-content-end gap-1">
                                <Link to={`/products/${furn.id}`} target="_blank" className="btn btn-outline-light btn-sm px-2 py-1" title="Ver en 3D">
                                  <i className="fas fa-eye"></i>
                                </Link>
                                <button className="btn btn-outline-warning btn-sm px-2 py-1" onClick={() => openEditProductModal(furn)} title="Editar mueble">
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button className="btn btn-outline-danger btn-sm px-2 py-1" onClick={() => handleDeleteProduct(furn.id, furn.name)} title="Eliminar mueble">
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* =====================================================================
              PESTAÑA 4: CATEGORÍAS & COLECCIONES
              ===================================================================== */}
          {activeTab === 'categories' && (
            <div className="tab-categories-view">
              <div className="row g-4">
                {categoriesList.filter(c => c.parent === null).map(mainCat => {
                  const subcats = mainCat.subcategories || [];
                  return (
                    <div key={mainCat.id} className="col-12 col-md-6 col-xl-4">
                      <div className="admin-category-card p-4 rounded-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="fw-bold text-gold mb-0">{mainCat.name}</h5>
                          <span className="badge bg-dark-luxury text-white border border-secondary">
                            {subcats.length} subcategorías
                          </span>
                        </div>
                        <div className="subcats-chip-grid d-flex flex-wrap gap-2 mt-3">
                          {subcats.length > 0 ? (
                            subcats.map(sub => (
                              <span key={sub.id} className="subcat-chip">
                                <i className="fas fa-tag me-1 text-gold"></i>
                                {sub.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">Sin subcategorías anidadas.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =====================================================================
              PESTAÑA 5: CLIENTES VIP
              ===================================================================== */}
          {activeTab === 'customers' && (
            <div className="tab-customers-view">
              <div className="admin-table-box p-4 rounded-4">
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary">
                  <h5 className="fw-bold text-white mb-0">Directorio de Clientes Registrados</h5>
                  <span className="badge bg-gold text-dark px-3 py-2 fw-bold">
                    {customersList.length} Clientes Totales
                  </span>
                </div>

                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle admin-dark-table mb-0">
                    <thead>
                      <tr>
                        <th>CLIENTE</th>
                        <th>CORREO ELECTRÓNICO</th>
                        <th>FECHA DE REGISTRO</th>
                        <th>ROL / PRIVILEGIOS</th>
                        <th>ÓRDENES REALIZADAS</th>
                        <th>TOTAL COMPRADO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customersList.map(cust => (
                        <tr key={cust.id}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="admin-user-avatar-circle">
                                <i className="fas fa-user text-gold small"></i>
                              </div>
                              <span className="fw-bold text-white">{cust.username}</span>
                            </div>
                          </td>
                          <td className="text-light-muted">{cust.email || 'Sin correo'}</td>
                          <td className="small text-light-muted">
                            {new Date(cust.date_joined).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td>
                            {cust.is_staff ? (
                              <span className="badge bg-gold text-dark">Staff / Administrador</span>
                            ) : (
                              <span className="badge bg-secondary">Cliente Estándar</span>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-dark-luxury text-white border border-secondary">
                              {cust.total_orders || 0} compras
                            </span>
                          </td>
                          <td>
                            <span className="fw-bold text-gold">
                              ${(cust.total_spent || 0).toLocaleString('es-CO')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* =========================================================================
          MODAL: REGISTRAR NOVEDAD DE TRACKING
          ========================================================================= */}
      {trackingModal.isOpen && trackingModal.order && (
        <div className="tracking-modal-backdrop" onClick={() => setTrackingModal({ isOpen: false, order: null, message: '', status: '' })}>
          <div className="tracking-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <div>
                <span className="order-code-badge mb-1 d-inline-block">
                  #NEX-{trackingModal.order.id.toString().padStart(5, '0')}
                </span>
                <h4 className="modal-title-luxury mb-0">Registrar Novedad de Despacho</h4>
              </div>
              <button
                className="tracking-modal-close-btn"
                onClick={() => setTrackingModal({ isOpen: false, order: null, message: '', status: '' })}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveTracking}>
              <div className="tracking-modal-body p-4">
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Actualizar Estado</label>
                  <select
                    className="form-select"
                    value={trackingModal.status}
                    onChange={(e) => setTrackingModal(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="PAID">PAID - Pagado y Confirmado</option>
                    <option value="PREPARING">PREPARING - En Taller / Preparación</option>
                    <option value="SHIPPED">SHIPPED - Despachado / En Ruta de Entrega</option>
                    <option value="DELIVERED">DELIVERED - Entregado Satisfactoriamente</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted text-uppercase">Mensaje de Seguimiento</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Ej: El pedido ha salido de la bodega principal en el camión de reparto #4..."
                    value={trackingModal.message}
                    onChange={(e) => setTrackingModal(prev => ({ ...prev, message: e.target.value }))}
                    required
                  ></textarea>
                </div>
              </div>

              <div className="tracking-modal-footer d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => setTrackingModal({ isOpen: false, order: null, message: '', status: '' })}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-gold-solid btn-sm px-4">
                  <i className="fas fa-paper-plane me-1"></i> Publicar Novedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DETALLE COMPLETO DE ORDEN
          ========================================================================= */}
      {orderDetailModal.isOpen && orderDetailModal.order && (
        <div className="tracking-modal-backdrop" onClick={() => setOrderDetailModal({ isOpen: false, order: null })}>
          <div className="tracking-modal-dialog" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <div>
                <span className="order-code-badge mb-1 d-inline-block">
                  #NEX-{orderDetailModal.order.id.toString().padStart(5, '0')}
                </span>
                <h4 className="modal-title-luxury mb-0">Desglose del Pedido</h4>
              </div>
              <button
                className="tracking-modal-close-btn"
                onClick={() => setOrderDetailModal({ isOpen: false, order: null })}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="tracking-modal-body p-4">
              <div className="row g-2 mb-3 pb-3 border-bottom">
                <div className="col-6">
                  <small className="text-muted d-block">Cliente Comprador</small>
                  <span className="fw-bold text-dark">{orderDetailModal.order.user?.username || 'Cliente VIP'}</span>
                </div>
                <div className="col-6 text-end">
                  <small className="text-muted d-block">Fecha de Compra</small>
                  <span className="fw-bold text-dark">{new Date(orderDetailModal.order.created_at).toLocaleString('es-ES')}</span>
                </div>
              </div>

              <h6 className="fw-bold text-dark mb-3">Muebles Adquiridos</h6>
              <div className="d-flex flex-column gap-2 mb-4">
                {(orderDetailModal.order.items || []).map(item => (
                  <div key={item.id} className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light border">
                    <div className="d-flex align-items-center gap-2">
                      <img src={item.furniture?.image_url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100'} alt={item.furniture?.name} className="rounded" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                      <div>
                        <p className="mb-0 fw-bold small text-dark">{item.furniture?.name || 'Mueble'}</p>
                        <small className="text-muted">{item.quantity} x ${parseFloat(item.price_at_purchase).toLocaleString('es-CO')}</small>
                      </div>
                    </div>
                    <span className="fw-bold text-gold">${(item.price_at_purchase * item.quantity).toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                <span className="h6 mb-0 fw-bold">Total Pagado:</span>
                <span className="h5 mb-0 fw-bold text-gold">${parseFloat(orderDetailModal.order.total_amount || 0).toLocaleString('es-CO')}</span>
              </div>
            </div>

            <div className="tracking-modal-footer text-end">
              <button className="btn btn-gold-solid btn-sm px-4" onClick={() => setOrderDetailModal({ isOpen: false, order: null })}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREAR / EDITAR MUEBLE
          ========================================================================= */}
      {productModal.isOpen && (
        <div className="tracking-modal-backdrop" onClick={() => setProductModal({ isOpen: false, isEdit: false, data: {} })}>
          <div className="tracking-modal-dialog" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="tracking-modal-header">
              <h4 className="modal-title-luxury mb-0">
                {productModal.isEdit ? 'Editar Mueble' : 'Crear Nuevo Mueble'}
              </h4>
              <button
                className="tracking-modal-close-btn"
                onClick={() => setProductModal({ isOpen: false, isEdit: false, data: {} })}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="tracking-modal-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Nombre del Mueble</label>
                    <input
                      type="text"
                      className="form-control"
                      value={productModal.data.name}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Categoría</label>
                    <select
                      className="form-select"
                      value={productModal.data.category}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, category: e.target.value } }))}
                      required
                    >
                      {categoriesList.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Precio ($ COP)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={productModal.data.price}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, price: e.target.value } }))}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Stock Inicial</label>
                    <input
                      type="number"
                      className="form-control"
                      value={productModal.data.stock}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, stock: parseInt(e.target.value, 10) } }))}
                      required
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Escala 3D (Factor)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={productModal.data.scale_factor}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, scale_factor: parseFloat(e.target.value) } }))}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Archivo Imagen (.png / .jpg)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ej: silla.png"
                      value={productModal.data.image_path}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, image_path: e.target.value } }))}
                    />
                  </div>

                  <div className="col-6">
                    <label className="form-label small fw-bold text-muted">Archivo Modelo 3D (.glb)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="ej: chair.glb"
                      value={productModal.data.model_3d_path}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, model_3d_path: e.target.value } }))}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted">Descripción del Producto</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={productModal.data.description}
                      onChange={(e) => setProductModal(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="tracking-modal-footer d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => setProductModal({ isOpen: false, isEdit: false, data: {} })}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-gold-solid btn-sm px-4">
                  {productModal.isEdit ? 'Guardar Cambios' : 'Crear Mueble'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
