import React, { useState } from "react";
import { DEFAULT_MEMBER, EVENT_TYPES, validateMember } from "../types/Member";

export default function MemberForm({ initial = {}, onSave, onCancel }) {
  const [activeTab, setActiveTab] = useState('basic');
  const [form, setForm] = useState({
    ...DEFAULT_MEMBER,
    ...initial
  });
  const [errors, setErrors] = useState([]);

  function change(e) {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function changeMetadata(key, value) {
    setForm(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [key]: value
      }
    }));
  }

  function addLifeEvent() {
    const newEvent = {
      id: Date.now().toString(),
      date: '',
      type: EVENT_TYPES.OTHER,
      description: ''
    };
    setForm(prev => ({
      ...prev,
      lifeEvents: [...(prev.lifeEvents || []), newEvent]
    }));
  }

  function updateLifeEvent(id, updates) {
    setForm(prev => ({
      ...prev,
      lifeEvents: (prev.lifeEvents || []).map(event =>
        event.id === id ? { ...event, ...updates } : event
      )
    }));
  }

  function removeLifeEvent(id) {
    setForm(prev => ({
      ...prev,
      lifeEvents: (prev.lifeEvents || []).filter(event => event.id !== id)
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateMember(form);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} className="member-form">
      {/* Tabs */}
      <div className="nav nav-tabs mb-3">
        <button 
          type="button"
          className={`nav-link ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          Thông tin cơ bản
        </button>
        <button 
          type="button"
          className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Thông tin cá nhân
        </button>
        <button 
          type="button"
          className={`nav-link ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Sự kiện
        </button>
        <button 
          type="button"
          className={`nav-link ${activeTab === 'media' ? 'active' : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Hình ảnh & Tài liệu
        </button>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="alert alert-danger mb-3">
          <ul className="mb-0">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic Info Tab */}
      <div className={activeTab === 'basic' ? '' : 'd-none'}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Họ và tên <span className="text-danger">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={change}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Giới tính <span className="text-danger">*</span></label>
            <select
              name="gender"
              value={form.gender}
              onChange={change}
              className="form-select"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Ngày sinh <span className="text-danger">*</span></label>
            <input
              name="birthDate"
              value={form.birthDate}
              onChange={change}
              type="date"
              className="form-control"
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nơi sinh</label>
            <input
              name="birthPlace"
              value={form.birthPlace}
              onChange={change}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Ngày mất</label>
            <input
              name="deathDate"
              value={form.deathDate}
              onChange={change}
              type="date"
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Nơi mất</label>
            <input
              name="deathPlace"
              value={form.deathPlace}
              onChange={change}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Personal Info Tab */}
      <div className={activeTab === 'personal' ? '' : 'd-none'}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Nghề nghiệp</label>
            <input
              name="occupation"
              value={form.occupation}
              onChange={change}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Học vấn</label>
            <input
              name="education"
              value={form.education}
              onChange={change}
              className="form-control"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Tiểu sử</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={change}
              className="form-control"
              rows={4}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Quốc tịch</label>
            <input
              type="text"
              value={form.metadata.nationality}
              onChange={e => changeMetadata('nationality', e.target.value)}
              className="form-control"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Tôn giáo</label>
            <input
              type="text"
              value={form.metadata.religion}
              onChange={e => changeMetadata('religion', e.target.value)}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* Life Events Tab */}
      <div className={activeTab === 'events' ? '' : 'd-none'}>
        <div className="d-flex justify-content-end mb-3">
          <button type="button" className="btn btn-primary" onClick={addLifeEvent}>
            Thêm sự kiện
          </button>
        </div>
        {(form.lifeEvents || []).map((event, index) => (
          <div key={event.id} className="card mb-3">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Ngày</label>
                  <input
                    type="date"
                    value={event.date}
                    onChange={e => updateLifeEvent(event.id, { date: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Loại sự kiện</label>
                  <select
                    value={event.type}
                    onChange={e => updateLifeEvent(event.id, { type: e.target.value })}
                    className="form-select"
                  >
                    {Object.entries(EVENT_TYPES).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    value={event.description}
                    onChange={e => updateLifeEvent(event.id, { description: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeLifeEvent(event.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Media Tab */}
      <div className={activeTab === 'media' ? '' : 'd-none'}>
        <div className="row g-3">
          <div className="col-12">
            <label className="form-label">Ảnh đại diện URL</label>
            <input
              name="avatarUrl"
              value={form.avatarUrl}
              onChange={change}
              className="form-control"
              type="url"
            />
          </div>
          <div className="col-12">
            <label className="form-label">Thư viện ảnh</label>
            <div className="input-group">
              <input
                type="url"
                className="form-control"
                placeholder="Nhập URL ảnh"
                onKeyDown={e => {
                  if (e.key === 'Enter' && e.target.value) {
                    e.preventDefault();
                    setForm(prev => ({
                      ...prev,
                      photos: [...(prev.photos || []), e.target.value]
                    }));
                    e.target.value = '';
                  }
                }}
              />
            </div>
            <div className="mt-2 d-flex gap-2 flex-wrap">
              {(form.photos || []).map((url, index) => (
                <div key={index} className="position-relative" style={{ width: 100, height: 100 }}>
                  <img
                    src={url}
                    alt=""
                    className="img-thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        photos: prev.photos.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="d-flex gap-2 mt-4">
        <button type="submit" className="btn btn-primary">
          Lưu
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Hủy
          </button>
        )}
      </div>
      </form>
    );
}
