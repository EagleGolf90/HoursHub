(() => {
  "use strict";

  const categories = [
    "General",
    "Corporate Office",
    "Retail Branch",
    "Healthcare",
    "Insurance",
  ];
  const categoryFor = (id) => categories[id - 1] || "General";
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const seedLocations = [
    {
      id: 1,
      name: "Main Office",
      categoryId: 2,
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      zip_code: "10001",
      regularHours: [
        ["Monday", "09:00", "18:00"],
        ["Tuesday", "09:00", "18:00"],
        ["Wednesday", "09:00", "18:00"],
        ["Thursday", "09:00", "18:00"],
        ["Friday", "09:00", "20:00"],
        ["Saturday", "10:00", "16:00"],
        ["Sunday", null, null],
      ].map(([day, open_time, close_time]) => ({
        day,
        open_time,
        close_time,
        is_closed: !open_time,
      })),
      timeSlots: [
        {
          id: 1,
          day_of_week: "Monday",
          slot_number: 1,
          open_time: "09:00",
          close_time: "12:00",
          break_start: null,
          break_end: null,
        },
        {
          id: 2,
          day_of_week: "Monday",
          slot_number: 2,
          open_time: "13:00",
          close_time: "18:00",
          break_start: "12:00",
          break_end: "13:00",
        },
      ],
      holidays: [
        {
          id: 1,
          holiday_date: "2025-01-01",
          holiday_name: "New Year Day",
          is_closed: true,
        },
        {
          id: 2,
          holiday_date: "2025-12-25",
          holiday_name: "Christmas Day",
          is_closed: true,
        },
      ],
    },
    {
      id: 2,
      name: "Downtown Branch",
      categoryId: 3,
      address: "456 Park Avenue",
      city: "New York",
      state: "NY",
      zip_code: "10022",
      regularHours: [
        ["Monday", "08:00", "17:00"],
        ["Tuesday", "08:00", "17:00"],
        ["Wednesday", "08:00", "17:00"],
        ["Thursday", "08:00", "17:00"],
        ["Friday", "08:00", "19:00"],
        ["Saturday", null, null],
        ["Sunday", null, null],
      ].map(([day, open_time, close_time]) => ({
        day,
        open_time,
        close_time,
        is_closed: !open_time,
      })),
      timeSlots: [],
      holidays: [
        {
          id: 3,
          holiday_date: "2025-12-25",
          holiday_name: "Christmas Day",
          is_closed: true,
        },
        {
          id: 4,
          holiday_date: "2025-07-04",
          holiday_name: "Independence Day",
          is_closed: true,
        },
      ],
    },
    {
      id: 3,
      name: "Humana, Inc",
      categoryId: 4,
      address: "101 S 5th Street",
      city: "Louisville",
      state: "KY",
      zip_code: "40202",
      regularHours: days.map((day) => ({
        day,
        open_time: "06:00",
        close_time: "20:00",
        is_closed: false,
      })),
      timeSlots: [],
      holidays: [],
    },
    {
      id: 4,
      name: "CKL Insurance & Financial Services, Inc",
      categoryId: 5,
      address: "2821 S Hurstbourne Pkwy",
      city: "Louisville",
      state: "KY",
      zip_code: "40220",
      regularHours: days.map((day) => ({
        day,
        open_time: ["Saturday", "Sunday"].includes(day) ? null : "08:00",
        close_time: ["Saturday", "Sunday"].includes(day) ? null : "17:00",
        is_closed: ["Saturday", "Sunday"].includes(day),
      })),
      timeSlots: [],
      holidays: [],
    },
    {
      id: 5,
      name: "Heritage Insurance Service",
      categoryId: 5,
      address: "908 Lily Creek Rd Ste 201",
      city: "Louisville",
      state: "KY",
      zip_code: "40243",
      regularHours: days.map((day) => ({
        day,
        open_time: "09:00",
        close_time: "17:00",
        is_closed: false,
      })),
      timeSlots: [],
      holidays: [],
    },
  ];
  const storeKey = "hoursHub.locations";
  let locations =
    JSON.parse(localStorage.getItem(storeKey) || "null") ||
    structuredClone(seedLocations);
  const root = document.getElementById("root");

  const escape = (value = "") =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const time = (value) =>
    value
      ? new Date(`1970-01-01T${value}`).toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })
      : "Closed";
  const save = () => localStorage.setItem(storeKey, JSON.stringify(locations));
  const link = (hash, label, className = "") =>
    `<a href="#${hash}" class="${className}">${label}</a>`;

  function layout(content) {
    root.innerHTML = `<nav class="app-nav"><div class="nav-container"><h1 class="app-title">Hours Hub</h1><div class="nav-actions"><div class="nav-buttons" role="navigation" aria-label="Primary">${link("/businesses", "Business", "nav-link")}</div>${link("/manage", "Manage Hours", "nav-cta")}</div></div></nav><main class="app-container">${content}</main>`;
  }

  function directory() {
    const filterButtons = ["all", ...categories]
      .map(
        (category) =>
          `<button class="filter-chip${category === "all" ? " active" : ""}" data-category="${escape(category)}">${category === "all" ? "All Categories" : escape(category)}</button>`,
      )
      .join("");
    layout(
      `<section class="business-directory"><header class="directory-hero"><p class="eyebrow">Business Directory</p><h2>Choose a business name</h2><p class="directory-copy">Select a business to see its hours, address, holiday exceptions, and time slots.</p></header><div class="directory-filters" aria-label="Category filters">${filterButtons}</div><div class="business-name-list" role="list" id="business-list"></div></section>`,
    );
    const draw = (category) => {
      const matches = locations.filter(
        (location) =>
          category === "all" || categoryFor(location.categoryId) === category,
      );
      document.getElementById("business-list").innerHTML = matches.length
        ? matches
            .map((location) =>
              link(
                `/businesses/${location.id}`,
                escape(location.name),
                "business-name-card",
              ),
            )
            .join("")
        : '<div class="directory-feedback">No business names match the selected category.</div>';
    };
    draw("all");
    document.querySelectorAll("[data-category]").forEach((button) =>
      button.addEventListener("click", () => {
        document
          .querySelectorAll("[data-category]")
          .forEach((item) => item.classList.toggle("active", item === button));
        draw(button.dataset.category);
      }),
    );
  }

  function isOpen(location, now) {
    const holiday = location.holidays.find(
      (item) =>
        item.holiday_date === now.toISOString().slice(0, 10) && item.is_closed,
    );
    const today = location.regularHours.find(
      (item) =>
        item.day ===
        [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][now.getDay()],
    );
    if (holiday || !today || today.is_closed) return false;
    const current = now.getHours() * 60 + now.getMinutes();
    const minutes = (value) =>
      value
        .split(":")
        .reduce(
          (total, part, index) => total + Number(part) * (index ? 1 : 60),
          0,
        );
    return (
      current >= minutes(today.open_time) && current < minutes(today.close_time)
    );
  }

  function details(id) {
    const location = locations.find((item) => item.id === Number(id));
    if (!location) {
      directory();
      return;
    }
    const now = new Date();
    const open = isOpen(location, now);
    const schedule = location.regularHours
      .map(
        (item) =>
          `<tr class="day-row${item.day === ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][now.getDay()] ? " today" : ""}"><td class="day-name">${item.day}</td><td class="day-hours">${item.is_closed ? "Closed" : `${time(item.open_time)} - ${time(item.close_time)}`}</td></tr>`,
      )
      .join("");
    const slots = location.timeSlots.length
      ? `<div class="time-slots content-card"><h3>Multiple Time Slots</h3>${location.timeSlots.map((slot) => `<div class="slot-item"><span class="slot-time">${escape(slot.day_of_week)}: ${time(slot.open_time)} - ${time(slot.close_time)}</span>${slot.break_start ? `<span class="slot-break">Break: ${time(slot.break_start)} - ${time(slot.break_end)}</span>` : ""}</div>`).join("")}</div>`
      : "";
    const holidays = location.holidays.length
      ? `<div class="holidays content-card"><h3>Holiday Exceptions</h3><table class="holidays-table"><tbody>${location.holidays.map((holiday) => `<tr><td class="holiday-date">${new Date(`${holiday.holiday_date}T00:00:00`).toLocaleDateString()}</td><td class="holiday-name">${escape(holiday.holiday_name)}</td><td class="holiday-status"><span class="${holiday.is_closed ? "closed-badge" : "open-badge"}">${holiday.is_closed ? "Closed" : "Open"}</span></td></tr>`).join("")}</tbody></table></div>`
      : "";
    layout(
      `<div class="business-hours-container"><div class="business-detail-shell"><div class="detail-topbar">${link("/businesses", "Back to business names", "back-link")}<span class="category-pill">${escape(categoryFor(location.categoryId))}</span></div><div class="location-info"><h2>${escape(location.name)}</h2><p class="address">${escape(location.address)}, ${escape(location.city)}, ${escape(location.state)} ${escape(location.zip_code)}</p></div><div class="status-card ${open ? "open" : "closed"}"><div class="status-indicator"><div class="status-light ${open ? "open" : "closed"}"></div><h1 class="status-text">${open ? "Open right now" : "Closed right now"}</h1></div><div class="current-time">${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div></div><div class="hours-schedule"><h3>Regular Hours</h3><table class="hours-table"><tbody>${schedule}</tbody></table></div>${slots}${holidays}</div></div>`,
    );
  }

  function manager() {
    const rows = locations
      .map(
        (location) =>
          `<tr><td>${escape(location.name)}</td><td>${escape(categoryFor(location.categoryId))}</td><td>${escape(location.city)}, ${escape(location.state)}</td><td class="actions"><button data-edit="${location.id}">Edit</button><button data-delete="${location.id}">Delete</button></td></tr>`,
      )
      .join("");
    layout(
      `<section class="business-hours-manager"><div class="manager-header"><div><p class="eyebrow">Administration</p><h2>Business locations</h2></div><button id="add-location">Add location</button></div><div class="location-list"><table><thead><tr><th>Name</th><th>Category</th><th>Location</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div></section>`,
    );
    document
      .getElementById("add-location")
      .addEventListener("click", () => form());
    document
      .querySelectorAll("[data-edit]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          form(Number(button.dataset.edit)),
        ),
      );
    document.querySelectorAll("[data-delete]").forEach((button) =>
      button.addEventListener("click", () => {
        const id = Number(button.dataset.delete);
        const location = locations.find((item) => item.id === id);
        if (confirm(`Delete ${location.name}?`)) {
          locations = locations.filter((item) => item.id !== id);
          save();
          manager();
        }
      }),
    );
  }

  function form(id) {
    const existing = locations.find((item) => item.id === id);
    const location = existing || {
      name: "",
      categoryId: 1,
      address: "",
      city: "",
      state: "",
      zip_code: "",
      regularHours: days.map((day) => ({
        day,
        open_time: "09:00",
        close_time: "17:00",
        is_closed: day === "Sunday",
      })),
      timeSlots: [],
      holidays: [],
    };
    const options = categories
      .map(
        (category, index) =>
          `<option value="${index + 1}"${location.categoryId === index + 1 ? " selected" : ""}>${category}</option>`,
      )
      .join("");
    const hours = location.regularHours
      .map(
        (item) =>
          `<div class="hours-row"><label>${item.day}<input type="checkbox" name="closed-${item.day}"${item.is_closed ? " checked" : ""}> Closed</label><input type="time" name="open-${item.day}" value="${item.open_time || ""}"><input type="time" name="close-${item.day}" value="${item.close_time || ""}"></div>`,
      )
      .join("");
    layout(
      `<section class="location-form"><div class="form-header"><h2>${existing ? "Edit Location" : "Add New Location"}</h2>${link("/manage", "Back", "back-link")}</div><form id="location-form"><div class="form-grid"><label>Business name<input required name="name" value="${escape(location.name)}"></label><label>Category<select name="categoryId">${options}</select></label><label>Address<input required name="address" value="${escape(location.address)}"></label><label>City<input required name="city" value="${escape(location.city)}"></label><label>State<input required maxlength="2" name="state" value="${escape(location.state)}"></label><label>ZIP code<input required name="zip_code" value="${escape(location.zip_code)}"></label></div><h3>Regular Hours</h3><div class="regular-hours">${hours}</div><div class="form-actions"><button type="submit">Save location</button><button type="button" id="cancel-form">Cancel</button></div></form></section>`,
    );
    document.getElementById("cancel-form").addEventListener("click", manager);
    document
      .getElementById("location-form")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const result = {
          ...location,
          ...Object.fromEntries(
            ["name", "address", "city", "state", "zip_code"].map((key) => [
              key,
              data.get(key).trim(),
            ]),
          ),
          categoryId: Number(data.get("categoryId")),
        };
        result.regularHours = days.map((day) => {
          const is_closed = data.get(`closed-${day}`) === "on";
          return {
            day,
            is_closed,
            open_time: is_closed ? null : data.get(`open-${day}`),
            close_time: is_closed ? null : data.get(`close-${day}`),
          };
        });
        if (existing) {
          locations = locations.map((item) =>
            item.id === existing.id ? result : item,
          );
        } else {
          result.id = Math.max(0, ...locations.map((item) => item.id)) + 1;
          locations.push(result);
        }
        save();
        manager();
      });
  }

  function route() {
    const parts = (location.hash.slice(1) || "/businesses")
      .split("/")
      .filter(Boolean);
    if (parts[0] === "manage") manager();
    else if (parts[0] === "businesses" && parts[1]) details(parts[1]);
    else directory();
  }
  window.addEventListener("hashchange", route);
  route();
})();
