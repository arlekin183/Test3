export type EpisodeCharacter = string | Character;

type ResponseType = Character | Episode;

export interface Character {
    id: number;
    url: string;
}

export interface Episode {
    characters: Array<EpisodeCharacter>
}

export interface RMResponse {
    info: {
        pages: number;
    },
    results: Array<ResponseType>;
}