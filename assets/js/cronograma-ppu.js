(function () {
  'use strict';

  let MAX_W = 36;

  function setMaxWeek(n) {
    MAX_W = n || 36;
  }

  function parseId(id) {
    const p = id.split('.');
    return [parseInt(p[0], 10), parseInt(p[1], 10)];
  }

  function sortByPpuId(a, b) {
    const [ga, sa] = parseId(a.id);
    const [gb, sb] = parseId(b.id);
    return ga !== gb ? ga - gb : sa - sb;
  }

  function endWeek(start, dur) {
    return start + dur - 1;
  }

  function barStyle(start, dur, color) {
    const left = ((start - 1) / MAX_W) * 100;
    const width = (dur / MAX_W) * 100;
    return 'left:' + left + '%;width:' + width + '%;background:' + color + ';';
  }

  function barLabel(item) {
    if (item.dur >= 3) return 'Gr.' + item.group + ' · ' + item.id;
    if (item.dur >= 2) return 'Gr.' + item.group + ' · ' + item.id;
    return 'G' + item.group;
  }

  function barTitle(item, fin) {
    return 'Grupo ' + item.group + ' · ' + item.id + ' · Sem. ' + item.start + '–' + fin;
  }

  function renderBar(item, phase, fin) {
    const narrow = item.dur < 2 ? ' ppu-cronogram-bar--narrow' : '';
    return (
      '<div class="ppu-cronogram-bar' +
      narrow +
      '" data-group="' +
      item.group +
      '" title="' +
      barTitle(item, fin) +
      '" style="' +
      barStyle(item.start, item.dur, phase.color) +
      '">' +
      '<span class="ppu-cronogram-bar-label">' +
      barLabel(item) +
      '</span></div>'
    );
  }

  function monthStyle(startWeek, weekCount) {
    const left = ((startWeek - 1) / MAX_W) * 100;
    const width = (weekCount / MAX_W) * 100;
    return 'left:' + left + '%;width:' + width + '%;';
  }

  function weekMarkers() {
    let html =
      '<div class="ppu-cronogram-weeks"><div class="ppu-cronogram-month-spacer"></div><div class="ppu-cronogram-week-track">';
    for (let w = 1; w <= MAX_W; w++) {
      const left = ((w - 1) / MAX_W) * 100;
      html += '<span class="ppu-cronogram-week-n" style="left:' + left + '%">' + w + '</span>';
    }
    html += '</div></div>';
    return html;
  }

  function monthRow(monthLabels) {
    let html =
      '<div class="ppu-cronogram-months"><div class="ppu-cronogram-month-spacer"></div><div class="ppu-cronogram-month-track">';
    monthLabels.forEach(function (m) {
      html +=
        '<span class="ppu-cronogram-month-label" style="' +
        monthStyle(m.weeks[0], m.weeks.length) +
        '">' +
        m.label +
        '</span>';
    });
    html += '</div></div>';
    return html;
  }

  function allItems(data) {
    const items = [];
    data.phases.forEach(function (phase) {
      phase.items.forEach(function (item) {
        items.push({
          item: item,
          phase: phase
        });
      });
    });
    return items.sort(function (a, b) {
      return sortByPpuId(a.item, b.item);
    });
  }

  function renderLegend(phases, el) {
    el.innerHTML = phases
      .map(function (p) {
        return (
          '<span class="ppu-cronogram-legend-item">' +
          '<span class="ppu-cronogram-legend-swatch" style="background:' +
          p.color +
          '"></span>' +
          '<span><strong>' +
          p.short +
          '</strong> — ' +
          p.name +
          ' (sem. ' +
          p.startWeek +
          '–' +
          p.endWeek +
          ')</span></span>'
        );
      })
      .join('');
  }

  function renderSummary(data, el) {
    let rows = '';
    let totalHours = 0;
    data.phases.forEach(function (p) {
      const hours = data.phaseHours[String(p.id)] || 0;
      totalHours += hours;
      rows +=
        '<tr><td><span class="ppu-cronogram-legend-swatch" style="display:inline-block;vertical-align:middle;background:' +
        p.color +
        '"></span> <strong>' +
        p.short +
        '</strong> — ' +
        p.name +
        '</td>' +
        '<td>' +
        p.startWeek +
        ' → ' +
        p.endWeek +
        '</td>' +
        '<td>' +
        p.durationWeeks +
        ' sem</td>' +
        '<td>' +
        (p.deliverables || '') +
        '</td>' +
        '<td>' +
        hours.toLocaleString('pt-BR') +
        ' h</td></tr>';
    });
    rows +=
      '<tr><td colspan="4"><strong>Total estimado</strong></td><td><strong>' +
      totalHours.toLocaleString('pt-BR') +
      ' h</strong></td></tr>';
    el.innerHTML = rows;
  }

  function renderMasterTable(data, el) {
    const rows = allItems(data);
    el.innerHTML = rows
      .map(function (row) {
        const item = row.item;
        const phase = row.phase;
        const fin = endWeek(item.start, item.dur);
        return (
          '<tr>' +
          '<td><strong>' +
          item.id +
          '</strong></td>' +
          '<td>Gr. ' +
          item.group +
          '</td>' +
          '<td><a href="' +
          item.href +
          '">' +
          item.title +
          '</a></td>' +
          '<td><span class="ppu-cronogram-legend-swatch" style="display:inline-block;vertical-align:middle;background:' +
          phase.color +
          '"></span> ' +
          phase.short +
          '</td>' +
          '<td class="ppu-cronogram-num">' +
          item.start +
          '</td>' +
          '<td class="ppu-cronogram-num">' +
          item.dur +
          '</td>' +
          '<td class="ppu-cronogram-num">' +
          fin +
          '</td>' +
          '<td>' +
          item.size +
          '</td>' +
          '</tr>'
        );
      })
      .join('');
  }

  function renderGantt(data, ganttEl) {
    let html =
      monthRow(data.monthLabels) +
      weekMarkers() +
      '<div class="ppu-cronogram-head">' +
      '<div>Item / Atividade</div><div>Grupo</div><div>Início</div><div>Dur.</div><div>Fim</div><div>Timeline (36 semanas)</div></div>';

    data.phases.forEach(function (phase) {
      const sortedItems = phase.items.slice().sort(sortByPpuId);

      html +=
        '<div class="ppu-cronogram-phase-row" style="background:' +
        phase.color +
        '">' +
        '<div class="ppu-cronogram-meta"><span>' +
        phase.short +
        '</span><span>— ' +
        phase.name +
        '</span><span style="opacity:.85;font-weight:500">(sem. ' +
        phase.startWeek +
        '–' +
        phase.endWeek +
        ' · ' +
        phase.durationWeeks +
        ' sem · ' +
        (phase.deliverables || '') +
        ')</span></div>' +
        '<div class="ppu-cronogram-track-cell"><div class="ppu-cronogram-track">' +
        '<div class="ppu-cronogram-bar" style="' +
        barStyle(phase.startWeek, phase.endWeek - phase.startWeek + 1, 'rgba(255,255,255,0.35)') +
        '"></div></div></div></div>';

      sortedItems.forEach(function (item) {
        const fin = endWeek(item.start, item.dur);
        html +=
          '<div class="ppu-cronogram-row">' +
          '<div><span class="ppu-cronogram-item-id">' +
          item.id +
          '</span> <a class="ppu-cronogram-title" href="' +
          item.href +
          '">' +
          item.title +
          '</a></div>' +
          '<div class="ppu-cronogram-num"><span class="ppu-cronogram-group-badge">Gr. ' +
          item.group +
          '</span></div>' +
          '<div class="ppu-cronogram-num">' +
          item.start +
          '</div>' +
          '<div class="ppu-cronogram-num">' +
          item.dur +
          '</div>' +
          '<div class="ppu-cronogram-num">' +
          fin +
          '</div>' +
          '<div><div class="ppu-cronogram-track">' +
          renderBar(item, phase, fin) +
          '</div></div></div>';
      });
    });

    ganttEl.innerHTML = html;
  }

  function init() {
    const gantt = document.getElementById('ppu-cronogram-gantt');
    const legend = document.getElementById('ppu-cronogram-legend');
    const summary = document.getElementById('ppu-cronogram-summary');
    const master = document.getElementById('ppu-cronogram-master');
    if (!gantt) return;

    fetch('assets/data/ppu-cronograma.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load cronogram data');
        return r.json();
      })
      .then(function (data) {
        setMaxWeek(data.maxWeek);
        renderGantt(data, gantt);
        if (legend) renderLegend(data.phases, legend);
        if (summary) renderSummary(data, summary);
        if (master) renderMasterTable(data, master);
      })
      .catch(function (err) {
        gantt.innerHTML =
          '<p class="callout callout-info">Não foi possível carregar o cronograma. Use um servidor HTTP local (<code>python3 -m http.server</code>). ' +
          String(err) +
          '</p>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
