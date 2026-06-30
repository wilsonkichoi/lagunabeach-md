#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗺️ LagunaBeach.md Map Marker Generation Script');

// Read geocode lookup table
const geocodeData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../src/data/laguna-beach-geocode.json'),
    'utf8',
  ),
);
const { neighborhoods, landmarks } = geocodeData;

// Parse frontmatter
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm = {};
  match[1].split('\n').forEach((line) => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      fm[key.trim()] = rest
        .join(':')
        .trim()
        .replace(/^["']|["']$/g, '');
    }
  });
  return fm;
}

// Infer category from filename (English)
function inferCategoryFromFilename(filename) {
  const f = filename.toLowerCase();
  if (f.includes('beach') || f.includes('cove') || f.includes('shore'))
    return 'beaches';
  if (f.includes('trail') || f.includes('hike') || f.includes('park'))
    return 'trails';
  if (f.includes('art') || f.includes('gallery') || f.includes('museum'))
    return 'art-galleries';
  if (f.includes('food') || f.includes('restaurant') || f.includes('dining'))
    return 'food';
  if (f.includes('history') || f.includes('founding') || f.includes('fire'))
    return 'history';
  if (f.includes('marine') || f.includes('tide') || f.includes('nature'))
    return 'nature-marine-life';
  if (f.includes('festival') || f.includes('pageant') || f.includes('event'))
    return 'events-festivals';
  if (
    f.includes('neighborhood') ||
    f.includes('village') ||
    f.includes('downtown')
  )
    return 'neighborhoods';
  return 'history';
}

/** Skip first-level language directories under knowledge/ to avoid treating ja/en as categories */
const KNOWLEDGE_LOCALE_DIRS = new Set(['en', 'ja', 'ko', 'zh-TW', 'es']);

function getArticleLang(filePath) {
  const knowledgeDir = path.join(__dirname, '../../knowledge');
  const rel = path.relative(knowledgeDir, filePath).replace(/\\/g, '/');
  const first = rel.split('/')[0];
  if (first === 'en') return 'en';
  if (first === 'ja') return 'ja';
  if (first === 'ko') return 'ko';
  if (first === 'zh-TW') return 'zh-TW';
  return 'en';
}

function buildArticleLink(filePath, category) {
  const lang = getArticleLang(filePath);
  const slug = encodeURIComponent(path.basename(filePath, '.md'));
  if (lang === 'en') return `/${category}/${slug}`;
  return `/${lang}/${category}/${slug}`;
}

// Derive category from path
function getCategoryFromPath(filePath) {
  const pathParts = filePath.split(/[/\\]/);
  const categoryIndex = pathParts.findIndex((part) => part === 'knowledge');

  if (categoryIndex !== -1 && categoryIndex + 1 < pathParts.length) {
    let i = categoryIndex + 1;
    if (
      i < pathParts.length &&
      KNOWLEDGE_LOCALE_DIRS.has(pathParts[i]) &&
      !pathParts[i].endsWith('.md')
    ) {
      i += 1;
    }
    if (i >= pathParts.length) {
      return inferCategoryFromFilename(path.basename(filePath, '.md'));
    }
    const category = pathParts[i];
    // If next part is a .md file (root-level document), not a category dir
    if (category.endsWith('.md')) {
      // Infer from frontmatter or filename
      return inferCategoryFromFilename(path.basename(filePath, '.md'));
    }
    const categoryMap = {
      History: 'history',
      'Art & Galleries': 'art-galleries',
      'Nature & Marine Life': 'nature-marine-life',
      Food: 'food',
      Beaches: 'beaches',
      Trails: 'trails',
      'Events & Festivals': 'events-festivals',
      Neighborhoods: 'neighborhoods',
    };
    return (
      categoryMap[category] || category.toLowerCase().replace(/[& ]+/g, '-')
    );
  }

  // Root-level files: infer from filename
  const filename = path.basename(filePath, '.md');
  return inferCategoryFromFilename(filename);
}

// Location matching and scoring
function matchLocations(title, content) {
  const matches = [];
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  // Prioritize landmark matches (precise locations)
  for (const [landmarkName, landmarkData] of Object.entries(landmarks)) {
    let score = 0;

    // Title match (highest score) — title containing landmark name is almost certainly relevant
    if (title.includes(landmarkName)) score += 100;

    // Content match — requires multiple mentions (1 might be incidental)
    const contentMatches = (content.match(new RegExp(landmarkName, 'g')) || [])
      .length;
    if (contentMatches >= 3) {
      score += contentMatches * 15;
    } else if (contentMatches >= 1) {
      score += contentMatches * 5; // low score for few mentions
    }

    // Threshold: title match or content appears at least 3 times
    if (score >= 45) {
      matches.push({
        name: landmarkName,
        type: 'landmark',
        score: score,
        ...landmarkData,
      });
    }
  }

  // Neighborhood matching (lower priority than landmarks)
  for (const [name, data] of Object.entries(neighborhoods)) {
    let score = 0;
    const pattern = new RegExp(
      name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
      'gi',
    );

    if (titleLower.includes(name.toLowerCase())) score += 50;
    const contentMatches = (content.match(pattern) || []).length;
    score += contentMatches * 10;

    if (score >= 30 && contentMatches >= 2) {
      matches.push({
        name,
        type: 'neighborhood',
        score,
        city: name,
        ...data,
      });
    }
  }

  // Sort by score, take top 3
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 3);
}

// Add jitter to avoid overlap
function addJitter(lat, lng, existingMarkers, city) {
  const sameLocationMarkers = existingMarkers.filter(
    (m) =>
      m.city === city &&
      Math.abs(m.lat - lat) < 0.02 &&
      Math.abs(m.lng - lng) < 0.02,
  );

  if (sameLocationMarkers.length === 0) {
    return { lat, lng };
  }

  // +/- 0.008 degrees random offset (~800m)
  const jitterRange = 0.008;
  const jitterLat = lat + (Math.random() - 0.5) * jitterRange * 2;
  const jitterLng = lng + (Math.random() - 0.5) * jitterRange * 2;

  return { lat: jitterLat, lng: jitterLng };
}

// Main function
function generateMarkers() {
  console.log('📂 Scanning knowledge/ directory...');

  // Recursively read all .md files
  function getAllMarkdownFiles(dir) {
    const files = [];

    function walkDirectory(currentDir) {
      const entries = fs.readdirSync(currentDir);

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Exclude special dirs (include en/ to generate English markers)
          if (!entry.startsWith('_') && entry !== 'about') {
            walkDirectory(fullPath);
          }
        } else if (
          stat.isFile() &&
          entry.endsWith('.md') &&
          !entry.startsWith('_')
        ) {
          files.push(fullPath);
        }
      }
    }

    walkDirectory(dir);
    return files;
  }

  const knowledgeDir = path.join(__dirname, '../../knowledge');
  const markdownFiles = getAllMarkdownFiles(knowledgeDir);

  console.log(`📄 Found ${markdownFiles.length} markdown files`);

  const markers = [];
  const processedCities = new Set(); // Avoid duplicate markers for same article in same city

  for (const filePath of markdownFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);

      const title = frontmatter.title || path.basename(filePath, '.md');
      const description = frontmatter.description || frontmatter.desc || '';
      const category = getCategoryFromPath(filePath);

      // Check for explicit geo field
      let locations = [];

      if (frontmatter.geo) {
        const geoData = frontmatter.geo.split(',');
        if (geoData.length >= 3) {
          locations.push({
            name: geoData[0].trim(),
            type: 'manual',
            lat: parseFloat(geoData[1]),
            lng: parseFloat(geoData[2]),
            // Optional 4th field: explicit neighborhood (overrides coord lookup).
            region: geoData[3] ? geoData[3].trim() : undefined,
            city: geoData[0].trim(),
            score: 1000,
          });
        } else if (geoData.length === 1) {
          const placeName = geoData[0].trim();
          if (neighborhoods[placeName]) {
            locations.push({
              name: placeName,
              type: 'manual',
              city: placeName,
              score: 1000,
              ...neighborhoods[placeName],
            });
          } else if (landmarks[placeName]) {
            locations.push({
              name: placeName,
              type: 'manual',
              city: placeName,
              score: 1000,
              ...landmarks[placeName],
            });
          }
        }
      }

      // If no explicit geo, auto-match
      if (locations.length === 0) {
        locations = matchLocations(title, content);
      }

      // If no location matched, skip this article (not placed on map)
      if (locations.length === 0) {
        continue;
      }

      // Generate marker for each matched location
      const articleCities = new Set();

      for (const location of locations) {
        // Avoid same article duplicating in same city
        if (articleCities.has(location.city)) continue;
        articleCities.add(location.city);

        const { lat: jitterLat, lng: jitterLng } = addJitter(
          location.lat,
          location.lng,
          markers,
          location.city,
        );

        let region =
          location.region || getNeighborhood(location.lat, location.lng);

        // Neighborhood from coordinates — the five curated Laguna areas the Map
        // page filters by. An explicit `geo` region (4th field) overrides this.
        function getNeighborhood(lat, lng) {
          // Victoria Beach sits within South Laguna's latitude band, so check first.
          if (
            lat >= 33.51 &&
            lat <= 33.518 &&
            lng >= -117.773 &&
            lng <= -117.765
          )
            return 'Victoria Beach';
          if (lat > 33.548 && lng < -117.775) return 'North Laguna';
          if (lat > 33.548 && lng >= -117.775) return 'Top of the World';
          if (lat < 33.515) return 'South Laguna';
          return 'The Village';
        }

        const marker = {
          title: title,
          lat: Number(jitterLat.toFixed(6)),
          lng: Number(jitterLng.toFixed(6)),
          category: category,
          region: region,
          link: buildArticleLink(filePath, category),
          lang: getArticleLang(filePath),
          desc: description,
          city: location.city,
        };

        markers.push(marker);

        // Take only the top-scoring location (avoid too many markers per article)
        break;
      }
    } catch (error) {
      console.error(`❌ Failed to process file: ${filePath}`, error.message);
    }
  }

  console.log(`✅ Generated ${markers.length} markers`);

  // Distribution stats
  const regionStats = {};
  const categoryStats = {};

  markers.forEach((marker) => {
    regionStats[marker.region] = (regionStats[marker.region] || 0) + 1;
    categoryStats[marker.category] = (categoryStats[marker.category] || 0) + 1;
  });

  console.log('\n📊 Region distribution:');
  Object.entries(regionStats).forEach(([region, count]) => {
    console.log(`  ${region}: ${count} markers`);
  });

  console.log('\n📈 Category distribution:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} markers`);
  });

  // Save to file
  const outputPath = path.join(__dirname, '../../src/data/map-markers.json');
  fs.writeFileSync(outputPath, JSON.stringify(markers, null, 2));

  console.log(`\n💾 Saved to: ${outputPath}`);
  console.log(`🎯 Total: ${markers.length} markers (target: 150+)`);

  return markers;
}

// Execute
generateMarkers();
