import "../main.css";

import { Elm } from "../src-elm/Main.elm";

import { invoke } from "@tauri-apps/api";

type Color = {
  r: number;
  g: number;
  b: number;
};

type ElmState = {
  color: Color;
  percentage: number;
  paused: boolean;
};

type ElmConfig = {
  alwaysOnTop: boolean;
  autoStartWorkTimer: boolean;
  autoStartBreakTimer: boolean;
  desktopNotifications: boolean;
  longBreakDuration: number;
  maxRoundNumber: number;
  minimizeToTray: boolean;
  minimizeToTrayOnClose: boolean;
  pomodoroDuration: number;
  shortBreakDuration: number;
  tickSoundsDuringWork: boolean;
  tickSoundsDuringBreak: boolean;
};

type RustConfig = {
  always_on_top: boolean;
  auto_start_work_timer: boolean;
  auto_start_break_timer: boolean;
  desktop_notifications: boolean;
  long_break_duration: number;
  max_round_number: number;
  minimize_to_tray: boolean;
  minimize_to_tray_on_close: boolean;
  pomodoro_duration: number;
  short_break_duration: number;
  tick_sounds_during_work: boolean;
  tick_sounds_during_break: boolean;
};

const root = document.querySelector("#app div");
invoke("load_config").then((config) => {
  let rustConfig: RustConfig = config as RustConfig;

  const app = Elm.Main.init({
    node: root,
    flags: {
      alwaysOnTop: rustConfig.always_on_top,
      autoStartWorkTimer: rustConfig.auto_start_work_timer,
      autoStartBreakTimer: rustConfig.auto_start_break_timer,
      desktopNotifications: rustConfig.desktop_notifications,
      longBreakDuration: rustConfig.long_break_duration,
      maxRoundNumber: rustConfig.max_round_number,
      minimizeToTray: rustConfig.minimize_to_tray,
      minimizeToTrayOnClose: rustConfig.minimize_to_tray_on_close,
      pomodoroDuration: rustConfig.pomodoro_duration,
      shortBreakDuration: rustConfig.short_break_duration,
      tickSoundsDuringWork: rustConfig.tick_sounds_during_work,
      tickSoundsDuringBreak: rustConfig.tick_sounds_during_break,
    },
  });

  app.ports.playSound.subscribe(function (soundElementId: string) {
    invoke("play_sound", { soundId: soundElementId });
  });

  app.ports.minimizeWindow.subscribe(function () {
    invoke("minimize_window");
  });

  app.ports.closeWindow.subscribe(function () {
    invoke("close_window");
  });

  app.ports.updateConfig.subscribe(function (config: ElmConfig) {
    invoke("update_config", {
      config: {
        always_on_top: config.alwaysOnTop,
        auto_start_work_timer: config.autoStartWorkTimer,
        auto_start_break_timer: config.autoStartBreakTimer,
        desktop_notifications: config.desktopNotifications,
        long_break_duration: config.longBreakDuration,
        max_round_number: config.maxRoundNumber,
        minimize_to_tray: config.minimizeToTray,
        minimize_to_tray_on_close: config.minimizeToTrayOnClose,
        pomodoro_duration: config.pomodoroDuration,
        short_break_duration: config.shortBreakDuration,
        tick_sounds_during_work: config.tickSoundsDuringWork,
        tick_sounds_during_break: config.tickSoundsDuringBreak,
      },
    });
  });

  app.ports.updateCurrentState.subscribe(function (state: ElmState) {
    invoke("change_icon", {
      red: state.color.r,
      green: state.color.g,
      blue: state.color.b,
      fillPercentage: state.percentage,
      paused: state.paused,
    });
  });
});
