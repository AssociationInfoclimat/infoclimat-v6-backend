
// Was a bit over-complicated in PHP-legacy:
//  $this->userparams = json_decode($val['parametres'], true)
//  used to be like:
//   {"vignettes":["s","p","v","c","p","p","p","p"],"s":[["07480","Lyon-Bron"]]}
export enum UserVignette {
  STATION = 's',
  PHOTO = 'p',
  VIGILANCE = 'v',
  CRUE = 'c',
}
export type UserParams = {
  // 8 vignettes définies par le user :
  //  Be aware that this is not going to force the typing with exactly 8 elements, so check the length of the array
  vignettes: [
    UserVignette,
    UserVignette,
    UserVignette,
    UserVignette,
    UserVignette,
    UserVignette,
    UserVignette,
    UserVignette,
  ];
  // Stations préférées du user :
  //  qui viendront s'injectées dans l'ordre dans les vignettes (ci-dessus)
  //  Il est censé y avoir autant de stations que de vignettes de type "UserVignette.STATION"
  stations: [string, string][]; // [["07480","Lyon-Bron"], ["07149", "Orly"], ...]
};

export enum UserStatus {
  EN_ATTENTE_DE_VALIDATION = 1,
  ADHERENT = 3,
  MODERATEUR_TEMPS_CALME = 10,
  MODERATEUR_PHOTOLIVE = 11,
  MODERATEUR_VIDEOLIVE = 12,
  MODERATEUR_METEOALERTE = 13,
  MODERATEUR_FORUMS = 14,
  GESTIONNAIRE_MAILS = 15,
  GESTIONNAIRE_RESEAUX = 16,
  GESTIONNAIRE_STATIC = 17,
  GESTIONNAIRE_CLIMATO = 18,
  GESTIONNAIRE_DONNEES = 19,
  PREVISIONNISTE_REGIONAL = 20,
  PREVISIONNISTE_NATIONAL = 21,
  GESTIONNAIRE_ACTUALITES = 23,
  RESPONSABLE_TECHNIQUE = 40,
  ADMINISTRATEUR = 50,
  MEMBRE_BUREAU = 60,
  BANNI = 99,
}

export type User = {
  id: number;
  pseudo: string;
  statuses: UserStatus[];
  params: UserParams;
};
