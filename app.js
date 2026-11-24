'use strict';

// Static GitHub Pages trainer: no API and no automatic semantic grading.
const STORAGE_KEY = 'ethics-trainer-progress-v1';
const $ = (id) => document.getElementById(id);
const ui = {
  chapter: $('chapter-select'), practice: $('practice-select'), shuffle: $('shuffle-button'),
  status: $('status-panel'), card: $('question-card'), category: $('question-category'),
  slide: $('question-slide'), count: $('question-count'), question: $('question-text'),
  hintButton: $('hint-button'), hintPanel: $('hint-panel'), keywords: $('keyword-list'),
  input: $('answer-input'), submit: $('submit-button'), answerStage: $('answer-stage'),
  solutionStage: $('solution-stage'), submitted: $('submitted-text'), solution: $('solution-text'),
  feedback: $('rating-feedback'), next: $('next-button'), nextHint: $('next-hint'),
  progressLabel: $('progress-label'), progressDetail: $('progress-detail'),
  progressBar: $('progress-bar'), progressTrack: $('progress-track'), reset: $('reset-button'),
};

let dataset = { questions: [], chapters: [] };
let progress = loadProgress();
let queue = [];
let queueIndex = 0;
let currentQuestion = null;
let hinted = false;
let activeRating = null;
let seenInSession = new Set();

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch (_) { return {}; }
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); }
  catch (_) { /* Trainer still works if local storage is unavailable. */ }
}
function shuffle(items) {
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function stateOf(id) { return progress[id] || null; }
function isMastered(id) { const s = stateOf(id); return !!s && s.rating === 'good' && s.withoutHints; }
function isWeak(id) { const s = stateOf(id); return !!s && !isMastered(id); }
function matchesPractice(q) {
  const s = stateOf(q.id);
  switch (ui.practice.value) {
    case 'review': return !isMastered(q.id);
    case 'unseen': return !s;
    case 'weak': return isWeak(q.id);
    default: return true;
  }
}
function filteredQuestions() {
  return dataset.questions.filter(q => (ui.chapter.value === 'all' || String(q.chapter) === ui.chapter.value) && matchesPractice(q));
}
function setStatus(text, show = true) {
  ui.status.textContent = text;
  ui.status.hidden = !show;
}
function updateProgress() {
  const relevant = dataset.questions.filter(q => ui.chapter.value === 'all' || String(q.chapter) === ui.chapter.value);
  const mastered = relevant.filter(q => isMastered(q.id)).length;
  const practiced = relevant.filter(q => !!stateOf(q.id)).length;
  const withHelp = relevant.filter(q => {const s = stateOf(q.id);return s && s.rating === 'good' && !s.withoutHints;}).length;
  const weak = relevant.filter(q => isWeak(q.id)).length;
  const pct = relevant.length ? Math.round(mastered * 100 / relevant.length) : 0;
  ui.progressLabel.textContent = `${mastered} / ${relevant.length} sicher`;
  ui.progressDetail.textContent = `${practiced} bearbeitet · ${withHelp} mit Hilfe richtig · ${weak} noch üben`;
  ui.progressBar.style.width = `${pct}%`;
  ui.progressTrack.setAttribute('aria-valuenow', String(pct));
}
function resetQuestionUI() {
  hinted = false;
  activeRating = null;
  ui.input.value = '';
  ui.submit.disabled = true;
  ui.hintPanel.hidden = true;
  ui.hintButton.setAttribute('aria-expanded', 'false');
  ui.hintButton.textContent = '✧ Schlüsselbegriffe anzeigen';
  ui.solutionStage.hidden = true;
  ui.answerStage.hidden = false;
  ui.feedback.textContent = '';
  ui.next.disabled = true;
  ui.nextHint.textContent = 'Bewerte deine Antwort, um fortzufahren.';
  document.querySelectorAll('.rating').forEach(b => {b.classList.remove('selected');b.setAttribute('aria-pressed','false');});
}
function displayCurrent() {
  currentQuestion = queue[queueIndex] || null;
  if (!currentQuestion) {
    ui.card.hidden = true;
    const options = {
      weak: 'Keine unsicheren Fragen vorhanden. Du kannst wieder „Alle Fragen“ auswählen.',
      unseen: 'Alle Fragen in dieser Auswahl wurden bereits bearbeitet.',
      review: 'In dieser Auswahl sind alle Fragen sicher beherrscht.',
      all: 'Du hast alle Fragen dieser Runde bearbeitet. Klicke auf „Neu mischen“, um eine neue Runde zu starten.'
    };
    setStatus(options[ui.practice.value]);
    updateProgress();
    return;
  }
  ui.card.hidden = false;
  setStatus('', false);
  resetQuestionUI();
  const chapter = dataset.chapters.find(c => c.id === currentQuestion.chapter);
  ui.category.textContent = `Kapitel ${currentQuestion.chapter} · ${chapter ? chapter.title : ''}`;
  ui.slide.textContent = currentQuestion.slide_reference || 'LV-Skript';
  ui.count.textContent = `Frage ${queueIndex + 1} von ${queue.length}`;
  ui.question.textContent = currentQuestion.question;
  ui.keywords.replaceChildren();
  for (const keyword of currentQuestion.keywords || []) {
    const pill = document.createElement('span');
    pill.className = 'keyword';
    pill.textContent = keyword;
    ui.keywords.append(pill);
  }
  ui.solution.textContent = currentQuestion.sample_answer;
  updateProgress();
}
function beginRound() {
  queue = shuffle(filteredQuestions());
  queueIndex = 0;
  seenInSession = new Set();
  displayCurrent();
}
function submitAnswer() {
  if (!currentQuestion || !ui.input.value.trim()) return;
  ui.submitted.textContent = ui.input.value.trim();
  ui.answerStage.hidden = true;
  ui.solutionStage.hidden = false;
  ui.next.disabled = true;
  ui.solutionStage.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function markAnswer(rating) {
  if (!currentQuestion) return;
  activeRating = rating;
  const previous = stateOf(currentQuestion.id);
  progress[currentQuestion.id] = {
    rating,
    withoutHints: rating === 'good' && !hinted,
    usedHints: hinted,
    attempts: (previous?.attempts || 0) + 1,
    updatedAt: new Date().toISOString()
  };
  saveProgress();
  document.querySelectorAll('.rating').forEach(button => {
    const active = button.dataset.rating === rating;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  ui.feedback.textContent = rating === 'good'
    ? hinted ? 'Gut erklärt – mit Schlüsselbegriffen. Für „sicher“ bitte später ohne Hilfe wiederholen.' : 'Selbstständig beherrscht. Diese Frage wird in der Wiederholung zurückgestellt.'
    : rating === 'partial' ? 'Für eine spätere Wiederholung vorgemerkt.' : 'Diese Frage wird bevorzugt erneut geübt.';
  ui.next.disabled = false;
  ui.nextHint.textContent = 'Selbsteinschätzung gespeichert.';
  updateProgress();
}
function nextQuestion() {
  if (!activeRating) return;
  seenInSession.add(currentQuestion.id);
  queueIndex++;
  displayCurrent();
  window.scrollTo({top:0,behavior:'smooth'});
}

ui.hintButton.addEventListener('click', () => {
  hinted = true; // opening hints once counts as using help, even if later hidden
  const show = ui.hintPanel.hidden;
  ui.hintPanel.hidden = !show;
  ui.hintButton.setAttribute('aria-expanded', String(show));
  ui.hintButton.textContent = show ? '✧ Schlüsselbegriffe ausblenden' : '✧ Schlüsselbegriffe anzeigen';
});
ui.input.addEventListener('input', () => {ui.submit.disabled = !ui.input.value.trim();});
ui.submit.addEventListener('click', submitAnswer);
document.querySelectorAll('.rating').forEach(button => button.addEventListener('click', () => markAnswer(button.dataset.rating)));
ui.next.addEventListener('click', nextQuestion);
ui.chapter.addEventListener('change', beginRound);
ui.practice.addEventListener('change', beginRound);
ui.shuffle.addEventListener('click', beginRound);
ui.reset.addEventListener('click', () => {
  if (!window.confirm('Wirklich sämtliche Selbsteinschätzungen und Lernfortschritte löschen?')) return;
  progress = {};
  try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  beginRound();
});

async function start() {
  try {
    const response = await fetch('questions.json', {cache:'no-cache'});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.questions) || !Array.isArray(data.chapters)) throw new Error('Datenformat ungültig');
    dataset = data;
    for (const chapter of dataset.chapters) {
      const option = document.createElement('option');
      option.value = String(chapter.id);
      option.textContent = `${chapter.id}. ${chapter.title}`;
      ui.chapter.append(option);
    }
    beginRound();
  } catch (error) {
    ui.card.hidden = true;
    setStatus('Die Fragen konnten nicht geladen werden. Öffne die App über einen lokalen Webserver oder GitHub Pages und prüfe, ob questions.json im selben Ordner liegt.');
    console.error('Ladefehler:', error);
  }
}
start();
