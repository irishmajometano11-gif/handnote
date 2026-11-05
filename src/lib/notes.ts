
export const NOTES = {
  do: { name: "Do", frequency: 261.63 },
  re: { name: "Re", frequency: 293.66 },
  mi: { name: "Mi", frequency: 329.63 },
  fa: { name: "Fa", frequency: 349.23 },
  sol: { name: "Sol", frequency: 392.0 },
  la: { name: "La", frequency: 440.0 },
  ti: { name: "Ti", frequency: 493.88 },
  highDo: { name: "High Do", frequency: 523.25 },
};

export type NoteId = keyof typeof NOTES;
