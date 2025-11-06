/**
 * Định nghĩa các loại quan hệ gia đình mở rộng
 */
export const ExtendedRelationType = {
  // Quan hệ cơ bản
  FATHER: 'FATHER',
  MOTHER: 'MOTHER',
  SPOUSE: 'SPOUSE',
  DIVORCED: 'DIVORCED',
  ADOPTED: 'ADOPTED',
  CHILD: 'CHILD',
  SIBLING: 'SIBLING',

  // Quan hệ mở rộng - Họ nội
  GRANDFATHER_PATERNAL: 'GRANDFATHER_PATERNAL',
  GRANDMOTHER_PATERNAL: 'GRANDMOTHER_PATERNAL',
  UNCLE_PATERNAL: 'UNCLE_PATERNAL',
  AUNT_PATERNAL: 'AUNT_PATERNAL',
  COUSIN_PATERNAL: 'COUSIN_PATERNAL',

  // Quan hệ mở rộng - Họ ngoại
  GRANDFATHER_MATERNAL: 'GRANDFATHER_MATERNAL',
  GRANDMOTHER_MATERNAL: 'GRANDMOTHER_MATERNAL',
  UNCLE_MATERNAL: 'UNCLE_MATERNAL',
  AUNT_MATERNAL: 'AUNT_MATERNAL',
  COUSIN_MATERNAL: 'COUSIN_MATERNAL',

  // Quan hệ khác
  STEPFATHER: 'STEPFATHER',
  STEPMOTHER: 'STEPMOTHER',
  STEPCHILD: 'STEPCHILD',
  STEPSIBLING: 'STEPSIBLING',
  SPOUSE_PARENT: 'SPOUSE_PARENT', // Bố/mẹ vợ/chồng
  SPOUSE_SIBLING: 'SPOUSE_SIBLING', // Anh/chị/em vợ/chồng
  SPOUSE_SIBLING_SPOUSE: 'SPOUSE_SIBLING_SPOUSE', // Vợ/chồng của anh/chị/em vợ/chồng
};

/**
 * Map các quan hệ với tên hiển thị tiếng Việt
 */
export const RelationshipLabels = {
  [ExtendedRelationType.FATHER]: 'Bố',
  [ExtendedRelationType.MOTHER]: 'Mẹ',
  [ExtendedRelationType.SPOUSE]: 'Vợ/Chồng',
  [ExtendedRelationType.DIVORCED]: 'Đã ly hôn',
  [ExtendedRelationType.ADOPTED]: 'Con nuôi',
  [ExtendedRelationType.CHILD]: 'Con',
  [ExtendedRelationType.SIBLING]: 'Anh/Chị/Em',
  
  [ExtendedRelationType.GRANDFATHER_PATERNAL]: 'Ông nội',
  [ExtendedRelationType.GRANDMOTHER_PATERNAL]: 'Bà nội',
  [ExtendedRelationType.UNCLE_PATERNAL]: 'Bác/Chú',
  [ExtendedRelationType.AUNT_PATERNAL]: 'Bác gái/Thím',
  [ExtendedRelationType.COUSIN_PATERNAL]: 'Anh/Chị/Em họ nội',

  [ExtendedRelationType.GRANDFATHER_MATERNAL]: 'Ông ngoại',
  [ExtendedRelationType.GRANDMOTHER_MATERNAL]: 'Bà ngoại',
  [ExtendedRelationType.UNCLE_MATERNAL]: 'Cậu',
  [ExtendedRelationType.AUNT_MATERNAL]: 'Dì',
  [ExtendedRelationType.COUSIN_MATERNAL]: 'Anh/Chị/Em họ ngoại',

  [ExtendedRelationType.STEPFATHER]: 'Bố dượng',
  [ExtendedRelationType.STEPMOTHER]: 'Mẹ kế',
  [ExtendedRelationType.STEPCHILD]: 'Con riêng',
  [ExtendedRelationType.STEPSIBLING]: 'Anh/Chị/Em cùng cha khác mẹ/cùng mẹ khác cha',
  [ExtendedRelationType.SPOUSE_PARENT]: 'Bố/Mẹ vợ/chồng',
  [ExtendedRelationType.SPOUSE_SIBLING]: 'Anh/Chị/Em vợ/chồng',
  [ExtendedRelationType.SPOUSE_SIBLING_SPOUSE]: 'Vợ/Chồng của anh/chị/em vợ/chồng',
};

/**
 * Kiểm tra tính hợp lệ của một quan hệ dựa trên giới tính và các ràng buộc khác
 */
export function validateRelationship(fromMember, toMember, relationType) {
  const errors = [];

  // Kiểm tra giới tính cho quan hệ cha/mẹ
  if (relationType === ExtendedRelationType.FATHER && fromMember.gender !== 'male') {
    errors.push('Quan hệ Cha phải là giới tính Nam');
  }
  if (relationType === ExtendedRelationType.MOTHER && fromMember.gender !== 'female') {
    errors.push('Quan hệ Mẹ phải là giới tính Nữ');
  }

  // Kiểm tra tuổi cho quan hệ cha/mẹ-con
  if ([ExtendedRelationType.FATHER, ExtendedRelationType.MOTHER].includes(relationType)) {
    const parentBirth = new Date(fromMember.birthDate);
    const childBirth = new Date(toMember.birthDate);
    const yearDiff = childBirth.getFullYear() - parentBirth.getFullYear();
    
    if (yearDiff < 15) {
      errors.push('Cha/Mẹ phải lớn hơn con ít nhất 15 tuổi');
    }
  }

  // Kiểm tra quan hệ vợ/chồng
  if (relationType === ExtendedRelationType.SPOUSE) {
    if (fromMember.gender === toMember.gender) {
      errors.push('Quan hệ vợ/chồng phải là giữa hai người khác giới tính');
    }
    
    const birth1 = new Date(fromMember.birthDate);
    const birth2 = new Date(toMember.birthDate);
    const yearDiff = Math.abs(birth2.getFullYear() - birth1.getFullYear());
    
    if (yearDiff > 50) {
      errors.push('Chênh lệch tuổi giữa vợ và chồng không nên quá 50 năm');
    }
  }

  return errors;
}

/**
 * Tính toán các quan hệ phức tạp dựa trên các quan hệ cơ bản
 */
export function deriveComplexRelationships(relationships, memberId) {
  const derived = new Map();
  
  // Tìm cha mẹ
  const parents = relationships
    .filter(r => (r.type === ExtendedRelationType.FATHER || r.type === ExtendedRelationType.MOTHER) 
           && r.to === memberId)
    .map(r => r.from);

  // Tìm ông bà nội
  parents.forEach(parentId => {
    relationships
      .filter(r => (r.type === ExtendedRelationType.FATHER || r.type === ExtendedRelationType.MOTHER) 
             && r.to === parentId)
      .forEach(r => {
        const parentGender = r.type === ExtendedRelationType.FATHER ? 'male' : 'female';
        derived.set(r.from, parentGender === 'male' 
          ? ExtendedRelationType.GRANDFATHER_PATERNAL
          : ExtendedRelationType.GRANDMOTHER_PATERNAL
        );
      });
  });

  // TODO: Thêm logic để tính các quan hệ khác như:
  // - Ông bà ngoại
  // - Cô dì chú bác
  // - Anh chị em họ
  // - Quan hệ thông gia
  
  return derived;
}

/**
 * Tìm đường đi ngắn nhất giữa hai người để xác định quan hệ
 */
export function findRelationshipPath(relationships, fromId, toId) {
  // Implement thuật toán BFS để tìm đường đi
  const queue = [[fromId]];
  const visited = new Set([fromId]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    if (current === toId) {
      return path;
    }
    
    // Tìm tất cả các quan hệ trực tiếp từ node hiện tại
    relationships
      .filter(r => r.from === current || r.to === current)
      .forEach(r => {
        const next = r.from === current ? r.to : r.from;
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([...path, next]);
        }
      });
  }
  
  return null; // Không tìm thấy đường đi
}