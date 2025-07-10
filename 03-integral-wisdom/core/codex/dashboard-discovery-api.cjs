#!/usr/bin/env node

/**
 * Dashboard Discovery API
 * Automatically discovers and catalogs all dashboard interfaces
 */

const fs = require('fs').promises;
const path = require('path');

class DashboardDiscovery {
  constructor() {
    this.dashboards = new Map();
    this.searchPaths = [
      'src/automation',
      'the-weave/interfaces/web',
      'web',
      '.'
    ];
    
    this.dashboardPatterns = [
      /dashboard.*\.html$/i,
      /.*-hub\.html$/i,
      /.*-demo\.html$/i,
      /.*-interface\.html$/i
    ];
  }

  /**
   * Scan for dashboard files
   */
  async scan() {
    this.dashboards.clear();
    
    for (const searchPath of this.searchPaths) {
      try {
        await this.scanDirectory(searchPath);
      } catch (error) {
        // Directory might not exist
      }
    }
    
    return this.getDashboards();
  }

  /**
   * Recursively scan a directory
   */
  async scanDirectory(dir, depth = 0) {
    if (depth > 3) return; // Limit recursion depth
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await this.scanDirectory(fullPath, depth + 1);
        } else if (entry.isFile() && this.isDashboard(entry.name)) {
          await this.analyzeDashboard(fullPath);
        }
      }
    } catch (error) {
      // Skip inaccessible directories
    }
  }

  /**
   * Check if file is a dashboard
   */
  isDashboard(filename) {
    return this.dashboardPatterns.some(pattern => pattern.test(filename));
  }

  /**
   * Extract metadata from dashboard HTML
   */
  async analyzeDashboard(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const metadata = this.extractMetadata(content, filePath);
      
      if (metadata) {
        const relativePath = path.relative('.', filePath);
        this.dashboards.set(relativePath, metadata);
      }
    } catch (error) {
      console.error(`Error analyzing ${filePath}:`, error.message);
    }
  }

  /**
   * Extract dashboard metadata from HTML
   */
  extractMetadata(html, filePath) {
    const metadata = {
      path: filePath,
      webPath: '/' + path.relative('.', filePath).replace(/\\/g, '/'),
      title: 'Unknown Dashboard',
      description: 'No description available',
      status: 'unknown',
      icon: '📊',
      category: 'other',
      lastModified: null
    };

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      metadata.title = titleMatch[1].trim();
    }

    // Extract description from meta tag or first paragraph
    const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    if (metaMatch) {
      metadata.description = metaMatch[1];
    } else {
      const pMatch = html.match(/<p[^>]*>([^<]{20,200})/i);
      if (pMatch) {
        metadata.description = pMatch[1].trim();
      }
    }

    // Determine status based on content
    if (html.includes('deprecated') || html.includes('legacy')) {
      metadata.status = 'deprecated';
    } else if (html.includes('beta') || html.includes('experimental')) {
      metadata.status = 'beta';
    } else if (html.includes('active') || html.includes('real-time')) {
      metadata.status = 'active';
    }

    // Determine category and icon
    const filename = path.basename(filePath).toLowerCase();
    if (filename.includes('sacred')) {
      metadata.category = 'sacred';
      metadata.icon = '✨';
    } else if (filename.includes('council')) {
      metadata.category = 'council';
      metadata.icon = '🏛️';
    } else if (filename.includes('demo')) {
      metadata.category = 'demo';
      metadata.icon = '🎭';
    } else if (filename.includes('interview')) {
      metadata.category = 'interview';
      metadata.icon = '🎤';
    } else if (filename.includes('guild')) {
      metadata.category = 'guild';
      metadata.icon = '⚔️';
    } else if (filename.includes('real-time') || filename.includes('monitor')) {
      metadata.category = 'monitoring';
      metadata.icon = '📊';
    } else if (filename.includes('hub')) {
      metadata.category = 'hub';
      metadata.icon = '🌐';
    }

    return metadata;
  }

  /**
   * Get discovered dashboards organized by category
   */
  getDashboards() {
    const byCategory = {};
    
    for (const [path, metadata] of this.dashboards) {
      if (!byCategory[metadata.category]) {
        byCategory[metadata.category] = [];
      }
      byCategory[metadata.category].push(metadata);
    }
    
    // Sort each category by status (active first) then by title
    for (const category of Object.keys(byCategory)) {
      byCategory[category].sort((a, b) => {
        const statusOrder = { active: 0, beta: 1, unknown: 2, deprecated: 3 };
        const statusDiff = (statusOrder[a.status] || 2) - (statusOrder[b.status] || 2);
        if (statusDiff !== 0) return statusDiff;
        return a.title.localeCompare(b.title);
      });
    }
    
    return byCategory;
  }

  /**
   * Generate discovery API response
   */
  async generateAPIResponse() {
    await this.scan();
    return {
      timestamp: new Date().toISOString(),
      total: this.dashboards.size,
      dashboards: this.getDashboards()
    };
  }
}

// If called directly, output discovery results
if (require.main === module) {
  const discovery = new DashboardDiscovery();
  
  discovery.generateAPIResponse()
    .then(result => {
      console.log(JSON.stringify(result, null, 2));
    })
    .catch(error => {
      console.error('Discovery failed:', error);
      process.exit(1);
    });
}

module.exports = { DashboardDiscovery };