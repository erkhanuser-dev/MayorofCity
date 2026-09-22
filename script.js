document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     СОСТОЯНИЕ ИГРЫ
  ========================= */

  const state = {
    turn: 1,
    money: 1200,
    debt: 0,

    metrics: {
      happiness: 60,
      ecology: 55,
      mobility: 50,
      education: 45,
      health: 50,
      economy: 55
    },

    projects: {},

    recentEvents: [],
    lastEventTurn: -99,

    news: [
      "Город просыпается. Жители ждут ваших решений.",
      "Акимат получил новый бюджет.",
      "Начинается первый рабочий месяц."
    ]
  };


  /* =========================
     ПРОЕКТЫ
  ========================= */

  const projects = [

    {
      id: "park",
      name: "Городской парк",
      icon: "🌳",
      desc: "Зелёная зона для жителей",
      cost: 90,
      income: 1,
      upkeep: 1,
      unlock: 1,
      effects: {
        happiness: 7,
        ecology: 8
      }
    },

    {
      id: "school",
      name: "Новая школа",
      icon: "🏫",
      desc: "Больше мест для учеников",
      cost: 130,
      income: 2,
      upkeep: 2,
      unlock: 1,
      effects: {
        happiness: 4,
        education: 10
      }
    },

    {
      id: "hospital",
      name: "Больница",
      icon: "🏥",
      desc: "Улучшает медицину",
      cost: 160,
      income: 1,
      upkeep: 3,
      unlock: 1,
      effects: {
        health: 12,
        happiness: 4
      }
    },

    {
      id: "metro",
      name: "Метро",
      icon: "🚇",
      desc: "Разгружает дороги",
      cost: 220,
      income: 5,
      upkeep: 4,
      unlock: 2,
      effects: {
        mobility: 15,
        happiness: 5,
        economy: 4
      }
    },

    {
      id: "recycling",
      name: "Экоцентр",
      icon: "♻️",
      desc: "Переработка отходов",
      cost: 150,
      income: 7,
      upkeep: 2,
      unlock: 2,
      effects: {
        ecology: 14,
        economy: 3
      }
    },

    {
      id: "solar",
      name: "Солнечная станция",
      icon: "☀️",
      desc: "Чистая энергия",
      cost: 250,
      income: 14,
      upkeep: 3,
      unlock: 3,
      effects: {
        ecology: 12,
        economy: 7
      }
    },

    {
      id: "market",
      name: "Городской рынок",
      icon: "🛍️",
      desc: "Новые рабочие места",
      cost: 180,
      income: 16,
      upkeep: 3,
      unlock: 3,
      effects: {
        economy: 12,
        happiness: 4
      }
    },

    {
      id: "housing",
      name: "Жилой комплекс",
      icon: "🏢",
      desc: "Новые квартиры",
      cost: 210,
      income: 7,
      upkeep: 3,
      unlock: 4,
      effects: {
        happiness: 7,
        economy: 7
      }
    },

    {
      id: "bike",
      name: "Велодорожки",
      icon: "🚲",
      desc: "Город становится удобнее",
      cost: 100,
      income: 0,
      upkeep: 1,
      unlock: 4,
      effects: {
        mobility: 9,
        ecology: 7,
        health: 4
      }
    },

    {
      id: "water",
      name: "Очистка воды",
      icon: "💧",
      desc: "Чистая вода для города",
      cost: 170,
      income: 3,
      upkeep: 2,
      unlock: 4,
      effects: {
        health: 7,
        ecology: 8,
        happiness: 4
      }
    },

    {
      id: "university",
      name: "Университет",
      icon: "🎓",
      desc: "Приток талантливой молодёжи",
      cost: 300,
      income: 12,
      upkeep: 5,
      unlock: 6,
      effects: {
        education: 17,
        economy: 9,
        happiness: 4
      }
    },

    {
      id: "stadium",
      name: "Стадион",
      icon: "🏟️",
      desc: "Спорт и большие события",
      cost: 260,
      income: 10,
      upkeep: 5,
      unlock: 8,
      effects: {
        happiness: 13,
        health: 7,
        economy: 5
      }
    },

    {
      id: "tourism",
      name: "Туристический центр",
      icon: "🎡",
      desc: "Гости приносят деньги",
      cost: 280,
      income: 18,
      upkeep: 4,
      unlock: 10,
      effects: {
        economy: 15,
        happiness: 8
      }
    }

  ];


  /* =========================
     СОБЫТИЯ
  ========================= */

  const events = [

    {
      id: "eco_crisis",
      tag: "ЭКОЛОГИЯ",
      icon: "🌫️",
      title: "Город накрыл смог",
      description:
        "Жители жалуются на качество воздуха. В социальных сетях требуют немедленных действий.",
      weight: s => s.metrics.ecology < 50 ? 6 : 2,

      choices: [
        {
          title: "Запустить срочную очистку",
          effect: "−45 млн ₸ · +10 экологии",
          apply: s => {
            s.money -= 45;
            change("ecology", 10);
          }
        },
        {
          title: "Ужесточить контроль предприятий",
          effect: "−20 млн ₸ · +6 экологии · −3 экономика",
          apply: s => {
            s.money -= 20;
            change("ecology", 6);
            change("economy", -3);
          }
        },
        {
          title: "Пока ничего не делать",
          effect: "+0 ₸ · −8 экологии · −6 счастья",
          apply: s => {
            change("ecology", -8);
            change("happiness", -6);
          }
        }
      ]
    },


    {
      id: "traffic",
      tag: "ТРАНСПОРТ",
      icon: "🚗",
      title: "Город встал в пробке",
      description:
        "Главные улицы перегружены. Жители опаздывают на работу и требуют решения.",
      weight: s => s.metrics.mobility < 50 ? 6 : 2,

      choices: [
        {
          title: "Выделить полосу для автобусов",
          effect: "−35 млн ₸ · +10 транспорта · +3 счастья",
          apply: s => {
            s.money -= 35;
            change("mobility", 10);
            change("happiness", 3);
          }
        },
        {
          title: "Организовать временные маршруты",
          effect: "−15 млн ₸ · +6 транспорта",
          apply: s => {
            s.money -= 15;
            change("mobility", 6);
          }
        },
        {
          title: "Ничего не менять",
          effect: "−8 транспорта · −5 счастья",
          apply: s => {
            change("mobility", -8);
            change("happiness", -5);
          }
        }
      ]
    },


    {
      id: "hospital_overload",
      tag: "ЗДОРОВЬЕ",
      icon: "🏥",
      title: "Больницы переполнены",
      description:
        "Количество обращений резко выросло. Врачи просят дополнительное финансирование.",
      weight: s => s.metrics.health < 50 ? 7 : 2,

      choices: [
        {
          title: "Открыть временное отделение",
          effect: "−55 млн ₸ · +12 здоровья",
          apply: s => {
            s.money -= 55;
            change("health", 12);
          }
        },
        {
          title: "Направить часть бюджета на профилактику",
          effect: "−30 млн ₸ · +7 здоровья · +2 счастья",
          apply: s => {
            s.money -= 30;
            change("health", 7);
            change("happiness", 2);
          }
        },
        {
          title: "Сократить расходы",
          effect: "−10 здоровья · −7 счастья",
          apply: s => {
            change("health", -10);
            change("happiness", -7);
          }
        }
      ]
    },


    {
      id: "financial",
      tag: "ФИНАНСЫ",
      icon: "📉",
      title: "Город столкнулся с дефицитом",
      description:
        "Расходы растут быстрее доходов. Нужно принять непопулярное финансовое решение.",
      weight: s => s.money < 400 ? 8 : 2,

      choices: [
        {
          title: "Взять стабилизационный кредит",
          effect: "+180 млн ₸ · долг 220 млн ₸",
          apply: s => {
            s.money += 180;
            s.debt += 220;
          }
        },
        {
          title: "Заморозить часть проектов",
          effect: "+70 млн ₸ · −5 счастья · −3 экономики",
          apply: s => {
            s.money += 70;
            change("happiness", -5);
            change("economy", -3);
          }
        },
        {
          title: "Поднять местные сборы",
          effect: "+90 млн ₸ · −8 счастья · +5 экономики",
          apply: s => {
            s.money += 90;
            change("happiness", -8);
            change("economy", 5);
          }
        }
      ]
    },


    {
      id: "public",
      tag: "ЖИТЕЛИ",
      icon: "📢",
      title: "Жители вышли на площадь",
      description:
        "Люди считают, что город развивается не так быстро, как обещала администрация.",
      weight: s => s.metrics.happiness < 48 ? 7 : 2,

      choices: [
        {
          title: "Провести открытый городской форум",
          effect: "−10 млн ₸ · +9 счастья",
          apply: s => {
            s.money -= 10;
            change("happiness", 9);
          }
        },
        {
          title: "Запустить программу благоустройства",
          effect: "−40 млн ₸ · +7 счастья · +3 экологии",
          apply: s => {
            s.money -= 40;
            change("happiness", 7);
            change("ecology", 3);
          }
        },
        {
          title: "Игнорировать протест",
          effect: "−12 счастья",
          apply: s => {
            change("happiness", -12);
          }
        }
      ]
    },


    {
      id: "flood",
      tag: "ЧС",
      icon: "🌧️",
      title: "Сильный ливень",
      description:
        "После ливня несколько районов затопило. Городская инфраструктура нуждается в помощи.",
      weight: s => s.metrics.ecology < 45 ? 4 : 2,

      choices: [
        {
          title: "Срочно откачать воду",
          effect: "−45 млн ₸ · +7 здоровья · +4 счастья",
          apply: s => {
            s.money -= 45;
            change("health", 7);
            change("happiness", 4);
          }
        },
        {
          title: "Построить систему ливневой канализации",
          effect: "−90 млн ₸ · +10 экологии · +6 здоровья",
          apply: s => {
            s.money -= 90;
            change("ecology", 10);
            change("health", 6);
          }
        },
        {
          title: "Разобраться позже",
          effect: "−8 здоровья · −8 счастья",
          apply: s => {
            change("health", -8);
            change("happiness", -8);
          }
        }
      ]
    },


    {
      id: "school",
      tag: "ОБРАЗОВАНИЕ",
      icon: "📚",
      title: "Школам не хватает мест",
      description:
        "Число школьников растёт. Родители требуют новые классы и современное оборудование.",
      weight: s => s.metrics.education < 50 ? 6 : 2,

      choices: [
        {
          title: "Расширить школы",
          effect: "−60 млн ₸ · +10 образования",
          apply: s => {
            s.money -= 60;
            change("education", 10);
          }
        },
        {
          title: "Создать цифровые классы",
          effect: "−35 млн ₸ · +7 образования · +2 экономики",
          apply: s => {
            s.money -= 35;
            change("education", 7);
            change("economy", 2);
          }
        },
        {
          title: "Отложить решение",
          effect: "−8 образования · −4 счастья",
          apply: s => {
            change("education", -8);
            change("happiness", -4);
          }
        }
      ]
    },


    {
      id: "power",
      tag: "ИНФРАСТРУКТУРА",
      icon: "⚡",
      title: "В городе отключился свет",
      description:
        "Несколько районов остались без электричества. Город ждёт реакции администрации.",
      weight: s => 3,

      choices: [
        {
          title: "Запустить резервные генераторы",
          effect: "−40 млн ₸ · +7 счастья · +5 здоровья",
          apply: s => {
            s.money -= 40;
            change("happiness", 7);
            change("health", 5);
          }
        },
        {
          title: "Ускорить переход на солнечную энергию",
          effect: "−70 млн ₸ · +8 экологии · +4 экономики",
          apply: s => {
            s.money -= 70;
            change("ecology", 8);
            change("economy", 4);
          }
        },
        {
          title: "Ждать восстановления",
          effect: "−9 счастья · −4 экономики",
          apply: s => {
            change("happiness", -9);
            change("economy", -4);
          }
        }
      ]
    },


    {
      id: "tourists",
      tag: "ВОЗМОЖНОСТЬ",
      icon: "🎒",
      title: "В город приехала волна туристов",
      description:
        "Город неожиданно стал популярным в соцсетях. Есть шанс заработать на туристическом потоке.",
      weight: s => s.metrics.economy > 55 ? 4 : 1,

      choices: [
        {
          title: "Провести городской фестиваль",
          effect: "−35 млн ₸ · +12 счастья · +7 экономики",
          apply: s => {
            s.money -= 35;
            change("happiness", 12);
            change("economy", 7);
          }
        },
        {
          title: "Продвигать город",
          effect: "−20 млн ₸ · +10 экономики",
          apply: s => {
            s.money -= 20;
            change("economy", 10);
          }
        },
        {
          title: "Ничего не делать",
          effect: "+20 млн ₸ · +2 экономики",
          apply: s => {
            s.money += 20;
            change("economy", 2);
          }
        }
      ]
    },


    {
      id: "investor",
      tag: "ЭКОНОМИКА",
      icon: "💼",
      title: "Инвестор хочет открыть завод",
      description:
        "Частная компания готова вложиться в город. Но проект повлияет на экологию.",
      weight: s => s.metrics.economy > 60 ? 5 : 1,

      choices: [
        {
          title: "Согласиться",
          effect: "+120 млн ₸ · +10 экономики · −6 экологии",
          apply: s => {
            s.money += 120;
            change("economy", 10);
            change("ecology", -6);
          }
        },
        {
          title: "Потребовать экологические стандарты",
          effect: "+70 млн ₸ · +6 экономики · +3 экологии",
          apply: s => {
            s.money += 70;
            change("economy", 6);
            change("ecology", 3);
          }
        },
        {
          title: "Отказаться",
          effect: "+3 экологии · −3 экономики",
          apply: s => {
            change("ecology", 3);
            change("economy", -3);
          }
        }
      ]
    },


    {
      id: "festival",
      tag: "ГОРОД",
      icon: "🎉",
      title: "Город хочет праздник",
      description:
        "Молодёжь предлагает провести большой городской фестиваль.",
      weight: s => 3,

      choices: [
        {
          title: "Устроить праздник",
          effect: "−25 млн ₸ · +12 счастья",
          apply: s => {
            s.money -= 25;
            change("happiness", 12);
          }
        },
        {
          title: "Сделать бесплатную спортивную программу",
          effect: "−20 млн ₸ · +7 счастья · +5 здоровья",
          apply: s => {
            s.money -= 20;
            change("happiness", 7);
            change("health", 5);
          }
        },
        {
          title: "Сэкономить деньги",
          effect: "+10 млн ₸ · −3 счастья",
          apply: s => {
            s.money += 10;
            change("happiness", -3);
          }
        }
      ]
    },


    {
      id: "grant",
      tag: "БОНУС",
      icon: "🌱",
      title: "Город получил экологический грант",
      description:
        "Ваши экологические показатели заметили. Международный фонд предлагает небольшую поддержку.",
      weight: s => s.metrics.ecology > 65 ? 6 : 1,

      choices: [
        {
          title: "Вложить всё в зелёные зоны",
          effect: "+45 млн ₸ · +10 экологии",
          apply: s => {
            s.money += 45;
            change("ecology", 10);
          }
        },
        {
          title: "Направить деньги в школы",
          effect: "+45 млн ₸ · +7 образования",
          apply: s => {
            s.money += 45;
            change("education", 7);
          }
        },
        {
          title: "Сохранить деньги",
          effect: "+80 млн ₸",
          apply: s => {
            s.money += 80;
          }
        }
      ]
    }

  ];


  /* =========================
     DOM
  ========================= */

  const $ = id => document.getElementById(id);

  const projectsEl = $("projects");
  const projectObjects = $("projectObjects");

  const eventModal = $("eventModal");
  const finishModal = $("finishModal");
  const startScreen = $("startScreen");

  let toastTimer;


  /* =========================
     УТИЛИТЫ
  ========================= */

  function money(value) {
    return Math.round(value).toLocaleString("ru-RU");
  }

  function change(metric, amount) {
    state.metrics[metric] = Math.max(
      0,
      Math.min(100, state.metrics[metric] + amount)
    );
  }

  function totalIncome() {

    let income = 10;

    income += state.metrics.economy * 0.35;

    projects.forEach(project => {
      const level = state.projects[project.id] || 0;

      if (level > 0) {
        income += project.income * level;
      }
    });

    if (state.metrics.happiness < 35) {
      income *= 0.75;
    }

    if (state.metrics.economy > 75) {
      income *= 1.15;
    }

    return Math.max(0, income);
  }


  function totalExpenses() {

    let expenses = 4;

    projects.forEach(project => {
      const level = state.projects[project.id] || 0;

      if (level > 0) {
        expenses += project.upkeep * level;
      }
    });

    if (state.debt > 0) {
      expenses += Math.min(20, state.debt * 0.08);
    }

    return expenses;
  }


  function projectCost(project, level) {

    if (level === 0) {
      return project.cost;
    }

    return Math.round(project.cost * (0.55 + level * 0.15));
  }


  /* =========================
     ПРОЕКТЫ НА ЭКРАНЕ
  ========================= */

  function renderProjects() {

    projectsEl.innerHTML = "";

    projects.forEach(project => {

      const level = state.projects[project.id] || 0;
      const locked = state.turn < project.unlock;
      const maxLevel = 3;
      const maxed = level >= maxLevel;

      const nextCost = projectCost(project, level);

      const card = document.createElement("div");

      card.className =
        "project" + (locked ? " locked" : "");

      let buttonText;

      if (locked) {
        buttonText = `с хода ${project.unlock}`;
      } else if (maxed) {
        buttonText = "MAX";
      } else if (level === 0) {
        buttonText = `−${money(nextCost)}`;
      } else {
        buttonText = `УЛУЧШИТЬ`;
      }

      card.innerHTML = `
        <div class="project-icon">${project.icon}</div>

        <div>
          <div class="project-name">
            ${project.name}
            ${level > 0 ? ` · ${level}/3` : ""}
          </div>

          <div class="project-desc">
            ${project.desc}
          </div>

          <div class="project-info">
            <span class="project-cost">
              ${level === 0 ? "строительство" : `уровень ${level + 1}`}
            </span>

            <span class="project-profit">
              +${project.income * Math.max(1, level + 1)} млн/ход
            </span>
          </div>
        </div>

        <button
          data-project="${project.id}"
          ${locked || maxed ? "disabled" : ""}
        >
          ${buttonText}
        </button>
      `;

      projectsEl.appendChild(card);
    });


    document.querySelectorAll("[data-project]").forEach(button => {

      button.addEventListener("click", () => {

        const id = button.dataset.project;

        buildProject(id);

      });

    });
  }


  /* =========================
     ПОКУПКА
  ========================= */

  function buildProject(id) {

    const project = projects.find(p => p.id === id);

    if (!project) return;

    const level = state.projects[id] || 0;

    if (level >= 3) return;

    if (state.turn < project.unlock) {
      showToast(`Откроется с ${project.unlock}-го хода`);
      return;
    }

    const cost = projectCost(project, level);

    if (state.money < cost) {
      showToast("💸 Не хватает денег на этот проект");
      ret