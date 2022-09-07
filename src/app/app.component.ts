import { Component, OnInit } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApiService } from './api.service';
import { Character, Episode, EpisodeCharacter, RMResponse } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  subscription: Subscription | undefined;
  charactersMap: Map<string, Character> = new Map();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.subscription = this.apiService.getCharacters()
    .pipe(
      switchMap((responseCharacterData: RMResponse) => {
        this.fillCharactersMap(<Array<Character>>responseCharacterData.results, this.charactersMap);
        const paginationRequestsArray = [];
        for (let index = 2; index <= responseCharacterData.info.pages; index++) {
          paginationRequestsArray.push(this.apiService.getCharacters(index))          
        }
        return forkJoin(paginationRequestsArray);
      }),
      switchMap((responseCharacterDatas: Array<RMResponse>) => {
        responseCharacterDatas.forEach((response: RMResponse) => {
          this.fillCharactersMap(<Array<Character>>response.results, this.charactersMap);
        });
        return this.apiService.getEpisodes()
      }),
      switchMap((responseEpisodesData: RMResponse) => {
        responseEpisodesData.results.forEach((episode: any) => this.fillEpisodesCharacters(episode, this.charactersMap));
        const paginationRequestsArray = [];
        for (let index = 2; index <= responseEpisodesData.info.pages; index++) {
          paginationRequestsArray.push(this.apiService.getEpisodes(index))
        }
        return forkJoin(paginationRequestsArray);
      }),
    )
    .subscribe((responseDatas: Array<RMResponse>) => {
      responseDatas.forEach((response: RMResponse) => {
        (<Array<Episode>>response.results).forEach((episode: Episode) => this.fillEpisodesCharacters(episode, this.charactersMap));
      })
    });
  }

  fillCharactersMap(characters: Array<Character>, charactersMap: Map<string, Character>){
    characters.forEach((character: Character) => {
      charactersMap.set(character.url, character);
    });
  }

  fillEpisodesCharacters(episode: Episode, charactersMap: Map<string, Character>) {
    episode.characters = episode.characters.map((character: EpisodeCharacter) => <Character>charactersMap.get(<string>character));
    console.log(episode);
  }

  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }
}
