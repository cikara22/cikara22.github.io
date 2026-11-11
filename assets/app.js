(function () {
  "use strict";

  function digits(value) {
    return value.replace(/\D/g, "");
  }

  function contactHref(kind, value, message, subject) {
    var m = encodeURIComponent(message);
    switch (kind) {
      case "phone": return "tel:+" + digits(value);
      case "viber": return "viber://chat?number=%2B" + digits(value) + "&draft=" + m;
      case "whatsapp": return "https://wa.me/" + digits(value) + "?text=" + m;
      case "messenger": return "https://m.me/" + encodeURIComponent(value) + "?text=" + m;
      case "email": return "mailto:" + value + "?subject=" + encodeURIComponent(subject) + "&body=" + m;
    }
    return "#";
  }

  var box = document.querySelector(".contact-box");
  var select = document.getElementById("service-select");

  function updateContactLinks(service) {
    if (!box) return;
    var message = box.dataset.template.replace("{service}", service);
    box.querySelectorAll("[data-kind]").forEach(function (link) {
      link.href = contactHref(link.dataset.kind, link.dataset.value, message, box.dataset.subject);
    });
  }

  if (select) {
    select.addEventListener("change", function () { updateContactLinks(select.value); });
  }

  document.querySelectorAll("[data-service]").forEach(function (link) {
    link.addEventListener("click", function () {
      var service = link.dataset.service;
      if (select) select.value = service;
      updateContactLinks(service);
    });
  });

  var filters = document.querySelectorAll(".filters .chip");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));

  filters.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var cat = chip.dataset.filter;
      filters.forEach(function (c) { c.classList.toggle("is-active", c === chip); });
      items.forEach(function (item) { item.hidden = cat !== "*" && item.dataset.cat !== cat; });
    });
  });

  var dialog = document.querySelector(".lightbox");
  if (!dialog || typeof dialog.showModal !== "function") return;
  var img = dialog.querySelector("img");
  var caption = dialog.querySelector("figcaption");
  var current = 0;

  function visibleItems() {
    return items.filter(function (item) { return !item.hidden; });
  }

  function show(index) {
    var list = visibleItems();
    if (!list.length) return;
    current = (index + list.length) % list.length;
    img.src = list[current].dataset.src;
    img.alt = list[current].dataset.caption;
    caption.textContent = list[current].dataset.caption;
  }

  items.forEach(function (item) {
    item.addEventListener("click", function () {
      show(visibleItems().indexOf(item));
      dialog.showModal();
    });
  });

  dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });
  dialog.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
  dialog.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
  dialog.addEventListener("click", function (event) { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  });
})();
