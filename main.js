/* Service Business Template — main.js
   Mobile nav, dropdowns, scroll reveal, FAQ accordion, header state. */

(function () {
  "use strict";

  // --- Header scrolled state ---
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // --- Mobile nav toggle ---
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // --- Dropdowns: click-to-open on touch/mobile ---
  var mq = window.matchMedia("(max-width: 1020px)");
  document.querySelectorAll(".dropdown > a").forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (mq.matches) {
        e.preventDefault();
        var li = a.parentElement;
        var wasOpen = li.classList.contains("open");
        document.querySelectorAll(".dropdown.open").forEach(function (d) { d.classList.remove("open"); });
        if (!wasOpen) li.classList.add("open");
      }
    });
  });

  // --- Active nav link ---
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });

  // --- Scroll reveal ---
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
  }

  // --- FAQ accordion ---
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close siblings
      item.parentElement.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = null;
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  // --- Reviews: render newest-first from js/reviews-data.js ---
  var reviewsList = document.getElementById("reviews-list");
  if (reviewsList && window.REVIEWS && window.REVIEWS.length) {
    var STAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
    function esc(s) {
      var d = document.createElement("div");
      d.textContent = String(s == null ? "" : s);
      return d.innerHTML;
    }
    var sorted = window.REVIEWS.slice().sort(function (a, b) {
      return new Date(b.date) - new Date(a.date) || 0;
    });
    var max = parseInt(reviewsList.getAttribute("data-max") || "3", 10);
    sorted.slice(0, max).forEach(function (r, idx) {
      var stars = "";
      for (var s = 0; s < (r.rating || 5); s++) stars += STAR;
      var card = document.createElement("div");
      card.className = "card review-card reveal" + (idx ? " d" + Math.min(idx, 3) : "");
      var dateStr = "";
      var d = new Date(r.date);
      if (!isNaN(d)) dateStr = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      card.innerHTML =
        '<div class="stars" aria-label="' + (r.rating || 5) + ' star rating">' + stars + "</div>" +
        "<p>“" + esc(r.text) + "”</p>" +
        '<span class="who">— ' + esc(r.name) + (r.area ? ", " + esc(r.area) : "") + "</span>" +
        (dateStr ? '<span class="review-date">' + dateStr + "</span>" : "");
      reviewsList.appendChild(card);
      card.classList.add("visible");
    });
  }

  // --- Footer year ---
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
