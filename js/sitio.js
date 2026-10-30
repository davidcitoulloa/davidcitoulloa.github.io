(function () {
  var html = document.documentElement;
  var quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var tactil = window.matchMedia("(hover: none)").matches;

  var nombre = document.querySelector(".nombre");
  var partes = nombre.querySelectorAll("span");
  function ajustarNombre() {
    nombre.style.fontSize = "100px";
    var ancho = nombre.clientWidth;
    var apilado = window.innerWidth <= 700;
    var a = partes[0].getBoundingClientRect().width;
    var b = partes[1].getBoundingClientRect().width;
    var gap = apilado ? 0 : parseFloat(getComputedStyle(partes[1]).marginLeft);
    var total = apilado ? Math.max(a, b) : a + b + gap;
    nombre.style.fontSize = Math.floor((ancho / total) * 100 * 0.965) + "px";
  }
  var hablemos = document.querySelector(".hablemos-t");
  var hablemosTxt = hablemos.querySelector(".linea > span");
  function ajustarHablemos() {
    hablemos.style.fontSize = "100px";
    hablemosTxt.style.width = "max-content";
    var w = hablemosTxt.getBoundingClientRect().width;
    hablemosTxt.style.width = "";
    hablemos.style.fontSize = Math.floor((hablemos.clientWidth / w) * 100 * 0.965) + "px";
  }
  function ajustar() { ajustarNombre(); ajustarHablemos(); }
  ajustar();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustar);
  window.addEventListener("resize", ajustar);

  var pre = document.getElementById("pre");
  var hecho = false;
  function terminar() {
    if (hecho) return;
    hecho = true;
    pre.classList.add("fuera");
    html.classList.add("listo");
    setTimeout(function () { pre.hidden = true; }, 800);
  }
  if (quieto) {
    pre.hidden = true;
    html.classList.add("listo");
  } else {
    var n = document.getElementById("pre-n");
    var t0 = performance.now();
    var dur = 950;
    (function paso(t) {
      if (hecho) return;
      var p = Math.min(1, (t - t0) / dur);
      n.textContent = Math.round(p * 100);
      if (p < 1) requestAnimationFrame(paso); else setTimeout(terminar, 180);
    })(t0);
    pre.addEventListener("click", terminar);
    window.addEventListener("keydown", terminar, { once: true });
    window.addEventListener("wheel", terminar, { once: true, passive: true });
    window.addEventListener("touchstart", terminar, { once: true, passive: true });
  }

  var revelar = document.querySelectorAll(".revela, .poster");
  if ("IntersectionObserver" in window && !quieto) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visto"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    [].forEach.call(revelar, function (el) { io.observe(el); });
  } else {
    [].forEach.call(revelar, function (el) { el.classList.add("visto"); });
  }

  if (tactil && "IntersectionObserver" in window && !quieto) {
    var activo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle("activa", e.isIntersecting); });
    }, { threshold: 0.6 });
    [].forEach.call(document.querySelectorAll(".oficio"), function (el) { activo.observe(el); });
  }

  var tonos = document.querySelectorAll(".tono");
  [].forEach.call(tonos, function (b) {
    b.addEventListener("click", function () {
      var t = b.getAttribute("data-tono");
      html.setAttribute("data-tono", t);
      [].forEach.call(tonos, function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
    });
  });

  if (!tactil && !quieto) {
    [["#sello", 14, "#inicio"]].forEach(function (c) {
      var el = document.querySelector(c[0]);
      var zona = c[2] ? document.querySelector(c[2]) : el.parentElement;
      zona.addEventListener("pointermove", function (ev) {
        var r = (c[2] ? el : zona).getBoundingClientRect();
        var x = (ev.clientX - (r.left + r.width / 2)) / (c[2] ? window.innerWidth / 2 : r.width / 2);
        var y = (ev.clientY - (r.top + r.height / 2)) / (c[2] ? window.innerHeight / 2 : r.height / 2);
        x = Math.max(-1, Math.min(1, x));
        y = Math.max(-1, Math.min(1, y));
        el.style.setProperty("--ry", (x * c[1]).toFixed(2) + "deg");
        el.style.setProperty("--rx", (-y * c[1]).toFixed(2) + "deg");
      });
      zona.addEventListener("pointerleave", function () {
        el.style.setProperty("--ry", "0deg");
        el.style.setProperty("--rx", "0deg");
      });
    });
  }

  var pildora = document.getElementById("pildora");
  if ("IntersectionObserver" in window) {
    var arriba = true, abajo = false;
    var pintar = function () { pildora.classList.toggle("ver", !arriba && !abajo); };
    new IntersectionObserver(function (es) { arriba = es[0].isIntersecting; pintar(); }).observe(document.getElementById("inicio"));
    new IntersectionObserver(function (es) { abajo = es[0].isIntersecting; pintar(); }, { threshold: 0.25 }).observe(document.getElementById("hablemos"));
  }
})();
