import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthRepository } from './auth.repository';
import { base64Decode, Decrypte } from './auth.utils';
import { ConfigService } from 'src/config/config.service';
import { FunctionLogger } from 'src/shared/utils';

@Injectable()
export class AuthService {
  private readonly logger = new FunctionLogger(AuthService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async verifyCookieToAccountId(cookie: string) {
    try {
      const decodedCookie = decodeURIComponent(cookie);
      const cook = decodedCookie.split('/');
      const accountIdToText = Decrypte(
        base64Decode(cook[0]),
        `${this.configService.get('SALT_AUTH_KEY')}`,
      );
      const tokenToTest = cook[1];
      const accountId = await this.verifyToken({
        accountId: parseInt(accountIdToText),
        tokenToVerify: tokenToTest,
      });
      if (!accountId) {
        throw new Error('errors.auth.invalid_token');
      }
      return accountId;
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }

  private async verifyToken({
    tokenToVerify,
    accountId,
  }: {
    tokenToVerify: string;
    accountId: number;
  }): Promise<number | null> {
    const token = await this.authRepository.verifyToken({
      tokenToVerify: tokenToVerify,
      accountId,
    });
    if (!token) {
      throw new Error('errors.auth.token_not_found');
    }
    return accountId;
  }
}

/*

<?php

function does_array_overlaps_other_array(array $array, array $other_array): bool
{
    return count(array_intersect($array, $other_array)) > 0;
}

function is_array_included_in_other_array(array $array, array $other_array): bool
{
    return count(array_diff($array, $other_array)) === 0;
}

if (!defined('API_VERSION') && !defined('API_METHOD')) {
    session_start();
}

const EN_ATTENTE_DE_VALIDATION = 1;
const ADHERENT = 3;
const MODERATEUR_TEMPS_CALME = 10;
const MODERATEUR_PHOTOLIVE = 11;
const MODERATEUR_VIDEOLIVE = 12;
const MODERATEUR_METEOALERTE = 13;
const MODERATEUR_FORUMS = 14;
const GESTIONNAIRE_MAILS = 15;
const GESTIONNAIRE_RESEAUX = 16;
const GESTIONNAIRE_STATIC = 17;
const GESTIONNAIRE_CLIMATO = 18;
const GESTIONNAIRE_DONNEES = 19;
const PREVISIONNISTE_REGIONAL = 20;
const PREVISIONNISTE_NATIONAL = 21;
const GESTIONNAIRE_ACTUALITES = 23;
const RESPONSABLE_TECHNIQUE = 40;
const ADMINISTRATEUR = 50;
const MEMBRE_BUREAU = 60;
const BANNI = 99;


require_once __DIR__ . '/crypto.php';

class utilisateur
{
    public $id_compte = -1;
    public $statuts = array(0);
    public $statut_texte = '';

    // COMPTE
    public $compte_recupere = 0;
    public $pseudo = '';
    public $confidentialite = -1;
    public $confidentialite_identite = -1;

    // IDENTITE
    public $identite_recuperee = 0;
    public $nom = '';
    public $prenom = '';
    public $civilite = '';
    public $date_naissance = '';
    public $lieu_naissance = '';
    public $profession = '';
    public $id_personne = 0;
    public $passion_autres = '';
    public $passion_meteo = '';

    // COORDONNEES
    public $coordonnees_recuperees = 0;
    public $adresse_email = [];
    public $adresse_windows_live_messenger;
    public $adresse_yahoo_messenger;
    public $adresse_icq;
    public $adresse_aim_messenger;
    public $telephone_fixe_domicile;
    public $telephone_mobile_personnel;
    public $telephone_fixe_professionnel;
    public $telephone_mobile_professionnel;
    public $site_internet;
    public $blog;
    public $facebook;

    // PARAMS
    public $userparams;
    public $estvalide = false;

    public $externe = false;

    public $error; 

    private $lnk = null;
    private $pdostor = null;
    private $rememberMe = null;

    public function __construct($id = 0)
    {
        global $cle;

        if ($id !== 0 && is_numeric($id) && !is_null($id) && $id !== '') {
            $this->id_compte = (int) $id;
            $statuses_statement = connexionSQL('V5')->query(<<<SQL
                SELECT statuts
                FROM V5.comptes
                WHERE id = {$this->id_compte}
                LIMIT 1
            SQL);
            $statuses = $statuses_statement->fetch(PDO::FETCH_ASSOC);
            $this->statuts = explode(',', $statuses['statuts']);
            $this->externe = true;
        } elseif (!empty($_COOKIE['f_r_cookie'])) {
            // methode d'auth via V5.comptes_tokens
            $this->lnk = connexionSQL('V5');
            $cook = explode('/', urldecode($_COOKIE['f_r_cookie']));
            $test_idc = Decrypte(base64_decode($cook[0]), '<SALT KEY>');
            $req = $this->lnk->prepare(<<<SQL
                SELECT *
                FROM V5.comptes_tokens
                WHERE
                    id_compte = :id_compte
                    AND token = :token
            SQL);
            $req->execute([
                'id_compte' => $test_idc,
                'token'     => $cook[1]
            ]);
            $res = $req->fetch(PDO::FETCH_ASSOC);
            if ($res) {
                // token trouvé
                $this->id_compte = intval($res['id_compte']);
                $statuses_statement = $this->lnk->query(<<<SQL
                    SELECT statuts
                    FROM V5.comptes
                    WHERE id = {$this->id_compte}
                    LIMIT 1
                SQL);
                $statuses = $statuses_statement->fetch(PDO::FETCH_ASSOC);
                if (!$statuses) {
                    // l'utilisateur n'existe plus
                    $this->id_compte = -1;
                } else {
                    $this->statuts = explode(',', $statuses['statuts']);
                    $_SESSION['f_remember'] = true;
                    $_SESSION['f_userid'] = $this->id_compte;
                }
            }
        }
       

        foreach ($this->statuts as $k => $v) {
            $this->statuts[$k] = intval($v);
        }

        if ($this->id_compte <= 0 || $this->has_status(0)) {
            $this->estvalide = false;
            return false;
        } elseif ($this->has_status(EN_ATTENTE_DE_VALIDATION)) {
            $this->estvalide = false;
        } elseif ($this->has_status(BANNI)) {
            if (!$this->externe) {
                exit('<p class="error">Votre compte est suspendu.<br />webmasters@infoclimat.fr</p>');
            }
            $this->estvalide = false;
        } else {
            $this->estvalide = true;
        }
    }

    public function _cache()
    {
        // met les données publiques de l'user en cache pour réutilisation rapide
        if (!$this->compte_recuper) {
            $this->recuperer_compte();
        }
        return apc_store("userinfo:{$this->id_compte}", get_object_vars($this), 3600);
    }

    public function est_ami_de()
    {
        return false;
    }

    private function has_status(int $status)
    {
        return in_array($status, $this->statuts);
    }

    private function has_some_statuses(array $statuses)
    {
        return does_array_overlaps_other_array($statuses, $this->statuts);
    }

    private function has_every_statuses(array $statuses)
    {
        return is_array_included_in_other_array($statuses, $this->statuts);
    }

    public function est_historic()
    {
        return $this->has_some_statuses([60, 50, 40, 22]);
    }

    public function estAdminConcours()
    {
        if ($this->has_some_statuses([60, 50])) {
            return true;
        }
        $ADMIN_IDS_CONCOURS = [
            43,
        ];
        return in_array($this->id_compte, $ADMIN_IDS_CONCOURS);
    }

    public function est_bqs()
    {
        $req = connexionSQL('V5_chroniques', false)->query(<<<SQL
            SELECT etat
            FROM bqs_users
            WHERE
                etat = 1
                AND id_compte = {$this->id_compte}
        SQL);
        return $req->rowCount() > 0;
    }

    public function estAmiAvec($id_ami)
    {
    }

    public function listeAmis()
    {
    }

    public function hasPhoto()
    {
        $hash = md5("{$this->id_compte}<HASH_KEY>");
        $prefix = substr($hash, 0, 1);
        return is_file(__ROOT__ . "/passionnes/photos/img/{$prefix}/{$hash}.jpg");
    }

    public function getPhoto()
    {
        $hash = md5("{$this->id_compte}<HASH_KEY>");
        $prefix = substr($hash, 0, 1);
        return "/{$prefix}/{$hash}.jpg";
    }

    public function getLieuxPreferes()
    {
        $res = connexionSQL('V5')->query(<<<SQL
            SELECT
                id,
                id_compte,
                lieu,
                dept,
                pays,
                geoid,
                lat,
                lon,
                is_master
            FROM V5.lieux_preferes
            WHERE id_compte = {$this->id_compte}
            ORDER BY is_master DESC, lieu ASC
        SQL);
        $sortie = array();
        $n = 0;
        while ($rep = $res->fetch(PDO::FETCH_ASSOC)) {
            $n++;
            $sortie[$n]['lieu']   = $rep['lieu'];
            $sortie[$n]['dept']   = $rep['dept'];
            $sortie[$n]['pays']   = $rep['pays'];
            $sortie[$n]['lat']    = $rep['lat'];
            $sortie[$n]['lon']    = $rep['lon'];
            $sortie[$n]['geoid']  = $rep['geoid'];
            $sortie[$n]['master'] = $rep['is_master'];
        }
        return $sortie;
    }

    public function est_gestionnaire_actualites()
    {
        if ($this->has_status(GESTIONNAIRE_ACTUALITES)) {
            return 1;
        }
        return 0;
    }

    public function est_previsionniste_national()
    {
        return $this->has_status(PREVISIONNISTE_NATIONAL);
    }

    public function est_previsionniste()
    {
        return $this->has_some_statuses([PREVISIONNISTE_REGIONAL, PREVISIONNISTE_NATIONAL]);
    }

    public function est_valide()
    {
        return $this->estvalide;
    }

    public function est_banni()
    {
        if ($this->has_status(BANNI)) {
            return 1;
        }
        return 0;
    }

    public function est_adherent()
    {
        if ($this->has_status(ADHERENT)) {
            return 1;
        } else {
            return 0;
        }
    }

    public function a_ete_adherent_en($annee)
    {
    }

    public function est_equipe()
    {
        return $this->has_some_statuses([
            MEMBRE_BUREAU,
            ADMINISTRATEUR,
            RESPONSABLE_TECHNIQUE,
            MODERATEUR_TEMPS_CALME,
            MODERATEUR_PHOTOLIVE,
            MODERATEUR_VIDEOLIVE,
            MODERATEUR_METEOALERTE,
            MODERATEUR_FORUMS,
            GESTIONNAIRE_MAILS,
            GESTIONNAIRE_RESEAUX,
            GESTIONNAIRE_STATIC,
            GESTIONNAIRE_CLIMATO,
            GESTIONNAIRE_DONNEES,
            GESTIONNAIRE_ACTUALITES
        ]);
    }

    public function est_moderateur_temps_calme()
    {
        if ($this->has_some_statuses([MODERATEUR_TEMPS_CALME, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_moderateur_photolive()
    {
        if ($this->has_some_statuses([MODERATEUR_PHOTOLIVE, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_moderateur_videolive()
    {
        if ($this->has_some_statuses([MODERATEUR_VIDEOLIVE, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_moderateur_meteoalerte()
    {
        if ($this->has_some_statuses([MODERATEUR_METEOALERTE, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_moderateur_forums()
    {
        if ($this->has_some_statuses([MODERATEUR_FORUMS, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_gestionnaire_mails()
    {
        if ($this->has_some_statuses([GESTIONNAIRE_MAILS, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_gestionnaire_reseaux()
    {
        if ($this->has_some_statuses([GESTIONNAIRE_RESEAUX, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_gestionnaire_static()
    {
        if ($this->has_some_statuses([GESTIONNAIRE_STATIC, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_gestionnaire_climato()
    {
        if ($this->has_some_statuses([GESTIONNAIRE_CLIMATO, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_gestionnaire_donnees()
    {
        if ($this->has_some_statuses([GESTIONNAIRE_DONNEES, RESPONSABLE_TECHNIQUE])) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_responsable_technique()
    {
        if ($this->has_status(RESPONSABLE_TECHNIQUE)) {
            return 1;
        } else {
            return 0;
        }
    }

    public function est_administrateur()
    {
        if ($this->has_status(ADMINISTRATEUR)) {
            //if($this->id_compte == 0x304f || $this->id_compte == 0x19) sleep(1);
            return 1;
        } else {
            return 0;
        }
    }

    public function est_membre_bureau()
    {
        if ($this->has_status(MEMBRE_BUREAU)) {
            return 1;
        } else {
            return 0;
        }
    }

    public function recuperer_identite()
    {
        $res = connexionSQL('V5')->query(<<<SQL
            SELECT *
            FROM V5.personnes
            WHERE id_compte = {$this->id_compte}
        SQL);
        //$res = mysql_query("SELECT * FROM V5.personnes WHERE id_compte='".$this->id_compte."'");
        if ($val = $res->fetch(PDO::FETCH_ASSOC)) {
            //$this->pseudo = $val["pseudo"];
            $this->nom                      = $val['nom'];
            $this->prenom                   = $val['prenom'];
            $this->civilite                 = $val['civilite'];
            $this->date_naissance           = $val['date_naissance'];
            $this->lieu_naissance           = $val['lieu_naissance'];
            $this->passion_meteo            = $val['passion_meteo'];
            $this->passion_autres           = $val['passion_autres'];
            $this->profession               = $val['profession'];
            $this->id_personne              = $val['id'];
            $this->confidentialite_identite = $val['confidentialite'];
            $this->identite_recuperee       = 1;
        } else {
            //$error->afficher_message(); //DEBUG
        }
    }

    public function get_statuts_texte()
    {
        $statuses_list_string = implode(',', array_map(fn ($s) =>  "'{$s}'", $this->statuts));
        $res = connexionSQL('V5')->query(<<<SQL
            SELECT statut
            FROM V5.comptes_statuts
            WHERE id IN ({$statuses_list_string})
        SQL);
        $s = '<ul>';
        while ($val = $res->fetch(PDO::FETCH_ASSOC)) {
            $s .= "<li>{$val['statut']}</li>";
        }
        $s .= '</ul>';
        return $s;
    }

    public function get_statuts_description()
    {
        $statuses_list_string = implode(',', array_map(fn ($s) =>  "'{$s}'", $this->statuts));
        $res = connexionSQL('V5')->query(<<<SQL
            SELECT description
            FROM V5.comptes_statuts
            WHERE id IN ({$statuses_list_string})
        SQL);
        $s = '';
        while ($val = $res->fetch(PDO::FETCH_ASSOC)) {
            $s .= $val['description'] . '<br />';
        }
        return $s;
    }

    public function recuperer_compte()
    {
        $res = mysql_query(<<<SQL
            SELECT *
            FROM V5.comptes
            WHERE id = '{$this->id_compte}'
        SQL);
        $val = mysql_fetch_array($res);
        $this->pseudo = $val['pseudo'];
        $this->confidentialite = $val['confidentialite'];
        $this->compte_recupere = 1;
        $this->userparams = json_decode($val['parametres'], true);
    }

    public function get_parametres()
    {
        if (!$this->compte_recupere) {
            $this->recuperer_compte();
        }
        return $this->userparams;
    }

    public function get_pseudo()
    {
        if ($this->id_compte <= 0 || is_null($this->id_compte)) {
            return 'Inconnu';
        }
        if (!empty($_COOKIE['pseudo']) && !$this->externe && false) { //désactivé
            return $_COOKIE['pseudo'];
        } else {
            if (!$this->compte_recupere) {
                $this->recuperer_compte();
            }
            return $this->pseudo;
        }
    }

    public function get_confidentialite()
    {
        if (!$this->compte_recupere) {
            $this->recuperer_compte();
        }
        return $this->confidentialite;
    }

    public function get_nom()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        return $this->nom;
    }

    public function get_prenom()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        return $this->prenom;
    }

    public function get_civilite()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        return $this->civilite;
    }

    public function get_date_naissance()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        return $this->date_naissance;
    }

    public function get_lieu_naissance()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        return $this->lieu_naissance;
    }

    public function get_profession()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        return $this->profession;
    }

    public function get_id_personne()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        return $this->id_personne;
    }

    public function get_confidentialite_identite()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        $conf_gen = $this->get_confidentialite();
        if ($conf_gen > $this->confidentialite_identite) {
            return $conf_gen;
        } else {
            return $this->confidentialite_identite;
        }
    }

    public function recuperer_coordonnees()
    {
        if ($this->coordonnees_recuperees != 1) {
            $res = mysql_query(<<<SQL
                SELECT *
                FROM V5.personnes_coordonnees
                WHERE id_personne = '{$this->id_personne}'
            SQL);
            while ($val = mysql_fetch_array($res)) {
                if ($val['type'] == '0') {
                    $this->adresse_email[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '1') {
                    $this->adresse_windows_live_messenger[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '2') {
                    $this->adresse_yahoo_messenger[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '3') {
                    $this->adresse_icq[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '4') {
                    $this->adresse_aim_messenger[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '10') {
                    $this->telephone_fixe_domicile[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '11') {
                    $this->telephone_mobile_personnel[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '12') {
                    $this->telephone_fixe_professionnel[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '13') {
                    $this->telephone_mobile_professionnel[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '20') {
                    $this->site_internet[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '21') {
                    $this->blog[$val['coordonnee']] = $val['confidentialite'];
                }
                if ($val['type'] == '22') {
                    $this->facebook[$val['coordonnee']] = $val['confidentialite'];
                }
                $this->coordonnees_recuperees = 1;
            }
            if (mysql_num_rows($res) == 0) {
                $error->afficher_message(); //  DEBUG 
            }
        }
    }

    public function get_email()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }

        $p = array_keys($this->adresse_email);
        return $p[0];
    }

    public function get_adresse_email()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->adresse_email;
    }

    public function get_adresse_windows_live_messenger()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->adresse_windows_live_messenger;
    }

    public function get_adresse_yahoo_messenger()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->adresse_yahoo_messenger;
    }

    public function get_adresse_icq()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->adresse_icq;
    }

    public function get_adresse_aim_messenger()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->adresse_aim_messenger;
    }

    public function get_telephone_fixe_domicile()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->telephone_fixe_domicile;
    }

    public function get_telephone_mobile_personnel()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->telephone_mobile_personnel;
    }

    public function get_telephone_fixe_professionnel()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->telephone_fixe_professionnel;
    }

    public function get_telephone_mobile_professionnel()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->telephone_mobile_professionnel;
    }

    public function get_site_internet()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->site_internet;
    }

    public function get_blog()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->blog;
    }

    public function get_facebook()
    {
        if (!$this->identite_recuperee) {
            $this->recuperer_identite();
        }
        if (!$this->coordonnees_recuperees) {
            $this->recuperer_coordonnees();
        }
        return $this->facebook;
    }
}

if (!defined('DO_NOT_INITIALIZE_USER')) {
    $utilisateur = new utilisateur();
}

*/
