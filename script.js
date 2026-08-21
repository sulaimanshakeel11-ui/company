const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const revealItems = document.querySelectorAll(".reveal");
const projectCards = document.querySelectorAll(".project-card, .case-study-card");
const magneticItems = document.querySelectorAll(".magnetic");
const faqItems = document.querySelectorAll(".faq-item");
const dropdowns = document.querySelectorAll("[data-dropdown]");
const choiceGroups = document.querySelectorAll("[data-choice-group]");
const roleGroups = document.querySelectorAll("[data-role-group]");
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

mobileNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    header.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
  }
});

const closeDropdown = (dropdown) => {
  dropdown.classList.remove("is-open");
  dropdown.querySelector("[data-dropdown-toggle]")?.setAttribute("aria-expanded", "false");
};

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector("[data-dropdown-toggle]");
  const menu = dropdown.querySelector("[data-dropdown-menu]");
  const menuLinks = menu ? Array.from(menu.querySelectorAll("a")) : [];

  toggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));

    dropdowns.forEach((otherDropdown) => {
      if (otherDropdown !== dropdown) closeDropdown(otherDropdown);
    });
  });

  toggle?.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    dropdown.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    menuLinks[0]?.focus();
  });

  menu?.addEventListener("keydown", (event) => {
    const activeIndex = menuLinks.indexOf(document.activeElement);

    if (event.key === "Escape") {
      closeDropdown(dropdown);
      toggle?.focus();
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      menuLinks[(activeIndex + 1) % menuLinks.length]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      menuLinks[(activeIndex - 1 + menuLinks.length) % menuLinks.length]?.focus();
    }
  });

  dropdown.addEventListener("focusout", (event) => {
    if (!dropdown.contains(event.relatedTarget)) closeDropdown(dropdown);
  });
});

document.addEventListener("click", (event) => {
  dropdowns.forEach((dropdown) => {
    if (!dropdown.contains(event.target)) closeDropdown(dropdown);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") dropdowns.forEach(closeDropdown);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (supportsFinePointer) {
  projectCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--x", `${x}%`);
      card.style.setProperty("--y", `${y}%`);
    });
  });

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });

    item.addEventListener("pointerleave", () => {
      item.style.transform = "";
    });
  });
}

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

choiceGroups.forEach((group) => {
  const buttons = group.querySelectorAll("[data-choice]");
  const result = group.parentElement?.querySelector("[data-choice-result]");

  buttons.forEach((button, index) => {
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");

    button.addEventListener("click", () => {
      buttons.forEach((otherButton) => {
        otherButton.classList.toggle("is-active", otherButton === button);
        otherButton.setAttribute("aria-pressed", String(otherButton === button));
      });

      if (result) {
        result.innerHTML = `Recommended service: <strong>${button.dataset.choice}</strong>`;
      }
    });
  });
});

const roleCopy = {
  Administrator: "Overview screens, user management, settings, approvals, and system-level activity.",
  "Staff member": "Task lists, assigned records, updates, notes, and operational actions.",
  Teacher: "Class activity, attendance, assignments, exam records, file sharing, and student progress.",
  Student: "Upcoming tasks, exams, attendance, fees, shared files, and personal academic status.",
  Customer: "Requests, account information, saved details, status updates, and support actions.",
  Manager: "Team activity, summaries, approvals, filtered records, and priority workflows."
};

roleGroups.forEach((group) => {
  const tabs = group.querySelectorAll("[data-role]");
  const title = group.querySelector("[data-role-title]");
  const copy = group.querySelector("[data-role-copy]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((otherTab) => {
        otherTab.classList.toggle("is-active", otherTab === tab);
        otherTab.setAttribute("aria-selected", String(otherTab === tab));
      });

      const role = tab.dataset.role || "Administrator";
      if (title) title.textContent = role;
      if (copy) copy.textContent = roleCopy[role] || roleCopy.Administrator;
    });
  });
});
