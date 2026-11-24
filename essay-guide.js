'use strict';
// Anteil und Textumfang sind didaktische Vorschläge, keine offiziellen Prüfungsvorgaben.
const sections = [
  {
    title:'Einleitung', share:'ca. 10 %', keywords:['Globalisierung','internationale Investitionen','wirtschaftliche Verflechtung'],
    purpose:'Führe sachlich in das Thema ein und erkläre in wenigen Sätzen, warum die Entscheidung wirtschaftlich und ethisch relevant ist.',
    depth:'Kurz halten: etwa 2–3 vollständige Sätze. Nur den Kontext herstellen; noch keine Lösung vorwegnehmen und keine ausführliche Theorie.',
    example:'Internationale Unternehmen investieren zunehmend auch in Staaten mit autoritären politischen Systemen. Dadurch entstehen wirtschaftliche Chancen, gleichzeitig aber ethische Fragen zur Verantwortung für die Folgen dieser Investitionen.',
    caution:'Nicht mit allgemeinen Definitionen beginnen, die später keine Rolle spielen.'
  },
  {
    title:'Darstellung des ethischen Dilemmas', share:'ca. 15 %', keywords:['Wohlstand','Arbeitsplätze','Militärjunta','Steuerzahlungen','Menschenrechte'],
    purpose:'Zeige die zwei gegensätzlichen Interessen und warum keine Entscheidung völlig unproblematisch ist.',
    depth:'Etwa 3–4 Sätze. Benenne mindestens einen konkreten möglichen Nutzen und einen konkreten ethischen Schaden und verknüpfe beides mit der Entscheidung.',
    example:'Eine Investition in Myanmar könnte Arbeitsplätze schaffen und den Lebensstandard von Teilen der Bevölkerung verbessern. Zugleich würden Steuerzahlungen die Militärjunta finanziell stärken, obwohl das Regime Menschenrechte verletzt. Die Entscheidung steht damit im Spannungsfeld zwischen wirtschaftlicher Entwicklung und der Vermeidung einer Unterstützung von Unrecht.',
    caution:'Ein Dilemma ist mehr als ein Problem: Erkläre ausdrücklich, weshalb beide Handlungsalternativen ethische Nachteile haben können.'
  },
  {
    title:'Deontologische Perspektive', share:'ca. 20 %', keywords:['Pflicht','Menschenwürde','Menschenrechte','Kant','Prinzipientreue'],
    purpose:'Beurteile die Investition nach Pflichten, Prinzipien und der Frage, ob das Unternehmen an Menschenrechtsverletzungen mitwirken dürfte.',
    depth:'Etwa 4–5 Sätze: zuerst die Theorie in einem Satz benennen, dann auf den Fall anwenden und daraus ein vorläufiges Urteil ableiten. Ein aussagekräftiges Argument genügt, wenn es sauber begründet wird.',
    example:'Die deontologische Ethik beurteilt Handlungen nach grundlegenden Pflichten und Prinzipien, nicht allein nach ihren Folgen. Die Wahrung der Menschenrechte hat daher Vorrang vor kommerziellen Interessen. Wenn das Unternehmen durch seine Investition wissentlich ein menschenrechtsverletzendes Regime unterstützt, wäre dies aus dieser Perspektive kaum zu rechtfertigen.',
    caution:'Nicht behaupten, dass jede deontologische Position automatisch jede Art von Handel verbietet. Erkläre die entscheidende Pflicht im konkreten Fall.'
  },
  {
    title:'Utilitaristische Perspektive', share:'ca. 20 %', keywords:['Konsequenzen','Gesamtnutzen','Nutzen und Schaden','Betroffene','Wohlstand'],
    purpose:'Bewerte die erwartbaren positiven und negativen Folgen für alle relevanten Betroffenengruppen.',
    depth:'Etwa 4–5 Sätze: Theorie kurz erklären, jeweils zwei wichtige Nutzen- und Schadensaspekte gegenüberstellen, dann ein vorsichtiges Zwischenurteil formulieren. Keine vollständige Folgenkette nötig.',
    example:'Der Utilitarismus beurteilt eine Handlung danach, ob ihre Folgen den Gesamtnutzen erhöhen. Die Investition könnte Einkommen, Arbeitsplätze und Bildungschancen fördern. Auf der anderen Seite könnten die Steuerzahlungen die Repression verstärken und insbesondere Regimegegnern und Minderheiten schaden. Ob die Investition vertretbar ist, hängt daher davon ab, welche Folgen insgesamt überwiegen.',
    caution:'Nicht nur wirtschaftliche Gewinne des Unternehmens zählen: Berücksichtige die Bevölkerung, verletzliche Gruppen und mögliche längerfristige Folgen.'
  },
  {
    title:'Kritische Abwägung', share:'ca. 25 %', keywords:['Stärken und Grenzen','Pflichten','Folgenunsicherheit','Verhältnismäßigkeit','Betroffene'],
    purpose:'Vergleiche beide Ansätze kritisch und prüfe, wo sie für den konkreten Fall an Grenzen stoßen.',
    depth:'Der ausführlichste Teil: etwa 5–6 Sätze. Hinterfrage mindestens einen Einwand gegen jede Perspektive und arbeite heraus, unter welchen Bedingungen sich das Urteil verändern könnte.',
    example:'Ein kategorischer Verzicht auf Investitionen könnte auch Menschen treffen, die dringend auf Beschäftigung und Einkommen angewiesen sind. Umgekehrt lässt sich das Ausmaß von Wohlfahrtsgewinnen und politischer Repression nicht verlässlich gegeneinander aufrechnen. Selbst wenn wirtschaftliche Vorteile entstehen, bleibt fraglich, ob schwere Menschenrechtsverletzungen dafür in Kauf genommen werden dürfen. Die Entscheidung muss deshalb sowohl grundlegende Schutzpflichten als auch die tatsächlichen Lebensbedingungen der Bevölkerung berücksichtigen.',
    caution:'Die Theorien nicht nur wiederholen. Hier soll erkennbar werden, dass du ihre Argumente prüfst und gegeneinander abwägst.'
  },
  {
    title:'Conclusio & Empfehlung', share:'ca. 10 %', keywords:['eigene Position','Handlungsempfehlung','Bedingungen','Menschenrechte','Begründung'],
    purpose:'Gib eine klare, aus der Argumentation abgeleitete Empfehlung an die Entscheidungsträger.',
    depth:'Etwa 2–3 Sätze. Position klar formulieren, wichtigste Begründung nennen und gegebenenfalls Bedingungen für eine vertretbare Entscheidung festhalten.',
    example:'Ich würde eine Investition nur dann empfehlen, wenn eine direkte Beteiligung an schweren Menschenrechtsverletzungen ausgeschlossen und ein konkreter Nutzen für die Bevölkerung nachvollziehbar ist. Unter den beschriebenen Bedingungen überwiegen jedoch die ethischen Bedenken, weshalb das Unternehmen zunächst auf die Investition verzichten sollte.',
    caution:'Keine völlig neuen Argumente einführen. Die Schlussfolgerung muss zu deiner vorangehenden Abwägung passen.'
  }
];
let active = 0;
const $ = id => document.getElementById(id);
const steps = $('steps');
sections.forEach((section,i)=>{
  const button=document.createElement('button'); button.type='button';button.className='step-tab';button.textContent=`${i+1}. ${section.title}`;
  button.addEventListener('click',()=>render(i));steps.appendChild(button);
});
function render(index){
  active=index; const s=sections[index];
  $('counter').textContent=`${index+1} / ${sections.length}`;
  $('step-ordinal').textContent=`Abschnitt ${index+1} von ${sections.length}`;
  $('share').textContent=s.share+' des Textes';
  $('step-title').textContent=s.title;
  $('purpose').textContent=s.purpose;
  $('depth').textContent=s.depth;
  $('example').textContent=s.example;
  $('caution').textContent=s.caution;
  const keys=$('keywords'); keys.replaceChildren();
  s.keywords.forEach(k=>{const span=document.createElement('span');span.textContent=k;span.className='keyword';keys.appendChild(span)});
  [...steps.children].forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-current',i===index?'step':'false')});
  $('prev').disabled=index===0;$('next').disabled=index===sections.length-1;
}
$('prev').addEventListener('click',()=>render(Math.max(0,active-1)));
$('next').addEventListener('click',()=>render(Math.min(sections.length-1,active+1)));
render(0);
