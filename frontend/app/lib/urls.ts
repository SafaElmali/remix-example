class UrlUtil {
  static buildRootUrl() {
    return `/`;
  }

  static buildRickAndMortyUrl() {
    return `/rick-and-morty`;
  }

  static buildRickAndMortyCharacterUrl(characterId: string) {
    return `/rick-and-morty/${characterId}`;
  }

  static buildAboutUrl() {  
    return `/about`;
  }

  static buildTasksUrl() {
    return `/tasks`;
  }
}

export default UrlUtil;
