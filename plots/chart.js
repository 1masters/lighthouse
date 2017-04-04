/**
 * @license
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/* global Plotly, document, generatedResults */

const IGNORED_METRICS = ['Navigation Start'];

let elementId = 1;

function generateBoxPlotChartPerMetric() {
  for (const metric in generatedResults) {
    if (IGNORED_METRICS.indexOf(metric) !== -1) {
      continue;
    }
    generateBoxPlotChartByBatch({metric, type: 'timing'});
  }

  function generateBoxPlotChartByBatch({metric, type}) {
    const width = 30;
    for (let i = 0; i < generatedResults[metric].length; i += width) {
      generateBoxPlotChart({
        title: metric,
        data: generatedResults[metric].slice(i, i + width),
        type: type
      });
    }
  }

  function generateBoxPlotChart({title, data, type}) {
    data = data
      .map(siteResult => {
        return {
          x: siteResult.metrics.map(m => m ? m[type] : null),
          type: 'box',
          name: siteResult.site,
          boxpoints: 'all',
          jitter: 0.9,
          pointpos: -2,
          hoverinfo: 'x+name'
        };
      });

    const layout = {title: title + ' ' + type};
    Plotly.newPlot(createChartElement(1000), data, layout);
  }
}

function generateLinePlotChartPerMetric() {
  for (const metric in generatedResults) {
    if (IGNORED_METRICS.indexOf(metric) !== -1) {
      continue;
    }
    generateLinePlotByBatch({metric, type: 'timing'});
  }

  function generateLinePlotByBatch({metric, type}) {
    const width = 20;
    for (let i = 0; i < generatedResults[metric].length; i += width) {
      generateLinePlot({
        title: metric,
        data: generatedResults[metric].slice(i, i + width),
        type: type
      });
    }
  }

  function generateLinePlot({title, data, type}) {
    data = data.map(siteResult => ({
      name: siteResult.site,
      y: siteResult.metrics.map(m => m ? m[type] : null),
      type: 'scatter'
    }));

    const layout = {title: title + ' ' + type};

    Plotly.newPlot(createChartElement(), data, layout);
  }
}

function createChartElement(height = 800) {
  const div = document.createElement('div');
  div.style = `width: 100%; height: ${height}px`;
  div.id = 'chart' + elementId++;
  document.body.appendChild(div);
  return div.id;
}

generateBoxPlotChartPerMetric();
generateLinePlotChartPerMetric();
