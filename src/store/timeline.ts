import { createSignal } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";

export const [visibleIndex, _setVisibleIndex] = createSignal(0);
export const [closestDate, setClosestDate] = createSignal(new Date());
export const [virtualListRef, setVirtualListRef] = createSignal<HTMLElement>();

export const setVisibleIndex = debounce((index: number) => {
  _setVisibleIndex(index);
}, 15);

export const scrollToIndex = (index = 0) => {
  if (!virtualListRef()) return;
  if (index == -1) return;
  virtualListRef()?.scrollToIndex({
    index,
    align: "end",
    behavior: "auto",
  });
};
