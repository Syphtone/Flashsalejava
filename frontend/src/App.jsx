import { useState } from "react";
import "./App.css";

const pad = (value) => String(value).padStart(2, "0");

function toDateTimeLocal(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function getSaleStatus(startTime, endTime) {
  const now = new Date();
  if (now < new Date(startTime)) return "Scheduled";
  if (now < new Date(endTime)) return "Active";
  return "Ended";
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function App() {
  const now = new Date();
  const activeStart = new Date(now.getTime() - 60 * 60 * 1000);
  const activeEnd = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStart = new Date(tomorrow);
  tomorrowStart.setHours(10, 0, 0, 0);
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 8 * 60 * 60 * 1000);

  const [showForm, setShowForm] = useState(false);
  const [sales, setSales] = useState([
    { id: 1, name: "Sony Headphones", price: 2999, stock: 50, startTime: toDateTimeLocal(activeStart), endTime: toDateTimeLocal(activeEnd) },
    { id: 2, name: "Smart Watch", price: 1999, stock: 25, startTime: toDateTimeLocal(tomorrowStart), endTime: toDateTimeLocal(tomorrowEnd) },
    { id: 3, name: "Wireless Speaker", price: 1499, stock: 40, startTime: "2026-10-12T10:00", endTime: "2026-10-12T18:00" },
  ]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", startTime: "", endTime: "" });
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [userCount, setUserCount] = useState("100");
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulationError, setSimulationError] = useState("");

  const activeSales = sales.filter((sale) => getSaleStatus(sale.startTime, sale.endTime) === "Active").length;

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setFormError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const start = new Date(form.startTime);
    const end = new Date(form.endTime);
    const name = form.name.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!name) return setFormError("Enter a product name.");
    if (!Number.isFinite(price) || price <= 0) return setFormError("Price must be greater than zero.");
    if (!Number.isInteger(stock) || stock < 1) return setFormError("Stock must be a whole number greater than zero.");
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return setFormError("Enter valid start and end times.");
    if (end <= start) return setFormError("Sale end time must be after the start time.");

    setSales((previous) => [...previous, { id: Date.now(), name, price, stock, startTime: form.startTime, endTime: form.endTime }]);
    setForm({ name: "", price: "", stock: "", startTime: "", endTime: "" });
    setFormError("");
    setShowForm(false);
    setNotice(`${name} was added to your sale schedule.`);
  }

  function runDemoSimulation() {
    setSimulationError("");
    setSimulationResult(null);
    const users = Number(userCount);
    if (!selectedProduct) return setSimulationError("Choose a sale to run the demo.");
    if (!Number.isInteger(users) || users < 1 || users > 10000) return setSimulationError("Enter a whole number between 1 and 10,000.");

    const product = sales.find((sale) => String(sale.id) === selectedProduct);
    if (!product) return setSimulationError("That sale could not be found.");
    const status = getSaleStatus(product.startTime, product.endTime);
    if (status !== "Active") return setSimulationError(`This sale is ${status.toLowerCase()}. Choose an active sale for the demo.`);

    const successfulOrders = Math.min(users, product.stock);
    setSimulationResult({
      totalRequests: users,
      successfulOrders,
      failedRequests: users - successfulOrders,
      initialStock: product.stock,
      finalStock: product.stock - successfulOrders,
    });
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="FlashSale dashboard home">
          <span className="brand-mark" aria-hidden="true">F</span><span>flash<span className="brand-accent">sale</span></span>
        </a>
        <p className="sidebar-label">WORKSPACE</p>
        <nav className="navigation" aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><span aria-hidden="true">◫</span>Overview</a>
          <a className="nav-item" href="#sales"><span aria-hidden="true">▣</span>Flash sales</a>
          <a className="nav-item" href="#simulator"><span aria-hidden="true">⌁</span>Simulator <span className="nav-tag">DEMO</span></a>
        </nav>
        <div className="sidebar-bottom"><span className="online-dot" />Local preview<br /><small>Dashboard data is stored in this session</small></div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div><p className="eyebrow">FLASHSALE / ADMIN</p><h1>Dashboard overview</h1><p className="muted">A clear view of your sale schedule and inventory.</p></div>
          <div className="account"><span className="avatar">A</span><span><strong>Admin</strong><small>Administrator</small></span><span className="account-caret" aria-hidden="true">⌄</span></div>
        </header>

        {notice && <div className="notice" role="status"><span aria-hidden="true">✓</span>{notice}<button type="button" aria-label="Dismiss notice" onClick={() => setNotice("")}>×</button></div>}

        <section className="stats" aria-label="Dashboard summary">
          <article className="stat-card"><div className="stat-top"><span>Total products</span><span className="stat-icon purple">▣</span></div><strong className="stat-value">{sales.length}</strong><span className="stat-foot">Across your sale schedule</span></article>
          <article className="stat-card"><div className="stat-top"><span>Active flash sales</span><span className="stat-icon green">↗</span></div><strong className="stat-value">{activeSales}</strong><span className="stat-foot"><i className="online-dot" /> Live right now</span></article>
          <article className="stat-card"><div className="stat-top"><span>Total orders</span><span className="stat-icon amber">▤</span></div><strong className="stat-value">—</strong><span className="stat-foot">Order data is not connected</span></article>
        </section>

        <section className="panel" id="sales">
          <div className="panel-heading"><div><p className="eyebrow">INVENTORY</p><h2>Flash sales</h2><p className="muted">Manage products and review their sale windows.</p></div>
            <button className="primary-button" type="button" onClick={() => { setShowForm((value) => !value); setFormError(""); }}>{showForm ? "Close form" : <><span aria-hidden="true">＋</span> Create sale</>}</button>
          </div>
          {showForm && <form className="sale-form" onSubmit={handleSubmit}>
            <div className="form-heading"><div><h3>New flash sale</h3><p className="muted">Add a product and set its sale window.</p></div></div>
            <label className="field full-field">Product name<input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless earbuds" required /></label>
            <div className="form-grid">
              <label className="field">Sale price (₹)<input name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" required /></label>
              <label className="field">Stock quantity<input name="stock" type="number" min="1" step="1" value={form.stock} onChange={handleChange} placeholder="0" required /></label>
              <label className="field">Starts<input name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required /></label>
              <label className="field">Ends<input name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required /></label>
            </div>
            {formError && <p className="error-message" role="alert">{formError}</p>}
            <div className="form-actions"><button className="secondary-button" type="button" onClick={() => { setShowForm(false); setFormError(""); }}>Cancel</button><button className="primary-button" type="submit">Save sale</button></div>
          </form>}
          <div className="sale-table-head"><span>PRODUCT</span><span>PRICE</span><span>STOCK</span><span>SALE WINDOW</span><span>STATUS</span></div>
          <div className="sale-list">{sales.map((sale) => {
            const status = getSaleStatus(sale.startTime, sale.endTime);
            return <article className="sale-row" key={sale.id}>
              <div className="product-cell"><span className="product-thumb" aria-hidden="true">{sale.name.slice(0, 1).toUpperCase()}</span><span><strong>{sale.name}</strong><small>Product #{sale.id}</small></span></div>
              <span className="mobile-label">Price <strong>{formatPrice(sale.price)}</strong></span>
              <span className="mobile-label">Stock <strong>{sale.stock} units</strong></span>
              <span className="sale-window"><strong>{formatDateTime(sale.startTime)}</strong><small>to {formatDateTime(sale.endTime)}</small></span>
              <span><i className={`status ${status.toLowerCase()}`}><b />{status}</i></span>
            </article>;
          })}</div>
          {!sales.length && <div className="empty-state"><span aria-hidden="true">▣</span><h3>No sales yet</h3><p className="muted">Create your first flash sale to get started.</p></div>}
          <div className="panel-footer">Showing {sales.length} {sales.length === 1 ? "sale" : "sales"}<span>Updates are saved for this session only</span></div>
        </section>

        <section className="panel simulator-panel" id="simulator">
          <div className="panel-heading"><div><p className="eyebrow">SANDBOX TOOL</p><h2>Concurrency simulator <span className="demo-pill">DEMO ONLY</span></h2><p className="muted">Explore a simple stock calculation with simulated purchase attempts.</p></div><span className="simulator-mark" aria-hidden="true">⌁</span></div>
          <div className="demo-callout"><span aria-hidden="true">ⓘ</span><p><strong>Illustrative demo</strong><br />This calculation runs in your browser. It does not send concurrent requests or change sale inventory.</p></div>
          <div className="simulator-form">
            <label className="field">Active sale<select value={selectedProduct} onChange={(event) => { setSelectedProduct(event.target.value); setSimulationError(""); setSimulationResult(null); }}><option value="">Choose an active sale</option>{sales.map((sale) => <option key={sale.id} value={String(sale.id)}>{sale.name} · {sale.stock} in stock · {getSaleStatus(sale.startTime, sale.endTime)}</option>)}</select></label>
            <label className="field">Simulated users<input type="number" min="1" max="10000" step="1" value={userCount} onChange={(event) => { setUserCount(event.target.value); setSimulationError(""); setSimulationResult(null); }} /><small>Choose between 1 and 10,000 users</small></label>
          </div>
          <button className="primary-button" type="button" onClick={runDemoSimulation}>Run demo calculation <span aria-hidden="true">→</span></button>
          {simulationError && <p className="error-message" role="alert">{simulationError}</p>}
          {simulationResult && <div className="simulation-results" aria-live="polite"><div className="results-heading"><div><h3>Demo results</h3><p className="muted">Estimated from the selected sale's current stock.</p></div><span className="demo-pill">SIMULATED</span></div><div className="result-grid"><div><span>Total attempts</span><strong>{simulationResult.totalRequests.toLocaleString("en-IN")}</strong></div><div><span>Successful orders</span><strong>{simulationResult.successfulOrders.toLocaleString("en-IN")}</strong></div><div><span>Unfilled attempts</span><strong>{simulationResult.failedRequests.toLocaleString("en-IN")}</strong></div><div><span>Estimated remaining stock</span><strong>{simulationResult.finalStock.toLocaleString("en-IN")} <small>of {simulationResult.initialStock}</small></strong></div></div></div>}
        </section>
        <footer className="page-footer">FlashSale Admin <span>Local preview · Session data only</span></footer>
      </main>
    </div>
  );
}

export default App;
