import { Link, NavLink, Outlet } from 'react-router-dom';

function Layout() {
	return (
		<div className="app-container">
			<header>
				<nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom sticky-top">
					<div className="container">
						<Link to="/" className="navbar-brand">Cây Gia Phả</Link>
						<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
							<span className="navbar-toggler-icon"></span>
						</button>
						<div className="collapse navbar-collapse" id="navbarNav">
							<ul className="navbar-nav ms-auto">
								<li className="nav-item">
									<NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Trang chủ</NavLink>
								</li>
								<li className="nav-item">
									<NavLink to="/browse" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Khám phá</NavLink>
								</li>
								<li className="nav-item">
									<NavLink to="/my" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Cây của tôi</NavLink>
								</li>
								<li className="nav-item">
									<NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</header>

			<main className="app-main">
				<div className="container py-4">
					<Outlet />
				</div>
			</main>

			<footer className="border-top mt-auto">
				<div className="container py-3 d-flex justify-content-between small text-muted">
					<div>© {new Date().getFullYear()} Cây Gia Phả</div>
					<div>Xây dựng bằng React + Bootstrap</div>
				</div>
			</footer>
		</div>
	);

}

export default Layout;
