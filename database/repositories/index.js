// Repository Index - Central export for all data repositories
export { UserRepository } from './user.repository.js';
export { CoherenceRepository } from './coherence.repository.js';
export { GlyphRepository } from './glyph.repository.js';
export { CeremonyRepository } from './ceremony.repository.js';
export { MessageRepository } from './message.repository.js';

// Factory function to create all repositories
export function createRepositories() {
  return {
    users: new UserRepository(),
    coherence: new CoherenceRepository(),
    glyphs: new GlyphRepository(),
    ceremonies: new CeremonyRepository(),
    messages: new MessageRepository()
  };
}

// Export connection utilities
export { getConnection } from '../connection.js';