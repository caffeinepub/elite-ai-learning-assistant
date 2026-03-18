import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Mode, Topic } from "../backend";
import { useActor } from "./useActor";

export function useTopicHistory() {
  const { actor, isFetching } = useActor();
  return useQuery<Topic[]>({
    queryKey: ["topicHistory"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopicHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProgress() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["progress"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getProgress();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFavorites() {
  const { actor, isFetching } = useActor();
  return useQuery<Topic[]>({
    queryKey: ["favorites"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFavorites();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddTopic() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      text,
      description,
      mode,
      response,
    }: {
      text: string;
      description: string;
      mode: Mode;
      response: string;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.addTopic(text, description, mode, response);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["topicHistory"] });
      qc.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}

export function useAddFavorite() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (topicText: string) => {
      if (!actor) throw new Error("No actor");
      await actor.addFavorite(topicText);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
}

export type { Topic, Mode };
