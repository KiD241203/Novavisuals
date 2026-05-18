/* Password show/hide */
function togglePw(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  if (input.type === 'password') {
    input.type = 'text';
    icon.innerHTML = `
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>`;
  } else {
    input.type = 'password';
    icon.innerHTML = `
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>`;
  }
}

/* Password strength */
function checkStrength(val) {
  const bars   = [document.getElementById('sb1'),document.getElementById('sb2'),document.getElementById('sb3'),document.getElementById('sb4')];
  const label  = document.getElementById('strengthLabel');
  const levels = ['weak','fair','good','strong'];
  const labels = ['Too short','Fair — add numbers or symbols','Good — nearly there','Strong password'];
  const colors = ['weak','fair','good','strong'];

  let score = 0;
  if (val.length >= 8) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^a-zA-Z0-9]/.test(val)) score++;
  if (val.length >= 12) score++;

  bars.forEach((b,i) => {
    b.className = 'strength-bar';
    if (i < score && val.length > 0) b.classList.add(colors[score - 1]);
  });

  if (val.length === 0) {
    label.textContent = 'Use 8+ characters, numbers, and symbols.';
    label.style.color = 'rgba(255,255,255,0.28)';
  } else {
    label.textContent = labels[score - 1] || labels[0];
    label.style.color = score >= 3 ? 'rgba(122,184,138,0.7)' : score === 2 ? 'rgba(196,164,106,0.7)' : 'rgba(224,112,112,0.7)';
  }
  checkMatch();
}

/* Password match */
function checkMatch() {
  const p1   = document.getElementById('password1').value;
  const p2   = document.getElementById('password2').value;
  const hint = document.getElementById('matchHint');
  const inp  = document.getElementById('password2');
  if (!p2) { hint.style.display = 'none'; return; }
  hint.style.display = 'block';
  if (p1 === p2) {
    hint.textContent = 'Passwords match.';
    hint.className   = 'field-hint';
    hint.style.color = 'rgba(122,184,138,0.7)';
    inp.classList.remove('is-error');
  } else {
    hint.textContent = 'Passwords do not match.';
    hint.className   = 'field-hint error';
    inp.classList.add('is-error');
  }
}