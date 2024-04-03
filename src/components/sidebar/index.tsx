import { createEffect, createSignal, createMemo, For } from "solid-js";
import styles from "./Timeline.module.scss";
import { store } from "~/store";
import {
  visibleIndex,
  scrollToIndex,
  closestDate,
  setClosestDate,
} from "~/store/timeline";

let scrollRef: HTMLDivElement;
let scrubRef: HTMLDivElement;

function isToday(date: Date) {
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

const countEntriesByDate = (map: Map<any, any>, targetDate: Date) => {
  let count = 0;
  const targetDateString = targetDate.toISOString().substring(0, 10);
  for (const [key, value] of map.entries()) {
    try {
      const createdAtDate = new Date(value.createdAt);
      const localDateString = new Date(
        createdAtDate.getFullYear(),
        createdAtDate.getMonth(),
        createdAtDate.getDate(),
      )
        .toISOString()
        .substring(0, 10);
      if (localDateString === targetDateString) {
        count++;
      }
    } catch (error) {}
  }
  return count;
};

const renderCount = (count: number) => {
  const maxDots = Math.min(count, 48);
  return (
    <div class={styles.counts}>
      <For each={Array.from({ length: maxDots }, (_, i) => i)}>
        {(_, i) => <div class={styles.count} />}
      </For>
    </div>
  );
};

const DayComponent = ({
  date,
  scrollToDate,
}: {
  date: Date;
  scrollToDate: (date: Date) => void;
}) => {
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  const dayName = dayNames[date.getDay()];
  const dayNumber = date.getDate();
  const count = countEntriesByDate(store.index, date);
  return (
    <div
      onClick={() => {
        scrollToDate(date);
      }}
      class={`${styles.day} ${isToday(date) && styles.today} ${dayName == "S" && styles.monday}`}
    >
      {renderCount(count)}
      <div class={styles.dayLine}> </div>
      <div class={styles.dayName}> {dayName} </div>
      <div class={styles.dayNumber}> {dayNumber} </div>
    </div>
  );
};

const WeekComponent = ({
  startDate,
  endDate,
  scrollToDate,
}: {
  startDate: Date;
  endDate: Date;
  scrollToDate: (date: Date) => void;
}) => {
  const weekOfMonth = Math.floor(startDate.getDate() / 7) + 1;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[startDate.getMonth()];
  const year = startDate.getFullYear();
  let days = [];
  for (
    let date = new Date(startDate);
    date <= endDate;
    date.setDate(date.getDate() + 1)
  ) {
    days.push(
      <DayComponent date={new Date(date)} scrollToDate={scrollToDate} />,
    );
  }

  const weekOfMonthText = () => {
    switch (weekOfMonth) {
      case 1:
        return "1st week";
        break;
      case 2:
        return "2nd week";
        break;
      case 3:
        return "3rd week";
        break;
      case 4:
        return "4th week";
        break;
      default:
        return "";
    }
  };

  return (
    <div class={styles.week}>
      <div class={styles.text}>
        {monthName.substring(0, 3)} {year}
      </div>
      {days.reverse()}
      <div class={styles.line}> </div>
    </div>
  );
};

const Timeline = () => {
  const [parentEntries, setParentEntries] = createSignal<any[]>([]);

  createEffect(() => {
    if (!store.index) return;
    const onlyParentEntries = Array.from(store.index).filter(
      ([key, metadata]) => !metadata.isReply,
    );
    setParentEntries(onlyParentEntries);
  });

  createEffect(() => {
    if (!parentEntries() || parentEntries().length == 0) return;
    if (visibleIndex() == 0) return;
    let current;
    if (
      parentEntries() &&
      visibleIndex() > 0 &&
      parentEntries()[visibleIndex() - 1]
    ) {
      current = parentEntries()[visibleIndex() - 1][1];
    }
    if (!current) return;
    const createdAt = current.createdAt;
    setClosestDate(createdAt);
  });

  const scrollToDate = (targetDate: Date) => {
    try {
      let closestIndex = -1;
      let smallestDiff = Infinity;

      parentEntries().forEach((post, index) => {
        let postDate = new Date(post[1].createdAt);
        let diff = Math.abs(targetDate - postDate);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          closestIndex = index;
        }
      });
      scrollToIndex(closestIndex);
    } catch (error) {
      console.error("Failed to scroll to entry", error);
    }
  };

  const getWeeks = () => {
    let weeks = [];
    let now = new Date();
    now.setHours(0, 0, 0, 0);

    let weekEnd = new Date(now);

    // If it's not Monday, find the previous Monday
    while (now.getDay() !== 1) {
      now.setDate(now.getDate() - 1);
    }

    let weekStart = new Date(now);
    weeks.push({ start: weekStart, end: weekEnd });

    for (let i = 0; i < 25; i++) {
      weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() - 1);
      weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);
      weeks.push({ start: new Date(weekStart), end: new Date(weekEnd) });
    }

    return weeks;
  };

  const createWeeks = () =>
    getWeeks().map((week, index) => (
      <WeekComponent
        startDate={week.start}
        endDate={week.end}
        scrollToDate={scrollToDate}
      />
    ));

  createEffect(() => {
    if (!scrubRef) return;
    if (!scrollRef) return;
    let oneDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const past = new Date(closestDate());
    let diffInMilliSeconds = Math.abs(now - past);
    let diffInDays = Math.round(diffInMilliSeconds / oneDay);

    let scrollOffset = 0;
    const distanceFromTop = 22 * diffInDays + 10;

    if (distanceFromTop > 400) {
      scrollOffset = distanceFromTop - 300;
    } else {
      scrollOffset = 0;
    }

    scrollRef.scroll({
      top: scrollOffset,
      behavior: "smooth",
    });

    scrubRef.style.top = distanceFromTop + "px";
  });

  return (
    <div ref={scrollRef} class={styles.timeline}>
      <For each={getWeeks()}>
        {(week) => (
          <WeekComponent
            startDate={week.start}
            endDate={week.end}
            scrollToDate={scrollToDate}
          />
        )}
      </For>
      <div ref={scrubRef} class={styles.scrubber}>
        {" "}
      </div>
    </div>
  );
};

export default Timeline;
