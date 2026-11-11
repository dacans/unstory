export type SupportedLocale = 'en' | 'es' | 'de';

export const translations = {
  en: {
    // ── Disclaimer ────────────────────────────────────────────────
    disclaimer: {
      heading: 'Before you begin',
      body: 'Unstory is a self-reflection tool designed to help you organize your thoughts during difficult moments. It is not a substitute for professional therapy, psychological counseling, or medical advice. If you are experiencing a mental health crisis, please reach out to a qualified professional or emergency services. By continuing, you acknowledge that Unstory is a personal clarity tool, not a clinical service.',
      button: "I understand, let's go",
    },

    // ── Home ──────────────────────────────────────────────────────
    home: {
      heading: "What's weighing\non you?",
      subtext: 'This is your space. No judgment.',
      tooltip: 'Tap when you need it.',
      cta: 'I need clarity',
      momentsButton: 'Open a Moment',
      proText: '5 free sessions · Lifetime unlock $7.99',
      disclaimerLine:
        'Unstory is not a substitute for professional therapy or medical advice.',
    },

    // ── Language selector ─────────────────────────────────────────
    language: {
      title: 'Choose your language',
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      done: 'Done',
    },

    // ── Emotion Select ────────────────────────────────────────────
    emotion: {
      question: 'How are you feeling right now?',
      continue: 'Continue',
      emotions: {
        overwhelmed: {
          label: 'Overwhelmed',
          subtitle: 'Too much, all at once',
        },
        anxious: {
          label: 'Anxious',
          subtitle: 'Worried about what might happen',
        },
        frustrated: {
          label: 'Frustrated',
          subtitle: "Things didn't go as expected",
        },
        exhausted: {
          label: 'Exhausted',
          subtitle: 'You have nothing left to give',
        },
        stuck: {
          label: 'Stuck',
          subtitle: "You don't know where to start",
        },
      },
    },

    // ── Dump ──────────────────────────────────────────────────────
    dump: {
      question: "Write it all out. Don't filter yourself.",
      placeholder: "Everything that's in your head right now...",
      continue: 'Continue',
      prompts: {
        overwhelmed: "What's the loudest thing in your head?",
        anxious: "What are you most afraid will happen?",
        frustrated: "What did you expect? What happened instead?",
        exhausted: "What are you forcing yourself to keep doing?",
        stuck: 'What feels impossible to start?',
      },
    },

    // ── Flow ──────────────────────────────────────────────────────
    flow: {
      continue: 'Continue',
      seeResult: 'See my result',
      overwhelmed: {
        q1: 'How many things are you trying to handle right now?',
        q1_placeholder: 'A number or just describe it...',
        q2: "Which of these will actually explode if you don't handle it TODAY?",
        q2_placeholder: 'Write only the most urgent thing...',
        q3: 'Can everything else wait 24 hours?',
        q3_choices: ['Yes', 'Not sure', 'No'],
      },
      anxious: {
        q1: "What's the worst thing you're afraid will happen?",
        q1_placeholder: 'Say it. Get it out...',
        q2: 'Is there anything you can actually do about this in the next 24 hours?',
        q2_choices: ['Yes', 'No'],
        q3: "What's ONE thing you can do today?",
        q3_placeholder: 'Just one thing...',
      },
      frustrated: {
        q1: 'What did you expect to happen?',
        q1_placeholder: 'What should have happened...',
        q2: 'What actually happened?',
        q2_placeholder: 'What really happened...',
        q3: 'Is the gap between those two things something you controlled?',
        q3_choices: ['Yes', 'Partly', 'No'],
      },
      exhausted: {
        q1: 'When did you last truly rest — no phone, no tasks, no pressure?',
        q1_placeholder: 'Be honest...',
        q2: "What's stopping you from resting right now?",
        q2_placeholder: "What's in the way...",
        q3: 'What would actually happen if you stopped for 30 minutes?',
        q3_placeholder: 'Really think about it...',
      },
      stuck: {
        q1: "What's the thing you keep avoiding?",
        q1_placeholder: 'Name it...',
        q2: "What are you afraid will happen if you start?",
        q2_placeholder: 'The real fear...',
        q3: "What's the absolute smallest step you could take — something that takes under 2 minutes?",
        q3_placeholder: 'Tiny. Specific. Doable now...',
      },
    },

    // ── Result ────────────────────────────────────────────────────
    result: {
      releaseLabel: 'Let it go.',
      labelActed: 'Your focus',
      labelResting: 'Permission granted',
      saveBtn: 'Save this',
      letGoBtn: 'Let it go',
      messages: {
        overwhelmed: "This is all that's real right now.",
        anxious_acted: 'One step. That\'s all.',
        frustrated_resting: "You did what you could. The rest wasn't yours.",
        frustrated_acted: "You can adjust. You're not stuck.",
        exhausted: 'Nothing will collapse. You have permission to stop.',
        stuck: 'Start there. Only there.',
      },
      quotes: {
        overwhelmed: {
          text: 'Make the best use of what is in your power, and take the rest as it happens.',
          author: 'Epictetus',
        },
        anxious: {
          text: 'You have power over your mind, not outside events.',
          author: 'Marcus Aurelius',
        },
        frustrated: {
          text: 'How long are you going to wait before you demand the best for yourself?',
          author: 'Epictetus',
        },
        exhausted: {
          text: "It is not that I'm so smart. It's that I stay with problems longer.",
          author: 'Seneca',
        },
        stuck: {
          text: 'He who fears death will never do anything worthy of a living man.',
          author: 'Seneca',
        },
      },
      quoteGroups: {
        restSimplicity: [
          { text: 'Make the best use of what is in your power, and take the rest as it happens.', author: 'Epictetus' },
          { text: "It is not that I'm so smart. It's that I stay with problems longer.", author: 'Seneca' },
        ],
        actionCourage: [
          { text: 'You have power over your mind, not outside events.', author: 'Marcus Aurelius' },
          { text: 'He who fears death will never do anything worthy of a living man.', author: 'Seneca' },
        ],
        acceptanceControl: [
          { text: 'How long are you going to wait before you demand the best for yourself?', author: 'Epictetus' },
        ],
      },
    },

    // ── History ───────────────────────────────────────────────────
    history: {
      title: 'Your history',
      tabSessions: 'Sessions',
      tabMoments: 'Moments',
      statsReleased: "You've released",
      statsActed: "You've acted on",
      statsThings: 'things.',
      statsOn: '',
      emptyTitle: 'No sessions saved yet.',
      emptySubtext: 'After a session, tap "Save this" to keep it here.',
      momentsEmpty: 'No moments saved yet.',
      momentsEmptySubtext: 'Saved present moments will appear here.',
      emotionLabel: 'Emotion',
      sectionWrote: 'What you wrote',
      sectionResult: 'Your result',
      done: 'Done',
      badges: {
        acted: 'Acted',
        released: 'Released',
        resting: 'Resting',
      },
    },

    // ── Paywall ───────────────────────────────────────────────────
    paywall: {
      eyebrow: 'Unstory',
      heading: "You've used your\n5 free sessions",
      subtext: 'Unlock Unstory forever — one time, no subscription.',
      features: [
        'Unlimited sessions',
        'Full history saved locally',
        'All 5 emotion flows',
        'No account. No data. Ever.',
      ],
      priceLabel: 'Lifetime Access',
      purchaseBtn: 'Unlock for $7.99',
      oneTimeNote: 'One-time payment. Yours forever.',
      restore: 'Restore purchase',
      label: 'UNSTORY PREMIUM',
      title: 'See your patterns.\nBreak them.',
      subtitle: 'Unlock unlimited sessions and start understanding yourself.',
      feature1: 'Unlimited clarity sessions',
      feature2: 'Full session history & search',
      feature3: 'Present Moment grounding exercise',
      feature4: 'All future features included',
      monthly: 'Monthly',
      annual: 'Annual',
      lifetime: 'Lifetime',
      bestValue: 'BEST VALUE',
      mostPopular: 'MOST POPULAR',
      monthlyPrice: '$4.99/mo',
      annualPrice: '$14.99/yr',
      lifetimePrice: '$24.99',
      lifetimeNote: 'one-time',
      cta: 'Start Premium',
      restoreLabel: 'Restore Purchases',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      disclaimer: 'Subscriptions auto-renew unless cancelled 24h before renewal. Managed in App Store settings.',
    },

    // ── Present Moment ────────────────────────────────────────────
    presentMoment: {
      oneThing: 'One more thing.',
      takeSeconds: 'Take 60 seconds. Just look around you.',
      imReady: "I'm ready",
      resultTeaser: 'One more thing.',
      resultTeaserSub: 'Take 60 seconds. Just look around you.',
      readyBtn: "I'm ready",
      teaserHint: '60 seconds. Just look.',
      timerLabel: 'Take 60 seconds.\nJust look around you.',
      noticePrompt: 'What did you notice?',
      noticePlaceholder: 'Describe what you saw, heard, or felt...',
      saveBtn: 'Save this moment',
      skipBtn: 'Skip',
      paywallHeading: 'Present Moment',
    },
  },

  // ════════════════════════════════════════════════════════════════
  // ESPAÑOL (Latin American)
  // ════════════════════════════════════════════════════════════════
  es: {
    disclaimer: {
      heading: 'Antes de comenzar',
      body: 'Unstory es una herramienta de autorreflexión diseñada para ayudarte a ordenar tus pensamientos en momentos difíciles. No sustituye a la terapia profesional, el asesoramiento psicológico ni el consejo médico. Si estás atravesando una crisis de salud mental, por favor contacta a un profesional cualificado o a los servicios de emergencia. Al continuar, reconoces que Unstory es una herramienta de claridad personal, no un servicio clínico.',
      button: 'Entendido, vamos',
    },

    home: {
      heading: '¿Qué te está\npesando?',
      subtext: 'Este es tu espacio. Sin juicios.',
      tooltip: 'Úsalo cuando lo necesites.',
      cta: 'Necesito claridad',
      momentsButton: 'Abrir un momento',
      proText: '5 sesiones gratis · Acceso de por vida $7.99',
      disclaimerLine:
        'Unstory no sustituye a la terapia profesional ni al consejo médico.',
    },

    language: {
      title: 'Elige tu idioma',
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      done: 'Listo',
    },

    emotion: {
      question: '¿Cómo te sientes ahora mismo?',
      continue: 'Continuar',
      emotions: {
        overwhelmed: {
          label: 'Agobiado/a',
          subtitle: 'Demasiado, todo a la vez',
        },
        anxious: {
          label: 'Ansioso/a',
          subtitle: 'Preocupado/a por lo que pueda pasar',
        },
        frustrated: {
          label: 'Frustrado/a',
          subtitle: 'Las cosas no salieron como esperabas',
        },
        exhausted: {
          label: 'Agotado/a',
          subtitle: 'Ya no te queda nada por dar',
        },
        stuck: {
          label: 'Paralizado/a',
          subtitle: 'No sabes por dónde empezar',
        },
      },
    },

    dump: {
      question: 'Escríbelo todo. Sin filtros.',
      placeholder: 'Todo lo que tienes en la cabeza ahora mismo...',
      continue: 'Continuar',
      prompts: {
        overwhelmed: '¿Qué es lo que más ruido hace en tu cabeza?',
        anxious: '¿Qué es lo que más temes que pase?',
        frustrated: '¿Qué esperabas que ocurriera? ¿Qué pasó en cambio?',
        exhausted: '¿Qué estás forzándote a seguir haciendo?',
        stuck: '¿Qué se siente imposible de empezar?',
      },
    },

    flow: {
      continue: 'Continuar',
      seeResult: 'Ver mi resultado',
      overwhelmed: {
        q1: '¿Cuántas cosas estás intentando manejar ahora mismo?',
        q1_placeholder: 'Un número o descríbelo...',
        q2: '¿Cuál de todas estas va a explotar si no la atiendes HOY?',
        q2_placeholder: 'Escribe solo lo más urgente...',
        q3: '¿Todo lo demás puede esperar 24 horas?',
        q3_choices: ['Sí', 'No estoy seguro/a', 'No'],
      },
      anxious: {
        q1: '¿Qué es lo peor que temes que ocurra?',
        q1_placeholder: 'Dilo. Sácalo fuera...',
        q2: '¿Hay algo que puedas hacer al respecto en las próximas 24 horas?',
        q2_choices: ['Sí', 'No'],
        q3: '¿Cuál es UNA cosa que puedes hacer hoy?',
        q3_placeholder: 'Solo una cosa...',
      },
      frustrated: {
        q1: '¿Qué esperabas que pasara?',
        q1_placeholder: 'Lo que debería haber ocurrido...',
        q2: '¿Qué fue lo que realmente pasó?',
        q2_placeholder: 'Lo que realmente ocurrió...',
        q3: '¿La diferencia entre esos dos escenarios estaba en tu control?',
        q3_choices: ['Sí', 'En parte', 'No'],
      },
      exhausted: {
        q1: '¿Cuándo fue la última vez que descansaste de verdad — sin teléfono, sin tareas, sin presión?',
        q1_placeholder: 'Sé honesto/a...',
        q2: '¿Qué te impide descansar ahora mismo?',
        q2_placeholder: '¿Qué está en el camino?...',
        q3: '¿Qué pasaría realmente si pararas 30 minutos?',
        q3_placeholder: 'Piénsalo de verdad...',
      },
      stuck: {
        q1: '¿Qué es lo que sigues evitando?',
        q1_placeholder: 'Ponle nombre...',
        q2: '¿Qué temes que pase si empiezas?',
        q2_placeholder: 'El miedo real...',
        q3: '¿Cuál es el paso más pequeño que podrías dar ahora mismo — algo que lleve menos de 2 minutos?',
        q3_placeholder: 'Pequeño. Concreto. Hacible ahora...',
      },
    },

    result: {
      releaseLabel: 'Suéltalo.',
      labelActed: 'Tu enfoque',
      labelResting: 'Tienes permiso',
      saveBtn: 'Guardar esto',
      letGoBtn: 'Dejarlo ir',
      messages: {
        overwhelmed: 'Esto es lo único real ahora mismo.',
        anxious_acted: 'Un paso. Solo ese.',
        frustrated_resting: 'Hiciste lo que pudiste. El resto no era tuyo.',
        frustrated_acted: 'Puedes ajustarlo. No estás atrapado/a.',
        exhausted: 'Nada va a colapsar. Tienes permiso para parar.',
        stuck: 'Empieza ahí. Solo ahí.',
      },
      quotes: {
        overwhelmed: {
          text: 'Haz el mejor uso de lo que está en tu poder, y toma el resto como viene.',
          author: 'Epicteto',
        },
        anxious: {
          text: 'Tienes poder sobre tu mente, no sobre los eventos externos.',
          author: 'Marco Aurelio',
        },
        frustrated: {
          text: '¿Cuánto tiempo más vas a esperar antes de exigirte lo mejor?',
          author: 'Epicteto',
        },
        exhausted: {
          text: 'No es que sea tan inteligente. Es que me quedo con los problemas más tiempo.',
          author: 'Séneca',
        },
        stuck: {
          text: 'Quien teme a la muerte nunca hará nada digno de un hombre vivo.',
          author: 'Séneca',
        },
      },
      quoteGroups: {
        restSimplicity: [
          { text: 'Haz el mejor uso de lo que está en tu poder, y toma el resto como viene.', author: 'Epicteto' },
          { text: 'No es que sea tan inteligente. Es que me quedo con los problemas más tiempo.', author: 'Séneca' },
        ],
        actionCourage: [
          { text: 'Tienes poder sobre tu mente, no sobre los eventos externos.', author: 'Marco Aurelio' },
          { text: 'Quien teme a la muerte nunca hará nada digno de un hombre vivo.', author: 'Séneca' },
        ],
        acceptanceControl: [
          { text: '¿Cuánto tiempo más vas a esperar antes de exigirte lo mejor?', author: 'Epicteto' },
        ],
      },
    },

    history: {
      title: 'Tu historial',
      tabSessions: 'Sesiones',
      tabMoments: 'Momentos',
      statsReleased: 'Soltaste',
      statsActed: 'Actuaste sobre',
      statsThings: 'cosas.',
      statsOn: '',
      emptyTitle: 'Todavía no hay sesiones guardadas.',
      emptySubtext: 'Al terminar una sesión, toca "Guardar esto" para conservarla aquí.',
      momentsEmpty: 'Todavía no hay momentos guardados.',
      momentsEmptySubtext: 'Los momentos del presente guardados aparecerán aquí.',
      emotionLabel: 'Emoción',
      sectionWrote: 'Lo que escribiste',
      sectionResult: 'Tu resultado',
      done: 'Listo',
      badges: {
        acted: 'Actuado',
        released: 'Soltado',
        resting: 'Descansando',
      },
    },

    paywall: {
      eyebrow: 'Unstory',
      heading: 'Ya usaste tus\n5 sesiones gratis',
      subtext: 'Desbloquea Unstory para siempre — una sola vez, sin suscripción.',
      features: [
        'Sesiones ilimitadas',
        'Historial completo guardado localmente',
        'Los 5 flujos emocionales',
        'Sin cuenta. Sin datos. Nunca.',
      ],
      priceLabel: 'Acceso de por vida',
      purchaseBtn: 'Desbloquear por $7.99',
      oneTimeNote: 'Pago único. Tuyo para siempre.',
      restore: 'Restaurar compra',
      label: 'UNSTORY PREMIUM',
      title: 'Entiéndete.\nCámbialo.',
      subtitle: 'Sesiones ilimitadas para entender lo que realmente sientes.',
      feature1: 'Sesiones de claridad ilimitadas',
      feature2: 'Historial completo de sesiones',
      feature3: 'Ejercicio de momento presente',
      feature4: 'Todas las funciones futuras incluidas',
      monthly: 'Mensual',
      annual: 'Anual',
      lifetime: 'De por vida',
      bestValue: 'MEJOR VALOR',
      mostPopular: 'MÁS POPULAR',
      monthlyPrice: '$4.99/mes',
      annualPrice: '$14.99/año',
      lifetimePrice: '$24.99',
      lifetimeNote: 'pago único',
      cta: 'Activar Premium',
      restoreLabel: 'Restaurar compras',
      terms: 'Términos de uso',
      privacy: 'Política de privacidad',
      disclaimer: 'Las suscripciones se renuevan automáticamente salvo que se cancelen 24h antes. Gestión en Ajustes de App Store.',
    },

    // ── Present Moment ────────────────────────────────────────────
    presentMoment: {
      oneThing: 'Una cosa más.',
      takeSeconds: 'Tómate 60 segundos. Solo mira a tu alrededor.',
      imReady: 'Estoy listo/a',
      resultTeaser: 'Una cosa más.',
      resultTeaserSub: 'Tómate 60 segundos. Solo mira a tu alrededor.',
      readyBtn: 'Estoy listo/a',
      teaserHint: '60 segundos. Solo mira.',
      timerLabel: 'Tómate 60 segundos.\nSolo mira a tu alrededor.',
      noticePrompt: '¿Qué notaste?',
      noticePlaceholder: 'Describe lo que viste, escuchaste o sentiste...',
      saveBtn: 'Guardar este momento',
      skipBtn: 'Omitir',
      paywallHeading: 'Momento Presente',
    },
  },

  // ════════════════════════════════════════════════════════════════
  // DEUTSCH
  // ════════════════════════════════════════════════════════════════
  de: {
    disclaimer: {
      heading: 'Bevor du beginnst',
      body: 'Unstory ist ein Werkzeug zur Selbstreflexion, das dir helfen soll, deine Gedanken in schwierigen Momenten zu ordnen. Es ersetzt keine professionelle Therapie, psychologische Beratung oder medizinischen Rat. Wenn du dich in einer psychischen Krise befindest, wende dich bitte an einen qualifizierten Fachmann oder den Notfalldienst. Indem du fortfährst, bestätigst du, dass Unstory ein persönliches Hilfsmittel zur Klarheit ist und kein klinischer Dienst.',
      button: "Verstanden, los geht's",
    },

    home: {
      heading: 'Was lastet gerade\nauf dir?',
      subtext: 'Das hier ist dein Raum. Kein Urteil.',
      tooltip: 'Nutze es, wenn du es brauchst.',
      cta: 'Ich brauche Klarheit',
      momentsButton: 'Moment öffnen',
      proText: '5 kostenlose Sitzungen · Lifetime-Zugang $7.99',
      disclaimerLine:
        'Unstory ersetzt keine professionelle Therapie oder medizinischen Rat.',
    },

    language: {
      title: 'Sprache wählen',
      en: 'English',
      es: 'Español',
      de: 'Deutsch',
      done: 'Fertig',
    },

    emotion: {
      question: 'Wie fühlst du dich gerade?',
      continue: 'Weiter',
      emotions: {
        overwhelmed: {
          label: 'Überwältigt',
          subtitle: 'Zu viel auf einmal',
        },
        anxious: {
          label: 'Ängstlich',
          subtitle: 'Sorgen um das, was passieren könnte',
        },
        frustrated: {
          label: 'Frustriert',
          subtitle: 'Die Dinge liefen nicht wie erwartet',
        },
        exhausted: {
          label: 'Erschöpft',
          subtitle: 'Du hast nichts mehr zu geben',
        },
        stuck: {
          label: 'Feststeckend',
          subtitle: 'Du weißt nicht, wo du anfangen sollst',
        },
      },
    },

    dump: {
      question: 'Schreib alles heraus. Ohne Filter.',
      placeholder: 'Alles, was dir gerade durch den Kopf geht...',
      continue: 'Weiter',
      prompts: {
        overwhelmed: 'Was ist der lauteste Gedanke in deinem Kopf?',
        anxious: 'Was befürchtest du am meisten?',
        frustrated: 'Was hast du erwartet? Was ist stattdessen passiert?',
        exhausted: 'Wozu zwingst du dich gerade noch?',
        stuck: 'Was fühlt sich unmöglich anzufangen an?',
      },
    },

    flow: {
      continue: 'Weiter',
      seeResult: 'Mein Ergebnis sehen',
      overwhelmed: {
        q1: 'Wie viele Dinge versuchst du gerade gleichzeitig zu bewältigen?',
        q1_placeholder: 'Eine Zahl oder beschreib es...',
        q2: 'Welches davon würde wirklich eskalieren, wenn du es HEUTE nicht angehst?',
        q2_placeholder: 'Nur das Dringendste...',
        q3: 'Kann alles andere 24 Stunden warten?',
        q3_choices: ['Ja', 'Nicht sicher', 'Nein'],
      },
      anxious: {
        q1: 'Was ist das Schlimmste, was du befürchtest?',
        q1_placeholder: 'Sag es. Lass es raus...',
        q2: 'Gibt es etwas, das du in den nächsten 24 Stunden wirklich dagegen tun kannst?',
        q2_choices: ['Ja', 'Nein'],
        q3: 'Was ist EINE Sache, die du heute tun kannst?',
        q3_placeholder: 'Nur eine Sache...',
      },
      frustrated: {
        q1: 'Was hast du erwartet?',
        q1_placeholder: 'Was hätte passieren sollen...',
        q2: 'Was ist wirklich passiert?',
        q2_placeholder: 'Was wirklich geschah...',
        q3: 'War die Lücke zwischen diesen beiden etwas, das du beeinflussen konntest?',
        q3_choices: ['Ja', 'Zum Teil', 'Nein'],
      },
      exhausted: {
        q1: 'Wann hast du zuletzt wirklich geruht — ohne Handy, ohne Aufgaben, ohne Druck?',
        q1_placeholder: 'Sei ehrlich...',
        q2: 'Was hält dich gerade davon ab, dich auszuruhen?',
        q2_placeholder: 'Was steht im Weg...',
        q3: 'Was würde wirklich passieren, wenn du 30 Minuten Pause machst?',
        q3_placeholder: 'Denk wirklich darüber nach...',
      },
      stuck: {
        q1: 'Was ist die Sache, die du immer wieder vermeidest?',
        q1_placeholder: 'Nenn es beim Namen...',
        q2: 'Was befürchtest du, wenn du anfängst?',
        q2_placeholder: 'Die eigentliche Angst...',
        q3: 'Was ist der allerkleinste Schritt, den du machen könntest — etwas, das weniger als 2 Minuten dauert?',
        q3_placeholder: 'Klein. Konkret. Jetzt machbar...',
      },
    },

    result: {
      releaseLabel: 'Lass es los.',
      labelActed: 'Dein Fokus',
      labelResting: 'Du hast die Erlaubnis',
      saveBtn: 'Speichern',
      letGoBtn: 'Loslassen',
      messages: {
        overwhelmed: 'Das hier ist alles, was gerade real ist.',
        anxious_acted: 'Ein Schritt. Mehr nicht.',
        frustrated_resting: 'Du hast getan, was du konntest. Der Rest war nicht deins.',
        frustrated_acted: 'Du kannst es anpassen. Du steckst nicht fest.',
        exhausted: 'Nichts wird zusammenbrechen. Du hast die Erlaubnis aufzuhören.',
        stuck: 'Fang dort an. Nur dort.',
      },
      quotes: {
        overwhelmed: {
          text: 'Nutze das Beste aus dem, was in deiner Macht steht, und nimm den Rest so, wie er kommt.',
          author: 'Epiktet',
        },
        anxious: {
          text: 'Du hast Macht über deinen Geist, nicht über äußere Ereignisse.',
          author: 'Marc Aurel',
        },
        frustrated: {
          text: 'Wie lange willst du noch warten, bevor du das Beste von dir verlangst?',
          author: 'Epiktet',
        },
        exhausted: {
          text: 'Es liegt nicht daran, dass ich so klug bin. Es liegt daran, dass ich länger bei Problemen bleibe.',
          author: 'Seneca',
        },
        stuck: {
          text: 'Wer den Tod fürchtet, wird nie etwas tun, das eines lebenden Menschen würdig ist.',
          author: 'Seneca',
        },
      },
      quoteGroups: {
        restSimplicity: [
          { text: 'Nutze das Beste aus dem, was in deiner Macht steht, und nimm den Rest so, wie er kommt.', author: 'Epiktet' },
          { text: 'Es liegt nicht daran, dass ich so klug bin. Es liegt daran, dass ich länger bei Problemen bleibe.', author: 'Seneca' },
        ],
        actionCourage: [
          { text: 'Du hast Macht über deinen Geist, nicht über äußere Ereignisse.', author: 'Marc Aurel' },
          { text: 'Wer den Tod fürchtet, wird nie etwas tun, das eines lebenden Menschen würdig ist.', author: 'Seneca' },
        ],
        acceptanceControl: [
          { text: 'Wie lange willst du noch warten, bevor du das Beste von dir verlangst?', author: 'Epiktet' },
        ],
      },
    },

    history: {
      title: 'Dein Verlauf',
      tabSessions: 'Sitzungen',
      tabMoments: 'Momente',
      statsReleased: 'Du hast',
      statsActed: 'Du hast bei',
      statsThings: 'Dingen gehandelt.',
      statsOn: 'losgelassen.',
      emptyTitle: 'Noch keine Sitzungen gespeichert.',
      emptySubtext: 'Tippe nach einer Sitzung auf "Speichern", um sie hier aufzubewahren.',
      momentsEmpty: 'Noch keine Momente gespeichert.',
      momentsEmptySubtext: 'Gespeicherte Momente erscheinen hier.',
      emotionLabel: 'Gefühl',
      sectionWrote: 'Was du geschrieben hast',
      sectionResult: 'Dein Ergebnis',
      done: 'Fertig',
      badges: {
        acted: 'Gehandelt',
        released: 'Losgelassen',
        resting: 'Ruhend',
      },
    },

    paywall: {
      eyebrow: 'Unstory',
      heading: 'Du hast deine\n5 kostenlosen Sitzungen genutzt',
      subtext: 'Entsperre Unstory für immer — einmalig, kein Abo.',
      features: [
        'Unbegrenzte Sitzungen',
        'Vollständiger Verlauf lokal gespeichert',
        'Alle 5 Emotionsflüsse',
        'Kein Konto. Keine Daten. Niemals.',
      ],
      priceLabel: 'Lifetime-Zugang',
      purchaseBtn: 'Für $7.99 entsperren',
      oneTimeNote: 'Einmalige Zahlung. Für immer deins.',
      restore: 'Kauf wiederherstellen',
      label: 'UNSTORY PREMIUM',
      title: 'Verstehe dich.\nVerändere dich.',
      subtitle: 'Unbegrenzte Sitzungen, um wirklich zu verstehen, was du fühlst.',
      feature1: 'Unbegrenzte Klarheitssitzungen',
      feature2: 'Vollständiger Sitzungsverlauf',
      feature3: 'Gegenwarts-Übung (Grounding)',
      feature4: 'Alle zukünftigen Funktionen inklusive',
      monthly: 'Monatlich',
      annual: 'Jährlich',
      lifetime: 'Lebenslang',
      bestValue: 'BESTES ANGEBOT',
      mostPopular: 'AM BELIEBTESTEN',
      monthlyPrice: '4,99 $/Monat',
      annualPrice: '14,99 $/Jahr',
      lifetimePrice: '24,99 $',
      lifetimeNote: 'einmalig',
      cta: 'Premium starten',
      restoreLabel: 'Käufe wiederherstellen',
      terms: 'Nutzungsbedingungen',
      privacy: 'Datenschutzrichtlinie',
      disclaimer: 'Abos verlängern sich automatisch, wenn sie nicht 24 Std. vor Ablauf gekündigt werden. Verwaltung in den App Store-Einstellungen.',
    },

    // ── Present Moment ────────────────────────────────────────────
    presentMoment: {
      oneThing: 'Noch eine Sache.',
      takeSeconds: 'Nimm dir 60 Sekunden. Schau dich einfach um.',
      imReady: 'Ich bin bereit',
      resultTeaser: 'Noch eine Sache.',
      resultTeaserSub: 'Nimm dir 60 Sekunden. Schau dich einfach um.',
      readyBtn: 'Ich bin bereit',
      teaserHint: '60 Sekunden. Schau einfach.',
      timerLabel: 'Nimm dir 60 Sekunden.\nSchau dich einfach um.',
      noticePrompt: 'Was hast du bemerkt?',
      noticePlaceholder: 'Beschreib, was du gesehen, gehört oder gefühlt hast...',
      saveBtn: 'Diesen Moment speichern',
      skipBtn: 'Überspringen',
      paywallHeading: 'Gegenwärtiger Moment',
    },
  },
} as const;

export type TranslationKeys = typeof translations.en;
