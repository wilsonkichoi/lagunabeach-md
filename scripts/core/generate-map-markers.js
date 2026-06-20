#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🗺️ LagunaBeach.md Map Marker Generation Script');

// 讀取 geocode 對照表
const geocodeData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../../src/data/laguna-beach-geocode.json'),
    'utf8',
  ),
);
const { neighborhoods, landmarks } = geocodeData;

// 解析 frontmatter
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

/** knowledge/ 底下第一層若為語系目錄則略過，避免把 ja/en 誤當分類 */
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

// 從路徑推導分類
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
    // 如果下一個 part 就是 .md 檔案（根目錄文件），不是分類目錄
    if (category.endsWith('.md')) {
      // 從 frontmatter 或檔名推測
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

// 地點匹配和評分
function matchLocations(title, content) {
  const matches = [];
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  // 優先匹配地標（精確位置）
  for (const [landmarkName, landmarkData] of Object.entries(landmarks)) {
    let score = 0;

    // 標題匹配 (最高分) — 標題含地標名幾乎確定相關
    if (title.includes(landmarkName)) score += 100;

    // 內容匹配 — 需要多次提及才算（1 次可能只是順帶提到）
    const contentMatches = (content.match(new RegExp(landmarkName, 'g')) || [])
      .length;
    if (contentMatches >= 3) {
      score += contentMatches * 15;
    } else if (contentMatches >= 1) {
      score += contentMatches * 5; // 少量提及低分
    }

    // 門檻：標題匹配或內容至少出現 3 次
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

  // 按分數排序，取前3個
  matches.sort((a, b) => b.score - a.score);
  return matches.slice(0, 3);
}

// 加入jitter避免重疊
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

  // ±0.008 度隨機偏移 (約800公尺)
  const jitterRange = 0.008;
  const jitterLat = lat + (Math.random() - 0.5) * jitterRange * 2;
  const jitterLng = lng + (Math.random() - 0.5) * jitterRange * 2;

  return { lat: jitterLat, lng: jitterLng };
}

// 主函數
function generateMarkers() {
  console.log('📂 掃描 knowledge/ 目錄...');

  // 遞迴讀取所有 .md 檔案
  function getAllMarkdownFiles(dir) {
    const files = [];

    function walkDirectory(currentDir) {
      const entries = fs.readdirSync(currentDir);

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // 排除特殊目錄（納入 en/ 以產生英文 markers）
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

  console.log(`📄 找到 ${markdownFiles.length} 個 markdown 檔案`);

  const markers = [];
  const processedCities = new Set(); // 避免同一篇文章在同城市重複marker

  for (const filePath of markdownFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);

      const title = frontmatter.title || path.basename(filePath, '.md');
      const description = frontmatter.description || frontmatter.desc || '';
      const category = getCategoryFromPath(filePath);

      // 檢查是否有明確的 geo 欄位
      let locations = [];

      if (frontmatter.geo) {
        const geoData = frontmatter.geo.split(',');
        if (geoData.length >= 3) {
          locations.push({
            name: geoData[0].trim(),
            type: 'manual',
            lat: parseFloat(geoData[1]),
            lng: parseFloat(geoData[2]),
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

      // 如果沒有明確geo，自動匹配
      if (locations.length === 0) {
        locations = matchLocations(title, content);
      }

      // 如果沒有匹配到任何地點，跳過此文章（不放在地圖上）
      if (locations.length === 0) {
        continue;
      }

      // 為每個匹配的地點生成marker
      const articleCities = new Set();

      for (const location of locations) {
        // 避免同一篇文章在同城市重複
        if (articleCities.has(location.city)) continue;
        articleCities.add(location.city);

        const { lat: jitterLat, lng: jitterLng } = addJitter(
          location.lat,
          location.lng,
          markers,
          location.city,
        );

        let region = getNeighborhood(location.lat, location.lng);

        function getNeighborhood(lat, lng) {
          if (lat > 33.548 && lng < -117.775) return 'North Laguna';
          if (lat > 33.548 && lng >= -117.775) return 'Top of the World';
          if (lat >= 33.535 && lat <= 33.548 && lng >= -117.775)
            return 'Laguna Canyon';
          if (lat >= 33.535 && lat <= 33.548 && lng < -117.775)
            return 'The Village';
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

        // 只取第一個最高分的地點（避免一篇文章太多marker）
        break;
      }
    } catch (error) {
      console.error(`❌ 處理檔案失敗: ${filePath}`, error.message);
    }
  }

  console.log(`✅ 生成 ${markers.length} 個 markers`);

  // 統計分布
  const regionStats = {};
  const categoryStats = {};

  markers.forEach((marker) => {
    regionStats[marker.region] = (regionStats[marker.region] || 0) + 1;
    categoryStats[marker.category] = (categoryStats[marker.category] || 0) + 1;
  });

  console.log('\n📊 區域分布:');
  Object.entries(regionStats).forEach(([region, count]) => {
    console.log(`  ${region}: ${count} markers`);
  });

  console.log('\n📈 分類分布:');
  Object.entries(categoryStats).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} markers`);
  });

  // 保存到檔案
  const outputPath = path.join(__dirname, '../../src/data/map-markers.json');
  fs.writeFileSync(outputPath, JSON.stringify(markers, null, 2));

  console.log(`\n💾 已保存到: ${outputPath}`);
  console.log(`🎯 總計: ${markers.length} markers (目標: 150+)`);

  return markers;
}

// 執行
generateMarkers();
