import {
  SCENE_EMPTY_LABEL,
  SCENE_SOURCE_LABELS,
} from "@/constants/scene.constants";

export function formatSceneSummary(count: number) {
  if (count === 0) {
    return SCENE_EMPTY_LABEL;
  }
  const label =
    count === 1 ? SCENE_SOURCE_LABELS.SINGULAR : SCENE_SOURCE_LABELS.PLURAL;
  return `${count} ${label}`;
}
