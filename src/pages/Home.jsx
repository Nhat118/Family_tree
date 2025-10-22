import React from "react";
import { Link } from "react-router-dom";
import { TreePine, Users, Edit3, Search, Shield, Heart, ArrowRight, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section - Full Screen */}
      <section className="hero-section bg-gradient-primary text-white d-flex align-items-center min-vh-100">
        <div className="container-fluid px-0">
          <div className="row g-0 min-vh-100">
            <div className="col-lg-6 d-flex align-items-center">
              <div className="hero-content px-4 px-lg-5 py-5">
                <div className="hero-badge mb-4">
                  <span className="badge bg-white text-primary px-3 py-2 rounded-pill">
                    <Star size={14} className="me-1" />
                    Ứng dụng gia phả số 1 Việt Nam
                  </span>
                </div>
                <h1 className="display-2 fw-bold mb-4 lh-1">
                  🌳 Cây Gia Phả
                  <br />
                  <span className="text-warning">Thông Minh</span>
                </h1>
                <p className="lead mb-5 fs-5 lh-lg">
                  Hệ thống quản lý gia phả thông minh, giúp bạn lưu trữ, quản lý và trực quan hóa 
                  dòng họ một cách dễ dàng và chuyên nghiệp. Kết nối các thế hệ, bảo tồn di sản gia đình.
                </p>
                <div className="d-flex flex-wrap gap-3 mb-5">
                  <Link to="/tree" className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-lg">
                    <TreePine size={22} className="me-2" />
                    Khám phá ngay
                    <ArrowRight size={18} className="ms-2" />
                  </Link>
                  <Link to="/register" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill border-2">
                    <Users size={22} className="me-2" />
                    Đăng ký miễn phí
                  </Link>
                </div>
                <div className="d-flex align-items-center text-light mb-4">
                  <div className="d-flex me-4">
                    <Star size={18} className="me-1 text-warning" />
                    <Star size={18} className="me-1 text-warning" />
                    <Star size={18} className="me-1 text-warning" />
                    <Star size={18} className="me-1 text-warning" />
                    <Star size={18} className="me-2 text-warning" />
                  </div>
                  <span className="fw-semibold">4.9/5 từ 10,000+ người dùng</span>
                </div>
                <div className="row g-4 text-center">
                  <div className="col-4">
                    <div className="h3 fw-bold text-warning mb-1">1000+</div>
                    <div className="small">Gia phả</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 fw-bold text-warning mb-1">5000+</div>
                    <div className="small">Thành viên</div>
                  </div>
                  <div className="col-4">
                    <div className="h3 fw-bold text-warning mb-1">99%</div>
                    <div className="small">Hài lòng</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-center bg-white bg-opacity-10">
              <div className="hero-image text-center p-5">
                <div className="family-tree-demo bg-white rounded-5 shadow-xl p-5 position-relative">
                  <div className="demo-title mb-4">
                    <h4 className="h5 fw-bold text-primary mb-2">Sơ đồ gia phả trực quan</h4>
                    <p className="text-muted small">Xem trước giao diện quản lý</p>
                  </div>
                  
                  {/* Demo Family Tree */}
                  <div className="demo-tree">
                    {/* Grandparents */}
                    <div className="d-flex justify-content-center mb-3">
                      <div className="person-demo bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-4" style={{width: '50px', height: '50px'}}>
                        <Users size={20} />
                      </div>
                      <div className="person-demo bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                        <Heart size={20} />
                      </div>
                    </div>
                    
                    {/* Connection line */}
                    <div className="d-flex justify-content-center mb-3">
                      <div className="demo-line"></div>
                    </div>
                    
                    {/* Parents */}
                    <div className="d-flex justify-content-center mb-3">
                      <div className="person-demo bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-4" style={{width: '45px', height: '45px'}}>
                        <Users size={18} />
                      </div>
                      <div className="person-demo bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '45px', height: '45px'}}>
                        <Heart size={18} />
                      </div>
                    </div>
                    
                    {/* Connection line */}
                    <div className="d-flex justify-content-center mb-3">
                      <div className="demo-line"></div>
                    </div>
                    
                    {/* Children */}
                    <div className="d-flex justify-content-center">
                      <div className="person-demo bg-danger text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                        <Users size={14} />
                      </div>
                      <div className="person-demo bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: '35px', height: '35px'}}>
                        <Users size={14} />
                      </div>
                      <div className="person-demo bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '35px', height: '35px'}}>
                        <Users size={14} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="demo-features mt-4">
                    <div className="d-flex justify-content-center gap-3">
                      <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
                        <TreePine size={12} className="me-1" />
                        Sơ đồ
                      </span>
                      <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                        <Users size={12} className="me-1" />
                        Thành viên
                      </span>
                      <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">
                        <Edit3 size={12} className="me-1" />
                        Chỉnh sửa
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <div className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill mb-3">
              Tính năng
            </div>
            <h2 className="display-5 fw-bold mb-3">Tính năng nổi bật</h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: '600px'}}>
              Những công cụ mạnh mẽ và thông minh giúp bạn quản lý gia phả một cách hiệu quả và chuyên nghiệp
            </p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="feature-card h-100 text-center p-4 rounded-4 border shadow-sm">
                <div className="feature-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <TreePine size={24} />
                </div>
                <h4 className="h5 fw-semibold mb-3">Sơ đồ trực quan</h4>
                <p className="text-muted mb-0">
                  Hiển thị gia phả dưới dạng cây phả hệ trực quan, dễ dàng theo dõi mối quan hệ giữa các thành viên.
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="feature-card h-100 text-center p-4 rounded-4 border shadow-sm">
                <div className="feature-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Users size={24} />
                </div>
                <h4 className="h5 fw-semibold mb-3">Quản lý thành viên</h4>
                <p className="text-muted mb-0">
                  Thêm, sửa, xóa thông tin thành viên một cách dễ dàng với giao diện thân thiện.
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="feature-card h-100 text-center p-4 rounded-4 border shadow-sm">
                <div className="feature-icon bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Edit3 size={24} />
                </div>
                <h4 className="h5 fw-semibold mb-3">Chỉnh sửa linh hoạt</h4>
                <p className="text-muted mb-0">
                  Cập nhật thông tin gia phả và quan hệ giữa các thành viên một cách nhanh chóng.
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="feature-card h-100 text-center p-4 rounded-4 border shadow-sm">
                <div className="feature-icon bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Search size={24} />
                </div>
                <h4 className="h5 fw-semibold mb-3">Tìm kiếm thông minh</h4>
                <p className="text-muted mb-0">
                  Tìm kiếm nhanh chóng thành viên và thông tin gia phả với công cụ tìm kiếm mạnh mẽ.
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="feature-card h-100 text-center p-4 rounded-4 border shadow-sm">
                <div className="feature-icon bg-danger text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Shield size={24} />
                </div>
                <h4 className="h5 fw-semibold mb-3">Bảo mật cao</h4>
                <p className="text-muted mb-0">
                  Dữ liệu gia phả được bảo vệ an toàn với hệ thống xác thực và phân quyền.
                </p>
              </div>
            </div>
            
            <div className="col-md-6 col-lg-4">
              <div className="feature-card h-100 text-center p-4 rounded-4 border shadow-sm">
                <div className="feature-icon bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '60px', height: '60px'}}>
                  <Heart size={24} />
                </div>
                <h4 className="h5 fw-semibold mb-3">Dễ sử dụng</h4>
                <p className="text-muted mb-0">
                  Giao diện thân thiện, dễ sử dụng cho mọi lứa tuổi, không cần kiến thức kỹ thuật.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-10">
              <div className="cta-content p-5 rounded-5" style={{background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)'}}>
                <div className="badge bg-success-subtle text-success px-3 py-2 rounded-pill mb-3">
                  Bắt đầu ngay
                </div>
                <h2 className="display-5 fw-bold mb-4">Xây dựng gia phả của bạn ngay hôm nay</h2>
                <p className="lead text-muted mb-5 mx-auto" style={{maxWidth: '700px'}}>
                  Hãy để chúng tôi giúp bạn lưu giữ và truyền lại những câu chuyện quý giá của gia đình 
                  cho các thế hệ mai sau. Bắt đầu hành trình kết nối gia đình ngay bây giờ.
                </p>
                <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
                  <Link to="/register" className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg">
                    <Users size={22} className="me-2" />
                    Tạo tài khoản miễn phí
                    <ArrowRight size={18} className="ms-2" />
                  </Link>
                  <Link to="/tree" className="btn btn-outline-primary btn-lg px-5 py-3 rounded-pill border-2">
                    <TreePine size={22} className="me-2" />
                    Xem demo ngay
                  </Link>
                </div>
                <div className="text-muted small">
                  <Shield size={16} className="me-1" />
                  Miễn phí 100% • Không cần thẻ tín dụng • Dễ sử dụng
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-5 bg-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item p-4 rounded-4" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
                <div className="display-6 fw-bold mb-2">1000+</div>
                <div className="fw-semibold">Gia phả</div>
                <div className="small opacity-75">Đã tạo</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item p-4 rounded-4" style={{background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', color: 'white'}}>
                <div className="display-6 fw-bold mb-2">5000+</div>
                <div className="fw-semibold">Thành viên</div>
                <div className="small opacity-75">Đã đăng ký</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item p-4 rounded-4" style={{background: 'linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%)', color: 'white'}}>
                <div className="display-6 fw-bold mb-2">99%</div>
                <div className="fw-semibold">Hài lòng</div>
                <div className="small opacity-75">Người dùng</div>
              </div>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stat-item p-4 rounded-4" style={{background: 'linear-gradient(135deg, #ffc107 0%, #fd7e14 100%)', color: 'white'}}>
                <div className="display-6 fw-bold mb-2">24/7</div>
                <div className="fw-semibold">Hỗ trợ</div>
                <div className="small opacity-75">Mọi lúc</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
