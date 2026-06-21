/**
 * data-client.js — /data Population Pyramid client-side rendering.
 *
 * Originally extracted from data.template.astro (2026-06-13) as an
 * Astro-processed module so every language page shares one hashed,
 * cacheable bundle. Language is read from <html lang> (langIsEn shim).
 *
 * LagunaBeach.md migration: the Taiwan time-series (2000/2010/2025/2050)
 * is replaced by a geography comparison — Laguna Beach vs. Orange County
 * vs. California — from the U.S. Census Bureau American Community Survey
 * (table B01001, Sex by Age), aggregated into 5-year bands. The slider
 * toggles geography; each pyramid auto-scales to its own largest band so
 * the shapes are comparable despite very different population totals.
 */
const lang = document.documentElement.getAttribute('lang') || 'en';

// Population by sex and 5-year age band (U.S. Census Bureau, ACS B01001).
const populationData = {
  lagunaBeach: {
    male: [
      306, 463, 636, 587, 342, 392, 666, 741, 514, 424, 1047, 908, 1197, 922,
      1029, 908, 375, 180,
    ],
    female: [
      428, 410, 440, 470, 297, 387, 481, 622, 723, 815, 742, 860, 981, 1198,
      971, 673, 279, 296,
    ],
    totalPop: 22710,
    medianAge: 53.9,
    elderlyRatio: 30.1,
    youthRatio: 15.2,
  },
  orangeCounty: {
    male: [
      80434, 85714, 101237, 106073, 100382, 107142, 116131, 102636, 111763,
      97341, 104766, 103178, 102421, 84752, 62931, 48584, 26343, 27047,
    ],
    female: [
      74945, 81246, 95751, 102814, 100193, 106032, 112175, 104291, 106489,
      99800, 108326, 105214, 103717, 87808, 76382, 55498, 40019, 40860,
    ],
    totalPop: 3170435,
    medianAge: 38.5,
    elderlyRatio: 17.4,
    youthRatio: 20.3,
  },
  california: {
    male: [
      1061708, 1159051, 1279071, 1350715, 1320991, 1377449, 1537122, 1470860,
      1402460, 1224094, 1214417, 1156579, 1166240, 985928, 785673, 570969,
      331708, 280068,
    ],
    female: [
      1021446, 1098448, 1221639, 1290485, 1251914, 1328848, 1465318, 1378010,
      1350649, 1210681, 1212268, 1168622, 1187317, 1074608, 905833, 692829,
      452473, 444772,
    ],
    totalPop: 39431264,
    medianAge: 38.0,
    elderlyRatio: 16.5,
    youthRatio: 21.3,
  },
};

const geos = ['lagunaBeach', 'orangeCounty', 'california'];

const langIsEn =
  document.documentElement.lang !== 'zh-TW' &&
  !window.location.pathname.startsWith('/zh-TW');

const geoLabels = {
  lagunaBeach: langIsEn ? 'Laguna Beach' : '拉古納海灘',
  orangeCounty: langIsEn ? 'Orange County' : '橙縣',
  california: langIsEn ? 'California' : '加州',
};

const ageGroups = [
  '0-4',
  '5-9',
  '10-14',
  '15-19',
  '20-24',
  '25-29',
  '30-34',
  '35-39',
  '40-44',
  '45-49',
  '50-54',
  '55-59',
  '60-64',
  '65-69',
  '70-74',
  '75-79',
  '80-84',
  '85+',
];

// Load D3 and initialize population pyramid
const pyramidScript = document.createElement('script');
pyramidScript.src = 'https://d3js.org/d3.v7.min.js';
pyramidScript.onload = () => initPopulationPyramid();
document.head.appendChild(pyramidScript);

function initPopulationPyramid() {
  const container = document.getElementById('population-pyramid');
  const height = 600;
  const maxWidth = 800;
  let width = Math.min(container.clientWidth, maxWidth);
  let margin = getPyramidMargin(width);
  let chartWidth = width - margin.left - margin.right;
  let chartHeight = height - margin.top - margin.bottom;

  let currentGeo = 'lagunaBeach';

  function getPyramidMargin(containerWidth) {
    if (containerWidth <= 480) {
      return { top: 68, right: 16, bottom: 20, left: 16 };
    }

    if (containerWidth <= 768) {
      return { top: 64, right: 24, bottom: 24, left: 24 };
    }

    return { top: 64, right: 40, bottom: 28, left: 100 };
  }

  function getInfoBoxMetrics(innerWidth) {
    const boxWidth = Math.max(136, Math.min(180, innerWidth * 0.28));
    const boxHeight = innerWidth <= 480 ? 92 : 100;
    const boxX = Math.max(innerWidth - boxWidth - 8, innerWidth / 2 + 8);
    const fontSize = innerWidth <= 480 ? 10 : 12;
    const lineStep = innerWidth <= 480 ? 13 : 15;

    return { boxWidth, boxHeight, boxX, fontSize, lineStep };
  }

  const svg = d3
    .select('#population-pyramid')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const pyramidGroup = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Scales
  const xScale = d3.scaleLinear().range([0, chartWidth / 2]);

  const yScale = d3
    .scaleBand()
    .domain(ageGroups)
    .range([chartHeight, 0])
    .padding(0.1);

  // Create gradient colors for age groups
  const ageColorScale = d3
    .scaleSequential()
    .domain([0, ageGroups.length - 1])
    .interpolator(d3.interpolateViridis);

  // Y axis (age groups)
  const yAxis = pyramidGroup
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${chartWidth / 2}, 0)`);

  // Male bars (left side)
  const maleBars = pyramidGroup
    .selectAll('.male-bar')
    .data(ageGroups)
    .join('rect')
    .attr('class', 'male-bar')
    .attr('y', (d) => yScale(d))
    .attr('height', yScale.bandwidth())
    .attr('fill', (d, i) => ageColorScale(i))
    .attr('opacity', 0.8);

  // Female bars (right side)
  const femaleBars = pyramidGroup
    .selectAll('.female-bar')
    .data(ageGroups)
    .join('rect')
    .attr('class', 'female-bar')
    .attr('x', chartWidth / 2)
    .attr('y', (d) => yScale(d))
    .attr('height', yScale.bandwidth())
    .attr('fill', (d, i) => ageColorScale(i))
    .attr('opacity', 0.8);

  // Labels for male/female
  const maleTitle = pyramidGroup
    .append('text')
    .attr('class', 'male-title')
    .attr('text-anchor', 'middle')
    .attr('x', chartWidth / 4)
    .attr('y', -20)
    .attr('fill', '#cbd5e1')
    .attr('font-weight', 'bold')
    .text(langIsEn ? 'Male' : '男性');

  const femaleTitle = pyramidGroup
    .append('text')
    .attr('class', 'female-title')
    .attr('text-anchor', 'middle')
    .attr('x', (chartWidth / 4) * 3)
    .attr('y', -20)
    .attr('fill', '#cbd5e1')
    .attr('font-weight', 'bold')
    .text(langIsEn ? 'Female' : '女性');

  // Population info box
  const infoBox = pyramidGroup
    .append('g')
    .attr('class', 'info-box')
    .attr('transform', 'translate(0, 20)');

  const infoBoxRect = infoBox
    .append('rect')
    .attr('fill', 'rgba(255, 255, 255, 0.05)')
    .attr('stroke', 'rgba(255, 255, 255, 0.1)')
    .attr('rx', 8);

  const infoText = infoBox
    .append('text')
    .attr('x', 10)
    .attr('y', 20)
    .attr('fill', '#e2e8f0');

  function applyPyramidLayout() {
    width = Math.min(container.clientWidth, maxWidth);
    margin = getPyramidMargin(width);
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`);

    pyramidGroup.attr('transform', `translate(${margin.left}, ${margin.top})`);

    xScale.range([0, chartWidth / 2]);
    yScale.range([chartHeight, 0]);

    yAxis.attr('transform', `translate(${chartWidth / 2}, 0)`);
    femaleBars.attr('x', chartWidth / 2);

    maleTitle.attr('x', chartWidth / 4).attr('y', -20);

    femaleTitle.attr('x', (chartWidth / 4) * 3).attr('y', -20);

    const infoMetrics = getInfoBoxMetrics(chartWidth);
    infoBox.attr('transform', `translate(${infoMetrics.boxX}, 20)`);
    infoBoxRect
      .attr('width', infoMetrics.boxWidth)
      .attr('height', infoMetrics.boxHeight);
    infoText.attr('font-size', `${infoMetrics.fontSize}px`);
  }

  function updatePyramid(geo) {
    const data = populationData[geo];
    const maxPop = Math.max(...data.male, ...data.female);
    const infoMetrics = getInfoBoxMetrics(chartWidth);

    xScale.domain([0, maxPop]);

    // Update male bars
    maleBars
      .transition()
      .duration(500)
      .attr('y', (d) => yScale(d))
      .attr('height', yScale.bandwidth())
      .attr('x', (d, i) => chartWidth / 2 - xScale(data.male[i]))
      .attr('width', (d, i) => xScale(data.male[i]));

    // Update female bars
    femaleBars
      .transition()
      .duration(500)
      .attr('x', chartWidth / 2)
      .attr('y', (d) => yScale(d))
      .attr('height', yScale.bandwidth())
      .attr('width', (d, i) => xScale(data.female[i]));

    // Update Y axis
    yAxis.selectAll('text').remove();

    yAxis
      .selectAll('.age-label')
      .data(ageGroups)
      .join('text')
      .attr('class', 'age-label')
      .attr('text-anchor', 'middle')
      .attr('x', 0)
      .attr('y', (d) => yScale(d) + yScale.bandwidth() / 2)
      .attr('dy', '0.35em')
      .attr('fill', '#cbd5e1')
      .attr('font-size', chartWidth <= 360 ? '10px' : '11px')
      .text((d) => d);

    // Update info box
    infoText.selectAll('*').remove();

    infoText
      .append('tspan')
      .attr('x', 10)
      .attr('dy', 0)
      .attr('font-weight', 'bold')
      .attr('fill', '#60a5fa')
      .text(geoLabels[geo]);

    infoText
      .append('tspan')
      .attr('x', 10)
      .attr('dy', 18)
      .attr('fill', '#f8fafc')
      .text((langIsEn ? 'Pop: ' : '總人口：') + data.totalPop.toLocaleString());

    infoText
      .append('tspan')
      .attr('x', 10)
      .attr('dy', infoMetrics.lineStep)
      .text((langIsEn ? 'Median age: ' : '年齡中位數：') + data.medianAge);

    infoText
      .append('tspan')
      .attr('x', 10)
      .attr('dy', infoMetrics.lineStep)
      .text(
        (langIsEn ? 'Aged 65+: ' : '65 歲以上：') + data.elderlyRatio + '%',
      );
  }

  // Insight card values per geography
  function updateInsightCards(geo) {
    const d = populationData[geo];
    if (!d) return;
    const v1 = document.getElementById('insightValue1');
    const v2 = document.getElementById('insightValue2');
    const v3 = document.getElementById('insightValue3');
    const v4 = document.getElementById('insightValue4');
    if (v1) v1.textContent = String(d.medianAge);
    if (v2) v2.textContent = d.elderlyRatio + '%';
    if (v3) v3.textContent = d.youthRatio + '%';
    if (v4) v4.textContent = d.totalPop.toLocaleString();
  }

  // Initialize with Laguna Beach
  applyPyramidLayout();
  updatePyramid(currentGeo);
  updateInsightCards(currentGeo);

  // Slider implementation
  const slider = document.querySelector('.slider-track');
  const thumb = document.getElementById('yearThumb');
  const currentGeoLabel = document.getElementById('currentYear');

  let isDragging = false;
  let sliderRect;

  function updateSliderPosition() {
    const geoIndex = geos.indexOf(currentGeo);
    const percentage = geoIndex / (geos.length - 1);
    thumb.style.left = `calc(${percentage * 100}% - 12px)`;
    currentGeoLabel.textContent = geoLabels[currentGeo];
  }

  function handleSliderUpdate(clientX) {
    const rect = sliderRect || slider.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width),
    );
    const geoIndex = Math.round(percentage * (geos.length - 1));
    const newGeo = geos[geoIndex];

    if (newGeo !== currentGeo) {
      currentGeo = newGeo;
      updateSliderPosition();
      updatePyramid(currentGeo);
      updateInsightCards(currentGeo);
    }
  }

  thumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    sliderRect = slider.getBoundingClientRect();
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    e.preventDefault();
  });

  function onMouseMove(e) {
    if (isDragging) {
      handleSliderUpdate(e.clientX);
    }
  }

  function onMouseUp() {
    isDragging = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  slider.addEventListener('click', (e) => {
    if (e.target !== thumb) {
      sliderRect = slider.getBoundingClientRect();
      handleSliderUpdate(e.clientX);
    }
  });

  // Touch events for mobile
  thumb.addEventListener('touchstart', (e) => {
    isDragging = true;
    sliderRect = slider.getBoundingClientRect();
    e.preventDefault();
  });

  document.addEventListener('touchmove', (e) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleSliderUpdate(touch.clientX);
      e.preventDefault();
    }
  });

  document.addEventListener('touchend', () => {
    isDragging = false;
  });

  updateSliderPosition();

  // Responsive handling
  window.addEventListener('resize', () => {
    sliderRect = null;
    applyPyramidLayout();
    updatePyramid(currentGeo);
  });
}
