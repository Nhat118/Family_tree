import React, { useState, useEffect } from "react";
import { ExtendedRelationType, RelationshipLabels, validateRelationship } from "../types/Relationship";

export default function RelationshipEditor({ members = [], onSave, existingRelations = [] }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("");
  const [errors, setErrors] = useState([]);

  // Reset errors when selection changes
  useEffect(() => {
    setErrors([]);
  }, [from, to, type]);

  // Get member objects
  const fromMember = members.find(m => m.id.toString() === from);
  const toMember = members.find(m => m.id.toString() === to);

  // Filter available relationship types based on selection
  function getAvailableTypes() {
    if (!fromMember || !toMember) return [];

    // Get existing relations between these members
    const currentRelations = existingRelations.filter(
      r => (r.from === fromMember.id && r.to === toMember.id) ||
           (r.from === toMember.id && r.to === fromMember.id)
    );

    // Allow adding DIVORCED relation if there's an existing SPOUSE relation
    const hasSpouseRelation = currentRelations.some(r => r.type === ExtendedRelationType.SPOUSE);
    const hasDivorcedRelation = currentRelations.some(r => r.type === ExtendedRelationType.DIVORCED);
    
    // If already divorced or no marriage exists, can't add divorced relation
    if (type === ExtendedRelationType.DIVORCED && !hasSpouseRelation) {
      return [];
    }

    // If already has any relation except SPOUSE->DIVORCED transition
    if (currentRelations.length > 0 && !(hasSpouseRelation && !hasDivorcedRelation)) {
      return [];
    }

    // Get existing relations for both members to check limits
    const fromRelations = existingRelations.filter(r => r.from === fromMember.id || r.to === fromMember.id);
    const toRelations = existingRelations.filter(r => r.from === toMember.id || r.to === toMember.id);

    return Object.entries(ExtendedRelationType)
      .filter(([, value]) => {
        // Basic filtering based on gender and obvious rules
        if (value === ExtendedRelationType.FATHER && fromMember.gender !== 'male') return false;
        if (value === ExtendedRelationType.MOTHER && fromMember.gender !== 'female') return false;
        if (value === ExtendedRelationType.SPOUSE && fromMember.gender === toMember.gender) return false;
        
        // Check existing marriage relations
        const hasSpouse = (relations) => relations.some(
          r => r.type === ExtendedRelationType.SPOUSE && 
               !relations.some(dr => dr.type === ExtendedRelationType.DIVORCED)
        );
        
        // Can't marry if either person is already married
        if (value === ExtendedRelationType.SPOUSE && 
            (hasSpouse(fromRelations) || hasSpouse(toRelations))) {
          return false;
        }

        // Check parent count for adoption
        if (value === ExtendedRelationType.ADOPTED) {
          const parentCount = toRelations.filter(r => 
            (r.type === ExtendedRelationType.FATHER || 
             r.type === ExtendedRelationType.MOTHER ||
             r.type === ExtendedRelationType.ADOPTED) &&
            r.to === toMember.id
          ).length;
          if (parentCount >= 2) return false;
        }

        return true;
      })
      .map(([key, value]) => ({
        value,
        label: RelationshipLabels[value] || key
      }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!from || !to || !type) {
      setErrors(['Vui lòng điền đầy đủ thông tin']);
      return;
    }

    const fromId = Number(from);
    const toId = Number(to);

    try {
      // Special handling for DIVORCED relation
      if (type === ExtendedRelationType.DIVORCED) {
        const spouseRelation = existingRelations.find(
          r => r.type === ExtendedRelationType.SPOUSE &&
               ((r.from === fromId && r.to === toId) ||
                (r.from === toId && r.to === fromId))
        );

        if (!spouseRelation) {
          setErrors(['Không tìm thấy quan hệ vợ/chồng để ly hôn']);
          return;
        }

        // Add divorce relation and keep the spouse relation for history
        await onSave({
          from: fromId,
          to: toId,
          type: ExtendedRelationType.DIVORCED
        });
        return;

      } else if (type === ExtendedRelationType.ADOPTED) {
        // Check if the child already has parents
        const parentRelations = existingRelations.filter(
          r => (r.type === ExtendedRelationType.FATHER ||
                r.type === ExtendedRelationType.MOTHER ||
                r.type === ExtendedRelationType.ADOPTED) &&
               r.to === toId
        );

        if (parentRelations.length >= 2) {
          setErrors(['Người này đã có đủ hai người làm cha/mẹ']);
          return;
        }

        await onSave({
          from: fromId,
          to: toId,
          type: ExtendedRelationType.ADOPTED
        });
        return;
      }

      // For normal relationships
      await onSave({
        from: fromId,
        to: toId,
        type: type
      });
      
    } catch (error) {
      setErrors([error.message || 'Có lỗi xảy ra khi tạo quan hệ']);
    }
      setErrors(['Vui lòng chọn đầy đủ thông tin']);
      return;
    }

    // Validate the relationship
    const validationErrors = validateRelationship(fromMember, toMember, type);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({
      from: fromMember.id,
      to: toMember.id,
      type
    });

    // Reset form
    setFrom("");
    setTo("");
    setType("");
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded bg-white">
      <h4 className="h5 mb-3">Thiết lập mối quan hệ</h4>
      
      {errors.length > 0 && (
        <div className="alert alert-danger mb-3">
          <ul className="mb-0">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Thành viên 1</label>
          <select 
            className="form-select"
            value={from}
            onChange={e => setFrom(e.target.value)}
          >
            <option value="">Chọn thành viên...</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Mối quan hệ</label>
          <select
            className="form-select"
            value={type}
            onChange={e => setType(e.target.value)}
            disabled={!from || !to}
          >
            <option value="">Chọn quan hệ...</option>
            {getAvailableTypes().map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Thành viên 2</label>
          <select
            className="form-select"
            value={to}
            onChange={e => setTo(e.target.value)}
            disabled={!from}
          >
            <option value="">Chọn thành viên...</option>
            {members
              .filter(m => m.id.toString() !== from)
              .map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {fromMember && toMember && (
        <div className="mt-3 text-muted small">
          <strong>Xem trước:</strong>{" "}
          {fromMember.name} {type ? `là ${RelationshipLabels[type]?.toLowerCase() || type} của` : "→"} {toMember.name}
        </div>
      )}

      <div className="mt-3">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!from || !to || !type}
        >
          Lưu quan hệ
        </button>
      </div>
    </form>
  );
}
