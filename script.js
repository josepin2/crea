/* ==========================================================================
   crea — página web
   Comportamiento: tema claro/oscuro, menú móvil, copiar comando,
   cabecera al hacer scroll, animaciones de aparición y sección activa.
   Sin dependencias: todo con APIs del navegador.
   ========================================================================== */
(function () {
  "use strict";

  /* Quitamos la marca de "sin JavaScript" cuanto antes. */
  document.documentElement.classList.remove("no-js");

  var root = document.documentElement;
  var header = document.querySelector(".site-header");
  var nav = document.getElementById("navMenu");
  var navToggle = document.getElementById("navToggle");
  var themeToggle = document.getElementById("themeToggle");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var MOBILE = 820;

  /* ------------------------------ Tema ---------------------------------- */
  function storedTheme() {
    try {
      return window.localStorage.getItem("crea-theme");
    } catch (error) {
      return null;
    }
  }

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  /* Permite forzar el tema desde la URL: index.html?tema=oscuro  (o ?tema=claro) */
  function queryTheme() {
    try {
      var value = new URLSearchParams(window.location.search).get("tema");
      if (value === "oscuro") return "dark";
      if (value === "claro") return "light";
    } catch (error) {
      /* navegador antiguo sin URLSearchParams */
    }
    return null;
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "light" ? "#f6f8fc" : "#0a0f1a");
    }
    if (themeToggle) {
      var next = theme === "dark" ? "claro" : "oscuro";
      themeToggle.setAttribute("aria-label", "Cambiar al tema " + next);
      themeToggle.setAttribute("title", "Cambiar al tema " + next);
    }
  }

  applyTheme(queryTheme() || storedTheme() || systemTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        window.localStorage.setItem("crea-theme", next);
      } catch (error) {
        /* modo privado: se queda solo en esta visita */
      }
    });
  }

  /* ------------------------------ Menú móvil ---------------------------- */
  function setMenu(open) {
    if (!nav || !navToggle) return;
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute(
      "aria-label",
      open ? "Cerrar menú de navegación" : "Abrir menú de navegación"
    );
  }

  function menuIsOpen() {
    return !!(nav && nav.classList.contains("is-open"));
  }

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setMenu(!menuIsOpen());
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      var link = event.target.closest("a");
      if (link) setMenu(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuIsOpen()) {
      setMenu(false);
      if (navToggle) navToggle.focus();
    }
  });

  document.addEventListener("click", function (event) {
    if (!menuIsOpen()) return;
    if (nav && nav.contains(event.target)) return;
    if (navToggle && navToggle.contains(event.target)) return;
    setMenu(false);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > MOBILE && menuIsOpen()) setMenu(false);
  });

  /* --------------------------- Cabecera al scroll ----------------------- */
  var lastScrollState = null;

  function checkScroll() {
    var scrolled = window.scrollY > 8;
    if (header && scrolled !== lastScrollState) {
      header.classList.toggle("is-scrolled", scrolled);
      lastScrollState = scrolled;
    }
  }

  checkScroll();
  window.addEventListener("scroll", checkScroll, { passive: true });

  /* ------------------------------ Copiar -------------------------------- */
  /* Hay varios botones de copiar (el comando «crea» y «crea --actualizar»). */
  Array.prototype.forEach.call(document.querySelectorAll(".copy-btn"), function (button) {
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy") || "crea";
      var original = button.textContent;

      function done(ok) {
        button.textContent = ok ? "¡Copiado!" : "Cópialo a mano";
        button.classList.toggle("is-copied", ok);
        window.setTimeout(function () {
          button.textContent = original;
          button.classList.remove("is-copied");
        }, 1900);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { done(true); },
          function () { done(false); }
        );
        return;
      }

      try {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.top = "-1000px";
        document.body.appendChild(area);
        area.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(area);
        done(ok);
      } catch (error) {
        done(false);
      }
    });
  });

  /* --------------------- Aparición al hacer scroll ---------------------- */
  var revealItems = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  function revealNow() {
    if (!revealItems.length) return;

    var limit = window.innerHeight + 80;
    revealItems = revealItems.filter(function (item) {
      if (item.getBoundingClientRect().top < limit) {
        item.classList.add("is-visible");
        return false;
      }
      return true;
    });
  }

  if (reduceMotion) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    revealItems = [];
  } else {
    revealItems.forEach(function (item, index) {
      item.style.transitionDelay = Math.min(index % 3, 2) * 60 + "ms";
    });
    revealNow();
    window.addEventListener("scroll", revealNow, { passive: true });
    window.addEventListener("resize", revealNow);
  }

  /* -------------------------- Sección activa ---------------------------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-list a"));
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
    });
  }

  /* Se recalcula directamente en cada evento: son seis rectángulos y el navegador
     ya limita los eventos de scroll a uno por fotograma. Sin timers ni rAF, para
     que funcione igual en cualquier navegador embebido. */
  function updateSpy() {
    if (!sections.length) return;

    var line = window.scrollY + Math.min(window.innerHeight * 0.35, 340);
    var current = sections[0];

    sections.forEach(function (section) {
      var top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= line) current = section;
    });

    setActive(current.id);
  }

  window.addEventListener("scroll", updateSpy, { passive: true });
  window.addEventListener("resize", updateSpy);
  updateSpy();

  /* Red de seguridad: algunos navegadores embebidos no entregan bien los eventos
     de scroll. Revisar seis rectángulos cada medio segundo no cuesta nada. */
  window.setInterval(function () {
    if (document.hidden) return;
    revealNow();
    updateSpy();
  }, 500);
})();
