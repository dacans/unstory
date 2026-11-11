import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSessionStore } from '@/store/sessionStore';
import type { SavedSession, PresentMoment } from '@/store/sessionStore';

const STORAGE_KEYS = {
  sessionCount: 'session_count',
  savedSessions: 'saved_sessions',
  presentMoments: 'present_moments',
} as const;

function isoAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function idAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return String(d.getTime());
}

// ─── English ─────────────────────────────────────────────────────────────────

function buildSessionsEn(): SavedSession[] {
  return [
    {
      id: idAgo(6, 9),
      date: isoAgo(6, 9),
      emotion: 'overwhelmed',
      dumpText:
        "I have three deadlines this week, my inbox is out of control, and I haven't slept properly in four days. I feel like I'm running but going nowhere.",
      flowAnswers: {
        count: 'Three major ones, plus the usual noise',
        urgent: 'The client report due tomorrow',
        wait: 'Not sure',
      },
      resultType: 'acted',
      resultMessage: "This is all that's real right now.\n\n\"The client report due tomorrow\"",
    },
    {
      id: idAgo(5, 21),
      date: isoAgo(5, 21),
      emotion: 'anxious',
      dumpText:
        "Waiting to hear back about a job interview. Every notification makes my heart jump. I keep rehearsing scenarios in my head that probably won't happen.",
      flowAnswers: {
        worst: 'Not getting the job and having to explain it to everyone who knew I applied',
        actionable: 'No',
      },
      resultType: 'released',
      resultMessage: '',
    },
    {
      id: idAgo(3, 14),
      date: isoAgo(3, 14),
      emotion: 'frustrated',
      dumpText:
        "My colleague took credit for my idea in front of the entire team. I didn't say anything and now I regret it. I feel invisible.",
      flowAnswers: {
        expected: 'My idea would be discussed and attributed properly',
        happened: 'My colleague presented it as their own with no mention of me',
        control: 'Yes',
      },
      resultType: 'acted',
      resultMessage: "You can adjust. You're not stuck.",
    },
    {
      id: idAgo(2, 20),
      date: isoAgo(2, 20),
      emotion: 'exhausted',
      dumpText:
        "I've been saying yes to everything. Every project, every favor, every request. I don't even know what I actually want anymore.",
      flowAnswers: {
        last_rest: 'Three weeks ago, during the long weekend',
        blocking: 'Too many commitments I already said yes to',
        consequence: 'Probably nothing would actually fall apart',
      },
      resultType: 'resting',
      resultMessage: 'Nothing will collapse. You have permission to stop.',
    },
    {
      id: idAgo(1, 11),
      date: isoAgo(1, 11),
      emotion: 'stuck',
      dumpText:
        "I want to make a change but I keep waiting for the perfect moment. It's been six months of waiting. Nothing has moved.",
      flowAnswers: {
        avoiding: 'Changing careers — applying to something new',
        fear: 'Failing and being back to square one',
        small_step: 'Update my resume for 10 minutes tonight',
      },
      resultType: 'acted',
      resultMessage: "Start there. Only there.\n\n\"Update my resume for 10 minutes tonight\"",
    },
  ];
}

function buildMomentsEn(): PresentMoment[] {
  return [
    {
      id: idAgo(4, 16),
      date: isoAgo(4, 16),
      text: 'I noticed the hum of the AC, a car passing outside, and my own breathing. Strange how much is always happening around me.',
    },
    {
      id: idAgo(2, 9),
      date: isoAgo(2, 9),
      text: "The coffee mug in my hands was warm. I hadn't noticed that in months.",
    },
    {
      id: idAgo(1, 19),
      date: isoAgo(1, 19),
      text: 'Thirty seconds in I realized my shoulders were up near my ears. I let them drop. That was enough.',
    },
  ];
}

// ─── Spanish ──────────────────────────────────────────────────────────────────

function buildSessionsEs(): SavedSession[] {
  return [
    {
      id: idAgo(6, 9),
      date: isoAgo(6, 9),
      emotion: 'overwhelmed',
      dumpText:
        'Tengo tres entregas esta semana, el correo desbordado y no duermo bien desde hace días. Siento que corro pero no avanzo.',
      flowAnswers: {
        count: 'Tres cosas grandes, más el ruido habitual',
        urgent: 'El informe del cliente que vence mañana',
        wait: 'No estoy seguro/a',
      },
      resultType: 'acted',
      resultMessage:
        'Esto es lo único real ahora mismo.\n\n"El informe del cliente que vence mañana"',
    },
    {
      id: idAgo(5, 21),
      date: isoAgo(5, 21),
      emotion: 'anxious',
      dumpText:
        'Esperando respuesta de una entrevista. Cada notificación me altera. Llevo horas ensayando conversaciones que probablemente no van a pasar.',
      flowAnswers: {
        worst: 'No conseguir el trabajo y tener que explicárselo a todos los que sabían que apliqué',
        actionable: 'No',
      },
      resultType: 'released',
      resultMessage: '',
    },
    {
      id: idAgo(3, 14),
      date: isoAgo(3, 14),
      emotion: 'frustrated',
      dumpText:
        'Mi compañero se atribuyó mi idea delante de todo el equipo. No dije nada y ahora me arrepiento. Me siento invisible.',
      flowAnswers: {
        expected: 'Que mi idea fuera reconocida y atribuida correctamente',
        happened: 'Mi compañero la presentó como propia sin mencionar mi nombre',
        control: 'Sí',
      },
      resultType: 'acted',
      resultMessage: 'Puedes ajustarlo. No estás atrapado/a.',
    },
    {
      id: idAgo(2, 20),
      date: isoAgo(2, 20),
      emotion: 'exhausted',
      dumpText:
        'Llevo meses diciéndole que sí a todo. A cada proyecto, a cada favor. Ya no sé ni qué quiero yo realmente.',
      flowAnswers: {
        last_rest: 'Hace tres semanas, durante el fin de semana largo',
        blocking: 'Demasiados compromisos a los que ya dije que sí',
        consequence: 'Probablemente nada se derrumbaría realmente',
      },
      resultType: 'resting',
      resultMessage: 'Nada va a colapsar. Tienes permiso para parar.',
    },
    {
      id: idAgo(1, 11),
      date: isoAgo(1, 11),
      emotion: 'stuck',
      dumpText:
        'Quiero hacer un cambio pero sigo esperando el momento perfecto. Llevan seis meses esos planes en mi cabeza sin moverse.',
      flowAnswers: {
        avoiding: 'Cambiar de carrera — aplicar a algo diferente',
        fear: 'Fracasar y volver al punto de partida',
        small_step: 'Actualizar mi CV durante 10 minutos esta noche',
      },
      resultType: 'acted',
      resultMessage: 'Empieza ahí. Solo ahí.\n\n"Actualizar mi CV durante 10 minutos esta noche"',
    },
  ];
}

function buildMomentsEs(): PresentMoment[] {
  return [
    {
      id: idAgo(4, 16),
      date: isoAgo(4, 16),
      text: 'Noté el zumbido del aire acondicionado, un coche al pasar y mi propia respiración. Todo estaba ahí y yo no lo veía.',
    },
    {
      id: idAgo(2, 9),
      date: isoAgo(2, 9),
      text: 'La taza de café en mis manos estaba caliente. No lo había notado en meses.',
    },
    {
      id: idAgo(1, 19),
      date: isoAgo(1, 19),
      text: 'A los treinta segundos me di cuenta de que tenía los hombros subidos hasta las orejas. Los bajé. Con eso bastó.',
    },
  ];
}

// ─── German ───────────────────────────────────────────────────────────────────

function buildSessionsDe(): SavedSession[] {
  return [
    {
      id: idAgo(6, 9),
      date: isoAgo(6, 9),
      emotion: 'overwhelmed',
      dumpText:
        'Drei Deadlines diese Woche, ein übervolles Postfach und ich schlafe seit Tagen schlecht. Ich renne, aber komme nirgendwo an.',
      flowAnswers: {
        count: 'Drei große Dinge, plus der übliche Lärm',
        urgent: 'Der Kundenbericht, der morgen fällig ist',
        wait: 'Nicht sicher',
      },
      resultType: 'acted',
      resultMessage:
        'Das hier ist alles, was gerade real ist.\n\n"Der Kundenbericht, der morgen fällig ist"',
    },
    {
      id: idAgo(5, 21),
      date: isoAgo(5, 21),
      emotion: 'anxious',
      dumpText:
        'Ich warte auf Rückmeldung nach einem Vorstellungsgespräch. Jede Benachrichtigung lässt mein Herz rasen. Ich gehe Szenarien durch, die wahrscheinlich nie eintreten.',
      flowAnswers: {
        worst: 'Die Stelle nicht zu bekommen und es allen erklären zu müssen, die davon wussten',
        actionable: 'Nein',
      },
      resultType: 'released',
      resultMessage: '',
    },
    {
      id: idAgo(3, 14),
      date: isoAgo(3, 14),
      emotion: 'frustrated',
      dumpText:
        'Mein Kollege hat vor dem ganzen Team meine Idee als seine ausgegeben. Ich habe nichts gesagt und bereue es jetzt.',
      flowAnswers: {
        expected: 'Dass meine Idee anerkannt und mir zugeschrieben wird',
        happened: 'Mein Kollege präsentierte sie als seine eigene, ohne mich zu erwähnen',
        control: 'Ja',
      },
      resultType: 'acted',
      resultMessage: 'Du kannst es anpassen. Du steckst nicht fest.',
    },
    {
      id: idAgo(2, 20),
      date: isoAgo(2, 20),
      emotion: 'exhausted',
      dumpText:
        'Ich habe monatelang zu allem Ja gesagt. Zu jedem Projekt, jedem Gefallen. Ich weiß nicht mal mehr, was ich selbst will.',
      flowAnswers: {
        last_rest: 'Vor drei Wochen, während des langen Wochenendes',
        blocking: 'Zu viele Verpflichtungen, zu denen ich bereits Ja gesagt habe',
        consequence: 'Wahrscheinlich würde nichts wirklich zusammenbrechen',
      },
      resultType: 'resting',
      resultMessage: 'Nichts wird zusammenbrechen. Du hast die Erlaubnis aufzuhören.',
    },
    {
      id: idAgo(1, 11),
      date: isoAgo(1, 11),
      emotion: 'stuck',
      dumpText:
        'Ich will etwas verändern, warte aber auf den perfekten Moment. Seit sechs Monaten bewegt sich nichts.',
      flowAnswers: {
        avoiding: 'Berufswechsel — mich auf etwas Neues bewerben',
        fear: 'Zu scheitern und wieder von vorn anzufangen',
        small_step: 'Meinen Lebenslauf heute Abend 10 Minuten lang aktualisieren',
      },
      resultType: 'acted',
      resultMessage:
        'Fang dort an. Nur dort.\n\n"Meinen Lebenslauf heute Abend 10 Minuten lang aktualisieren"',
    },
  ];
}

function buildMomentsDe(): PresentMoment[] {
  return [
    {
      id: idAgo(4, 16),
      date: isoAgo(4, 16),
      text: 'Ich hörte das Summen der Klimaanlage, ein Auto draußen und meinen eigenen Atem. Erstaunlich, wie viel immer um uns herum passiert.',
    },
    {
      id: idAgo(2, 9),
      date: isoAgo(2, 9),
      text: 'Die Kaffeetasse in meinen Händen war warm. Das hatte ich seit Monaten nicht mehr bemerkt.',
    },
    {
      id: idAgo(1, 19),
      date: isoAgo(1, 19),
      text: 'Nach dreißig Sekunden merkte ich, dass meine Schultern bis zu den Ohren hochgezogen waren. Ich ließ sie sinken. Das reichte.',
    },
  ];
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function seedDemoData(language: 'en' | 'es' | 'de'): Promise<void> {
  const sessions =
    language === 'es' ? buildSessionsEs() : language === 'de' ? buildSessionsDe() : buildSessionsEn();
  const moments =
    language === 'es' ? buildMomentsEs() : language === 'de' ? buildMomentsDe() : buildMomentsEn();

  await Promise.all([
    AsyncStorage.setItem(STORAGE_KEYS.savedSessions, JSON.stringify(sessions)),
    AsyncStorage.setItem(STORAGE_KEYS.presentMoments, JSON.stringify(moments)),
    AsyncStorage.setItem(STORAGE_KEYS.sessionCount, String(sessions.length)),
  ]);

  await useSessionStore.getState().loadPersistedData();
}
