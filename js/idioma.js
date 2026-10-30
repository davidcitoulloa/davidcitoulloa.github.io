(function () {
  var KEY = "idioma-du";
  var btn = document.getElementById("idioma");
  var html = document.documentElement;
  var meta = {
    es: "Soy David Ulloa. Comunico, canto, creo y construyo cosas para acercar la Biblia a más personas, con Cristo en el centro.",
    en: "I'm David Ulloa. I communicate, sing, create and build things to bring the Bible closer to more people, with Christ at the center."
  };
  var textos = [].slice.call(document.querySelectorAll("[data-en]"));
  textos.forEach(function (e) { e.setAttribute("data-es", e.textContent); });
  var attrs = [["data-en-alt", "alt"], ["data-en-aria-label", "aria-label"]];
  var conAttr = [];
  attrs.forEach(function (p) {
    [].forEach.call(document.querySelectorAll("[" + p[0] + "]"), function (e) {
      e.setAttribute(p[0].replace("-en-", "-es-"), e.getAttribute(p[1]));
      conAttr.push([e, p]);
    });
  });

  function aplicar(l) {
    html.lang = l;
    textos.forEach(function (e) { e.textContent = e.getAttribute(l === "en" ? "data-en" : "data-es"); });
    conAttr.forEach(function (x) {
      var nombre = l === "en" ? x[1][0] : x[1][0].replace("-en-", "-es-");
      x[0].setAttribute(x[1][1], x[0].getAttribute(nombre));
    });
    var d = document.querySelector('meta[name="description"]');
    if (d) d.setAttribute("content", meta[l]);
    btn.textContent = l === "en" ? "ES" : "EN";
  }

  var actual = "es";
  try {
    var g = localStorage.getItem(KEY);
    if (g === "en" || g === "es") actual = g;
  } catch (e) {}
  if (actual === "en") aplicar("en");

  btn.addEventListener("click", function () {
    actual = actual === "es" ? "en" : "es";
    aplicar(actual);
    try { localStorage.setItem(KEY, actual); } catch (e) {}
  });
})();
