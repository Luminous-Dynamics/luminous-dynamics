// User Repository - Sacred user data management
import { getConnection } from '../connection.js';

export class UserRepository {
  constructor() {
    this.connection = getConnection();
  }

  async create(userData) {
    const db = this.connection.getDb();
    
    const [user] = await db.create('user', {
      ...userData,
      created_at: new Date().toISOString(),
      coherence_baseline: userData.coherence_baseline || 0.5,
      total_practice_time: '0s',
      is_active: true
    });

    // Create associated profile
    if (user) {
      await db.create('user_profile', {
        user: user.id,
        bio: userData.bio || '',
        intention: userData.intention || '',
        sacred_geometry_preference: userData.geometry_preference || 'flower_of_life',
        privacy_settings: {
          profile_visible: true,
          coherence_visible: true,
          practice_history_visible: false
        }
      });
    }

    return user;
  }

  async findById(id) {
    const db = this.connection.getDb();
    const [user] = await db.select(`user:${id}`);
    
    if (user) {
      // Get associated profile
      const [profile] = await db.query(
        'SELECT * FROM user_profile WHERE user = $user',
        { user: user.id }
      );
      
      user.profile = profile;
    }
    
    return user;
  }

  async findByEmail(email) {
    const db = this.connection.getDb();
    const result = await db.query(
      'SELECT * FROM user WHERE email = $email',
      { email }
    );
    
    return result[0]?.[0];
  }

  async findBySacredName(sacredName) {
    const db = this.connection.getDb();
    const result = await db.query(
      'SELECT * FROM user WHERE sacred_name = $name',
      { name: sacredName }
    );
    
    return result[0]?.[0];
  }

  async update(id, updates) {
    const db = this.connection.getDb();
    
    const [updated] = await db.merge(`user:${id}`, {
      ...updates,
      updated_at: new Date().toISOString()
    });
    
    return updated;
  }

  async updateCoherenceBaseline(userId, coherence) {
    const db = this.connection.getDb();
    
    return this.update(userId, { coherence_baseline: coherence });
  }

  async incrementPracticeTime(userId, duration) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      `UPDATE user:${userId} SET 
        total_practice_time = total_practice_time + $duration,
        updated_at = time::now()`,
      { duration }
    );
    
    return result[0];
  }

  async updateLastSeen(userId) {
    const db = this.connection.getDb();
    
    return db.merge(`user:${userId}`, {
      last_seen: new Date().toISOString()
    });
  }

  async deactivate(userId) {
    return this.update(userId, { is_active: false });
  }

  async getActiveUsers(limit = 100) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT * FROM user WHERE is_active = true ORDER BY last_seen DESC LIMIT $limit',
      { limit }
    );
    
    return result[0] || [];
  }

  async searchBySacredName(searchTerm) {
    const db = this.connection.getDb();
    
    const result = await db.query(
      'SELECT * FROM user WHERE sacred_name ~ $search AND is_active = true',
      { search: searchTerm }
    );
    
    return result[0] || [];
  }

  async getUserStats(userId) {
    const db = this.connection.getDb();
    
    const stats = await db.query(`
      LET $user = user:${userId};
      LET $practices = (SELECT count() as total FROM glyph_practice WHERE user = $user GROUP ALL);
      LET $connections = (SELECT count() as total FROM network_connection WHERE from_user = $user OR to_user = $user GROUP ALL);
      LET $ceremonies = (SELECT count() as total FROM ceremony_participant WHERE user = $user GROUP ALL);
      
      RETURN {
        total_practices: $practices.total[0] OR 0,
        total_connections: $connections.total[0] OR 0,
        ceremonies_attended: $ceremonies.total[0] OR 0,
        current_coherence: fn::current_coherence($user)
      };
    `);
    
    return stats[0]?.[0];
  }
}

export default UserRepository;