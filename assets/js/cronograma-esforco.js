(function () {
  'use strict';

  function monthIndex(months, id) {
    const i = months.findIndex(function (m) {
      return m.id === id;
    });
    return i >= 0 ? i : months.length - 1;
  }

  function barStyle(months, startId, endId) {
    const n = months.length;
    const start = monthIndex(months, startId);
    const end = monthIndex(months, endId);
    const left = (start / n) * 100;
    const width = ((end - start + 1) / n) * 100;
    return 'left:' + left + '%;width:' + width + '%;';
  }

  function monthRow(months) {
    const n = months.length;
    let html =
      '<div class="esf-exec-months"><div class="esf-exec-months-spacer"></div><div class="esf-exec-month-track" style="--esf-cols:' +
      n +
      '">';
    months.forEach(function (m, i) {
      html +=
        '<span class="esf-exec-month-label" style="left:' +
        (i / n) * 100 +
        '%;width:' +
        (100 / n) +
        '%">' +
        m.label +
        '</span>';
    });
    html += '</div></div>';
    return html;
  }

  function profileBadge(profiles, id) {
    const p = profiles[id];
    if (!p) return id;
    return (
      '<span class="esf-profile-badge" style="background:' +
      p.color +
      '" title="' +
      p.name +
      '">' +
      id +
      '</span>'
    );
  }

  function fmt(n) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function renderMeta(data, el) {
    if (!el || !data.projectType) return;
    const mode = data.scheduleMode || 'executive_months';
    el.innerHTML =
      '<span class="esf-meta-badge esf-meta-badge--type">' +
      data.projectType +
      '</span>' +
      '<span class="esf-meta-badge">' +
      mode +
      '</span>' +
      (data.client ? '<span class="esf-meta-badge">' + data.client + '</span>' : '');
  }

  function renderDiagnosis(data, el) {
    if (!el || !data.diagnosis) return;
    const d = data.diagnosis;
    el.innerHTML =
      '<p><strong>Problema:</strong> ' +
      d.problem +
      '</p>' +
      '<p><strong>MVP:</strong> ' +
      d.mvp +
      '</p>' +
      (d.outOfScope ? '<p><strong>Fora do escopo:</strong> ' + d.outOfScope + '</p>' : '');
  }

  function renderDualEstimation(data, el) {
    if (!el || !data.dualEstimation) return;
    const e = data.dualEstimation;
    el.innerHTML =
      '<p>' +
      e.note +
      '</p>' +
      '<div class="esf-dual-grid">' +
      '<div><span class="esf-dual-value">' +
      fmt(e.acceptanceHours) +
      ' h</span><span class="esf-dual-label">Aceite (G/M/P)</span></div>' +
      '<div><span class="esf-dual-value">' +
      fmt(e.commercialHours) +
      ' h</span><span class="esf-dual-label">Comercial (C12)</span></div>' +
      '<div><span class="esf-dual-value">+' +
      fmt(e.gapHours) +
      ' h</span><span class="esf-dual-label">Gap explicado</span></div>' +
      '</div>';
  }

  function renderPremises(data, el) {
    if (!el || !data.premises) return;
    el.innerHTML = data.premises
      .map(function (p) {
        return '<li>' + p + '</li>';
      })
      .join('');
  }

  function renderMilestones(data, el) {
    if (!el || !data.milestones) return;
    el.innerHTML = data.milestones
      .map(function (m) {
        const cls = m.type === 'go-live' ? ' esf-milestone--golive' : '';
        const deps = m.depends && m.depends.length ? ' · ' + m.depends.join(', ') : '';
        return (
          '<div class="esf-milestone' +
          cls +
          '"><strong>' +
          m.month +
          '</strong> — ' +
          m.label +
          '<span class="esf-milestone-deps">' +
          deps +
          '</span></div>'
        );
      })
      .join('');
  }

  function renderLegend(profiles, el) {
    el.innerHTML = Object.keys(profiles)
      .map(function (id) {
        const p = profiles[id];
        return (
          '<span>' +
          profileBadge(profiles, id) +
          ' ' +
          p.name +
          ' · ' +
          p.jt +
          '</span>'
        );
      })
      .join('');
  }

  function renderExecutiveGantt(data, el) {
    const n = data.months.length;
    let html =
      monthRow(data.months) +
      '<div class="esf-exec-head">' +
      '<div>Atividade</div><div>Perfis</div><div>Cronograma (' +
      n +
      ' períodos)</div></div>';

    data.phases.forEach(function (phase) {
      const acts = data.activities.filter(function (a) {
        return a.phaseId === phase.id;
      });
      const startM = acts[0] ? acts[0].startMonth : 'M1';
      const endM = acts[acts.length - 1] ? acts[acts.length - 1].endMonth : 'M1';

      html +=
        '<div class="esf-exec-phase-row" style="background:' +
        phase.color +
        '">' +
        '<div class="esf-exec-meta"><span>' +
        phase.code +
        '</span><span>— ' +
        phase.name +
        '</span><span style="opacity:.85;font-weight:500">' +
        phase.months +
        ' · ' +
        phase.hours.toLocaleString('pt-BR') +
        ' h</span></div>' +
        '<div class="esf-exec-track-cell"><div class="esf-exec-track" style="--esf-cols:' +
        n +
        '">' +
        '<div class="esf-exec-bar" style="' +
        barStyle(data.months, startM, endM) +
        ';background:rgba(255,255,255,0.3)"></div></div></div></div>';

      acts.forEach(function (act) {
        const ppu = (act.ceaItems || act.ppuItems)
          ? (act.ceaItems || act.ppuItems).join(', ')
          : '';
        const barClass = act.milestone === 'go-live' ? ' esf-exec-bar--milestone' : '';
        const label = act.milestone === 'go-live' ? 'GO LIVE' : (act.plannedHours || act.hours) + ' h';
        const deps =
          act.dependencies && act.dependencies.length
            ? '<div class="esf-exec-row-deps">' + act.dependencies.join(' · ') + '</div>'
            : '';

        html +=
          '<div class="esf-exec-row">' +
          '<div><div class="esf-exec-row-title">' +
          act.title +
          '</div>' +
          (ppu ? '<div class="esf-exec-row-ppu">CEA ' + ppu + '</div>' : '') +
          deps +
          '</div>' +
          '<div class="esf-exec-profiles">' +
          act.profiles
            .map(function (pid) {
              return profileBadge(data.profiles, pid);
            })
            .join(' ') +
          '</div>' +
          '<div><div class="esf-exec-track" style="--esf-cols:' +
          n +
          '">' +
          '<div class="esf-exec-bar' +
          barClass +
          '" style="' +
          barStyle(data.months, act.startMonth, act.endMonth) +
          '" title="' +
          act.startMonth +
          ' → ' +
          act.endMonth +
          '">' +
          '<span class="esf-exec-bar-label">' +
          label +
          '</span></div></div></div></div>';
      });
    });

    el.innerHTML = html;
  }

  function renderDetailTable(data, el) {
    const phaseMap = {};
    data.phases.forEach(function (p) {
      phaseMap[p.id] = p;
    });

    let rows = '';
    data.activities.forEach(function (act) {
      const phase = phaseMap[act.phaseId];
      act.detail.forEach(function (line) {
        rows +=
          '<tr>' +
          '<td><strong>' +
          phase.code +
          '</strong> — ' +
          phase.name +
          '</td>' +
          '<td>' +
          act.title +
          '</td>' +
          '<td>' +
          ((act.ceaItems || act.ppuItems)
            ? (act.ceaItems || act.ppuItems).join(', ')
            : '—') +
          '</td>' +
          '<td>' +
          profileBadge(data.profiles, line.profile) +
          '</td>' +
          '<td class="ppu-cronogram-num">' +
          line.hours +
          ' h</td>' +
          '<td>' +
          act.startMonth +
          ' → ' +
          act.endMonth +
          '</td>' +
          '<td>' +
          (act.dependencies ? act.dependencies.join(', ') : '—') +
          '</td></tr>';
      });
    });
    el.innerHTML = rows;
  }

  function renderTotals(data, el) {
    const fmtMoney = function (n) {
      return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    el.innerHTML =
      '<div><strong>Investimento consultoria (C12 CLT)</strong></div>' +
      '<div class="esf-total-stats">' +
      '<div><span class="esf-total-stat-value">' +
      data.totalHours.toLocaleString('pt-BR') +
      ' h</span><span class="esf-total-stat-label">Total horas</span></div>' +
      '<div><span class="esf-total-stat-value">R$ ' +
      fmtMoney(data.totalCostClt) +
      '</span><span class="esf-total-stat-label">Custo CLT</span></div>' +
      '<div><span class="esf-total-stat-value">R$ ' +
      fmtMoney(data.revenueTarget) +
      '</span><span class="esf-total-stat-label">Receita alvo (30% MB)</span></div>' +
      '</div>';
  }

  function renderRiskPanel(data, el) {
    if (!data.riskMargin || !el) return;
    const r = data.riskMargin;
    el.innerHTML =
      '<p>Margem de risco sugerida para validação com autor CEA: <strong>+' +
      r.hoursLow +
      '–' +
      r.hoursHigh +
      ' h</strong> (+' +
      r.pctLow +
      '–' +
      r.pctHigh +
      '% sobre ' +
      data.totalHours.toLocaleString('pt-BR') +
      ' h).</p><ul>' +
      r.notes
        .map(function (n) {
          return '<li>' + n + '</li>';
        })
        .join('') +
      '</ul>';
  }

  function renderPrinciples(data, el) {
    if (!data.principles || !el) return;
    el.innerHTML = data.principles
      .map(function (p) {
        return '<li>' + p + '</li>';
      })
      .join('');
  }

  function initEsforco(options) {
    const gantt = document.getElementById(options.ganttId || 'esf-exec-gantt');
    const detail = document.getElementById(options.detailId || 'esf-detail-body');
    const legend = document.getElementById(options.legendId || 'esf-profile-legend');
    const totals = document.getElementById(options.totalsId || 'esf-totals');
    const risk = document.getElementById(options.riskId || 'esf-risk-body');
    const principles = document.getElementById(options.principlesId || 'esf-principles');
    const meta = document.getElementById(options.metaId || 'esf-meta-badges');
    const diagnosis = document.getElementById(options.diagnosisId || 'esf-diagnosis-body');
    const dual = document.getElementById(options.dualId || 'esf-dual-body');
    const premises = document.getElementById(options.premisesId || 'esf-premises');
    const milestones = document.getElementById(options.milestonesId || 'esf-milestones');
    if (!gantt) return;

    fetch(options.dataUrl || 'assets/data/cea-esforco.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load esforço data');
        return r.json();
      })
      .then(function (data) {
        if (options.onData) options.onData(data);
        renderMeta(data, meta);
        renderDiagnosis(data, diagnosis);
        renderDualEstimation(data, dual);
        renderExecutiveGantt(data, gantt);
        if (legend) renderLegend(data.profiles, legend);
        if (detail) renderDetailTable(data, detail);
        if (totals) renderTotals(data, totals);
        if (risk) renderRiskPanel(data, risk);
        if (principles) renderPrinciples(data, principles);
        if (premises) renderPremises(data, premises);
        if (milestones) renderMilestones(data, milestones);
      })
      .catch(function (err) {
        gantt.innerHTML =
          '<p class="callout callout-info" style="margin:1rem">Não foi possível carregar dados de esforço. ' +
          String(err) +
          '</p>';
      });
  }

  window.initEsforco = initEsforco;
})();
