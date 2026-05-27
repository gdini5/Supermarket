/**
 * marketplace-forms.js
 * Validações reutilizáveis para todos os formulários do Marketplace.
 * Incluir com: <script src="/javascripts/marketplace-forms.js"></script>
 */
const MarketplaceForms = (() => {
  const REGEX = {
    name: /^[a-zA-ZÀ-ÿ\s\-']+$/,
    email: /^[^\s@]+@[a-zA-Z]+(\.[a-zA-Z]+)+$/,
    phone: /^[9][1236]\d{7}$/,
  };

  function setMsg(msgId, input, type, text) {
    const el = document.getElementById(msgId);
    if (!el) return;
    el.textContent = text;
    el.className = "field-msg" + (text ? " " + type : "");
    if (input) {
      input.classList.remove("input-valid", "input-invalid");
      if (type === "ok") input.classList.add("input-valid");
      if (type === "err") input.classList.add("input-invalid");
    }
  }

  function passwordStrength(pw) {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  }

  function validateName(input, msgId) {
    const v = input.value.trim();
    if (!v) {
      setMsg(msgId, input, "err", "✕ Campo obrigatório");
      return false;
    }
    if (v.length < 3) {
      setMsg(msgId, input, "err", "✕ Nome demasiado curto");
      return false;
    }
    if (!REGEX.name.test(v)) {
      setMsg(msgId, input, "err", "✕ O nome só pode conter letras");
      return false;
    }
    setMsg(msgId, input, "ok", "✓ Nome válido");
    return true;
  }

  function validateEmail(input, msgId) {
    const v = input.value.trim();
    if (!v) {
      setMsg(msgId, input, "err", "✕ Campo obrigatório");
      return false;
    }
    if (!REGEX.email.test(v)) {
      setMsg(msgId, input, "err", "✕ Formato inválido (ex: a@b.pt)");
      return false;
    }
    setMsg(msgId, input, "ok", "✓ Email válido");
    return true;
  }

  function validatePhone(input, msgId) {
    const v = input.value.trim();
    if (!v) {
      setMsg(msgId, input, "err", "✕ Campo obrigatório");
      return false;
    }
    if (!REGEX.phone.test(v)) {
      setMsg(msgId, input, "err", "✕ Número inválido (ex: 912345678)");
      return false;
    }
    setMsg(msgId, input, "ok", "✓ Número válido");
    return true;
  }

  function validateRequired(input, msgId, label) {
    if (!input.value.trim()) {
      setMsg(msgId, input, "err", "✕ " + (label || "Campo obrigatório"));
      return false;
    }
    setMsg(msgId, input, "ok", "✓");
    return true;
  }

  function validatePassword(input, msgId, barId, labelId) {
    const pw = input.value;
    if (!pw) {
      setMsg(msgId, input, "err", "✕ Campo obrigatório");
      return false;
    }
    if (pw.length < 6) {
      setMsg(msgId, input, "err", "✕ Mínimo 6 caracteres");
    } else {
      setMsg(msgId, input, "ok", "✓ Password aceite");
    }
    if (barId) {
      const bar = document.getElementById(barId);
      if (bar)
        bar.className =
          "strength-bar" + (pw ? " s" + passwordStrength(pw) : "");
    }
    if (labelId) {
      const lbl = document.getElementById(labelId);
      const labels = ["", "Muito fraca", "Fraca", "Razoável", "Forte"];
      if (lbl)
        lbl.textContent = pw
          ? "Força: " + (labels[passwordStrength(pw)] || "Muito fraca")
          : "";
    }
    return pw.length >= 6;
  }

  function validatePasswordConfirm(pwInput, confirmInput, msgId) {
    if (!confirmInput.value) {
      setMsg(msgId, confirmInput, "err", "✕ Campo obrigatório");
      return false;
    }
    if (pwInput.value !== confirmInput.value) {
      setMsg(msgId, confirmInput, "err", "✕ Passwords não coincidem");
      return false;
    }
    setMsg(msgId, confirmInput, "ok", "✓ Passwords coincidem");
    return true;
  }

  function initPasswordToggles() {
    document.querySelectorAll(".toggle-pw").forEach((btn) => {
      btn.addEventListener("click", () => {
        const t = document.getElementById(btn.dataset.target);
        if (!t) return;
        t.type = t.type === "text" ? "password" : "text";
        btn.textContent = t.type === "text" ? "🙈" : "👁";
      });
    });
  }

  return {
    REGEX,
    setMsg,
    passwordStrength,
    validateName,
    validateEmail,
    validatePhone,
    validateRequired,
    validatePassword,
    validatePasswordConfirm,
    initPasswordToggles,
  };
})();
