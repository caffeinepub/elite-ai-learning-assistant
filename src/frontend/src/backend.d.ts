import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Topic {
    mode: Mode;
    text: string;
    description: string;
    response: string;
}
export enum Mode {
    exam = "exam",
    fast = "fast",
    learn = "learn",
    build = "build"
}
export interface backendInterface {
    addFavorite(topicText: string): Promise<void>;
    addTopic(topicText: string, description: string, mode: Mode, response: string): Promise<void>;
    getFavorites(): Promise<Array<Topic>>;
    getProgress(): Promise<bigint>;
    getTopicHistory(): Promise<Array<Topic>>;
}
