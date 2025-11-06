/**
 * @typedef {Object} LifeEvent
 * @property {string} id - Unique identifier
 * @property {string} date - Date of the event
 * @property {string} type - Type of event (e.g., 'birth', 'death', 'marriage', 'career', 'education', 'other')
 * @property {string} description - Description of the event
 * @property {string} [location] - Location of the event
 * @property {string[]} [media] - Array of media URLs related to the event
 */

/**
 * @typedef {Object} Member
 * @property {number} id - Unique identifier
 * @property {string} name - Full name
 * @property {string} gender - Gender ('male' or 'female')
 * @property {string} birthDate - Date of birth
 * @property {string} [deathDate] - Date of death
 * @property {string} [birthPlace] - Place of birth
 * @property {string} [deathPlace] - Place of death
 * @property {string} [occupation] - Primary occupation
 * @property {string} [education] - Educational background
 * @property {string} [bio] - Short biography
 * @property {string} [avatarUrl] - URL to avatar image
 * @property {string[]} [photos] - Array of photo URLs
 * @property {string[]} [documents] - Array of document URLs
 * @property {LifeEvent[]} [lifeEvents] - Array of life events
 * @property {Object} [metadata] - Additional metadata
 * @property {string} [metadata.nationality]
 * @property {string} [metadata.religion]
 * @property {string[]} [metadata.aliases] - Other names/nicknames
 * @property {Object} [metadata.contact] - Contact information
 */

/**
 * Default values for a new member
 * @type {Member}
 */
export const DEFAULT_MEMBER = {
  id: 0,
  name: '',
  gender: '',
  birthDate: '',
  deathDate: '',
  birthPlace: '',
  deathPlace: '',
  occupation: '',
  education: '',
  bio: '',
  avatarUrl: '',
  photos: [],
  documents: [],
  lifeEvents: [],
  metadata: {
    nationality: '',
    religion: '',
    aliases: [],
    contact: {}
  }
};

/**
 * @type {Object.<string, string>}
 */
export const EVENT_TYPES = {
  BIRTH: 'birth',
  DEATH: 'death',
  MARRIAGE: 'marriage',
  DIVORCE: 'divorce',
  CAREER: 'career',
  EDUCATION: 'education',
  ACHIEVEMENT: 'achievement',
  RESIDENCE: 'residence',
  OTHER: 'other'
};

/**
 * Validates a member object
 * @param {Member} member - Member to validate
 * @returns {string[]} Array of error messages, empty if valid
 */
export function validateMember(member) {
  const errors = [];
  
  if (!member.name?.trim()) {
    errors.push('Tên không được để trống');
  }
  
  if (!member.gender) {
    errors.push('Giới tính không được để trống');
  }
  
  if (!member.birthDate) {
    errors.push('Ngày sinh không được để trống');
  }
  
  // If death date exists, it must be after birth date
  if (member.deathDate && new Date(member.deathDate) <= new Date(member.birthDate)) {
    errors.push('Ngày mất phải sau ngày sinh');
  }
  
  return errors;
}