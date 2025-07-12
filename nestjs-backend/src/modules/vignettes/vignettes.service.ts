import { Injectable } from '@nestjs/common';
import { User, UserVignette } from '../user/user.types';
import { DEFAULT_USER_PARAMS } from '../user/user.constants';
import { FunctionLogger } from 'src/shared/utils';
import { IcLegacyIncludeApiClientService } from '../ic-legacy-include-api/ic-legacy-include-api-client.service';
import { VignettesReponse } from './vignettes.types';

@Injectable()
export class VignettesService {
  private readonly logger = new FunctionLogger(VignettesService.name);
  constructor(
    private readonly icLegacyIncludeApiClient: IcLegacyIncludeApiClientService,
  ) {}

  //
  // Used to be like this:
  //
  // if (!$utilisateur->est_valide()) {
  //     $vignettes = ['s', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];
  //     $s = [];
  //     $s[0][0] = '07149';
  //     $s[0][1] = 'Orly';
  // } else {
  //     $params_array = $utilisateur->get_parametres();
  //     $vignettes = $params_array['vignettes'];
  //     $s = $params_array['s'];
  //     if (empty($vignettes)) {
  //         $vignettes = ['s', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'];
  //         $s = [];
  //         $s[0][0] = '07149';
  //         $s[0][1] = 'Orly';
  //     }
  // }
  //
  // Then $vignettes was used in the header (bandeau5.2.php)
  //  In that file, the $vignettes were converted in something more complicated according to their type:
  //  Using a foreach + a if-case-else, it was printing the vignettes in the header
  //  We are going to compute them here:
  //
  // We are going to NOT process the k=7, and k=8 cases because they are corner. TODO: Process them later.
  //
  async getUserVignettes(user?: User): Promise<VignettesReponse> {
    try {
      const userPrefs = !user ? DEFAULT_USER_PARAMS : user.params;

      const selectedVignettes = userPrefs.vignettes;
      const selectedStations = userPrefs.stations;

      console.log(userPrefs);

      const timeKey = Date.now();

      const vignettes: VignettesReponse['vignettes'] = [];
      let photoIndex = 0;
      let stationIndex = 0;
      for (const selectedVignette of selectedVignettes) {
        if (selectedVignette === UserVignette.PHOTO) {
          vignettes.push({
            type: 'photo',
            timeKey: timeKey,
            backgroundPosition: [photoIndex * 90 - 90, 0],
          });
          photoIndex++;
        } else if (selectedVignette === UserVignette.STATION) {
          const stationHtml =
            await this.icLegacyIncludeApiClient.fetchIncludePathFile({
              path: `/vignettes/stations-meteo/${encodeURIComponent(
                selectedStations[stationIndex][0],
              )}.html`,
            });
          vignettes.push({
            type: 'station',
            contentAsHtml: stationHtml,
          });
          stationIndex++;
        } else if (selectedVignette === UserVignette.VIGILANCE) {
          vignettes.push({
            type: 'vigilance',
            contentAsHtml: `
          <li class="boite_photo boite_photo_vigilances">
            <a
                onclick="window.open(this.href);return false;"
                href="https://vigilance.meteofrance.fr/fr"
            >
                <img
                    src="/vigi/current.png?${timeKey}"
                    alt="Vigilance M&eacute;t&eacute;oFrance"
                    title="Cliquez pour acc&eacute;der au site"
                />
            </a>
            <a
                href="https://vigilance.encelade.cloud/live"
                target="_blank"
                onclick="window.open(this.href, '_blank');return false;"
                class="encelade"
            >
                ▶
            </a>
          </li>
          `,
          });
        } else if (selectedVignette === UserVignette.CRUE) {
          vignettes.push({
            type: 'crue',
            contentAsHtml: `
          <li class="boite_photo">
            <a onclick="window.open(this.href);return false;" href="https://www.vigicrues.gouv.fr"><img src="https://www.vigicrues.gouv.fr/ftp/cruemax.png" alt="Vigicrues" title="Vigicrues - cliquez pour acc&eacute;der au site" /></a>
          </li>
          `,
          });
        }
      }
      return {
        vignettes,
        photosSpriteUrl:
          'https://www.infoclimat.fr/photolive/vignettes/sprite.jpg',
      };
    } catch (error) {
      this.logger.error(`${error}`);
      throw error;
    }
  }
}

/*
$nb_total = count($vignettes);
$s_n = 0;
$nb_photolive = 1;
$tttkey = time();
foreach ($vignettes as $k => $vignette) {
    if ($k >= 8) {
        break;
    }
    if ($k == 8) {
        ?>
        <li class="boite_photo">
            <a href="/videolive-videos-meteo-temps-reel.html">
                <img src="/videolive/last.jpg" alt="Videolive" />
            </a>
        </li>
        <?php
    }
    if ($k == 7) {
        // adhésion en attente de paiement
        $YYYY = date('Y');
        $r = $lnk->query(
            <<<SQL
            SELECT COUNT(*) 
            FROM asso.asso_adherants
            WHERE annee = {$YYYY}
                AND etat = '2'
                AND mode_reglement = 'systempay'
                AND id_compte = {$utilisateur->id_compte}
            SQL
        )->fetchColumn();
        if ($r) {
            define('PAIEMENT_ADH_EN_ATTENTE', true);
            ?>
            <li>
                <div class="logo-asso card-panel white" style="padding:4px 0; color:#333; margin:0; margin-top:-4px">
                    <b>Vous soutenez l'asso, merci !</b><br>
                    <a
                        href="https://asso.infoclimat.fr/adherer"
                        style="margin-top:5px"
                    >cotisation en attente de paiement&nbsp;&raquo;</a>
                </div>
            </li>
            <?php
            continue;
        }
    } elseif ($k == 5 && ($afficher_message_adhesion || $utilisateur->est_administrateur()) && empty($_COOKIE['hide_adhesion_bandeau'])) {
        $__coeur = $_pageCharset == 'utf-8' ? '❤️ ' : '';
        $__jaime = $_pageCharset == 'utf-8' ? ' 👍' : '';

        ?>
        <style type="text/css">
            .growOnHover:hover {
                transform: scale(1.1);
            }

            .adhCurseur {
                width: 250px;
                margin: 0 auto;
                
                height: 3px;
                position: relative;
                border-radius: 3px;
                background: rgba(0, 0, 0, 0.1);
                margin-bottom: 4px;
            }

            .adhCurseur > div {
                background: green;
                height: 100%;
                position: absolute;
                top: 0;
                border-radius: 3px;
            }

            .adhCurseur > span {
                position: absolute;
                font-size: 10px;
                line-height: 12px;
                color: black;
            }
        </style>
        <li class="boite_photo">
            <div class="card-panel black-text" style="padding:2px 4px; display:inline-block; height:80px; width:315px; margin-top:0; background-image: radial-gradient( circle 592px at 48.2% 50%,  rgba(255,255,249,0.6) 0%, rgba(160,199,254,1) 74.6% ); margin-top:-8px; position:relative; margin-left: 8px; ">
                <!--<a style="position:absolute; right:0; top:0; padding:2px; text-decoration:none"  href="#" onclick="document.cookie = 'hide_adhesion_bandeau=yes; path=/; max-age=2678400'; document.location.reload(); return false;">&times;</a>-->
                <b style="font-size:1.2em; font-family:Exo,sans-serif;">
                    100% gratuit &bull; 0% pub &bull; comment ?!
                </b><br>
                <div style="margin-bottom:4px">
                    <?php if ($utilisateur->est_adherent()) { ?>
                        Merci infiniment pour votre adh&eacute;sion.<br>
                        <!--Objectif quasi-atteint pour recruter notre 1<sup>er</sup> salari&eacute; !-->
                        Gr&acirc;ce &agrave; vous, Infoclimat peut &ecirc;tre p&eacute;rennis&eacute;.
                    <?php } else { ?>
                        Gr&acirc;ce &agrave; des dizaines de b&eacute;n&eacute;voles, des milliers d'adh&eacute;rents et de donateurs, Infoclimat est rendu possible. Vous aussi, rejoignez-les !
                    <?php } ?>
                </div>
                <div class="adhCurseur" style="margin-bottom:10px">
                    <div class="tipsy-trigger" style="width:<?= $pc_barre_adh ?>%; background:linear-gradient(to left, #1d976c, #93f9b9)" title="Adh&eacute;sions : <?= $somme_adh ?>&euro;"></div><!--adh+dons-->
                    <div class="tipsy-trigger" style="width:<?= $pc_barre_don ?>%; background:linear-gradient(to left, #56ab2f, #a8e063);" title="Dons : <?= $somme_don ?>&euro;"></div><!--dons-->
                    <span style="right:0; top:0;">objectif 207.520&euro; &rarr; </span>
                </div>
                <a
                    class="growOnHover btn-small waves-effect waves-light btn white black-text hoverable"
                    style="height:26px; line-height:26px; background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);"
                    href="https://asso.infoclimat.fr/infos/formulaire.php"
                ><?= $__coeur ?>Adh&eacute;rer</a>
                <a
                    class="growOnHover btn-small waves-effect waves-light btn white black-text hoverable"
                    style="height:26px; line-height:26px; margin-left:12px; background-image: linear-gradient(-40deg, #fdcbf1 0%, #fdcbf1 1%, #e6dee9 100%);"
                    onclick="return IC_don_affiche_popup();"
                    href="https://asso.infoclimat.fr/infos/don.php"
                >Donner<?= $__jaime ?></a>
                <a
                    title="Pourquoi soutenir ?" class="tipsy-trigger growOnHover btn-small waves-effect waves-light btn white black-text hoverable"
                    style="height:26px; line-height:26px; background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%); padding:0 6px; margin-left:12px"
                    href="https://asso.infoclimat.fr/infos/"
                ><i class="material-icons">help</i></a>
            </div>
        </li>
        <?php
        break;
    }
    if ($vignette == 'p') {
        ?>
        <li class="boite_photo">
            <a
                href="/accueil/pass.php?a=<?= $nb_photolive ?>"
                style="overflow:hidden;box-shadow:0 0 3px #000;width:90px;height:70px;display:inline-block;background-image:url(/photolive/vignettes/sprite.jpg?tk<?= $tttkey ?>);background-position:-<?= $nb_photolive * 90 - 90 ?>px 0px;text-decoration:none;border-radius:4px"
                onmouseover="$(this).find('div').show().find('div').html(`${JSON_PL['v<?= $nb_photolive ?>v']||''}<br />${JSON_PL['l<?= $nb_photolive ?>l']||''}`).show();"
                onclick="$(this).attr('href',JSON_PL['photourl'.$nb_photolive.'x']);"
                class="lien_photolive_UKSQ"
            >
                <div class="itphoto_info" style="background-color:rgba(0,0,0,0.7)">
                    <div style="padding:5px"></div>
                </div>
            </a>
        </li>
        <?php
        $nb_photolive++;
    } elseif ($vignette == 's') {
        echo '<li class="boite_photo"><div class="boite_station div-inner-station">';
        $htmlentities_id_station = htmlentities($s[$s_n][0]);
        if (is_file(__ROOT__ . "/include/vignettes/stations-meteo/{$htmlentities_id_station}.html")) {
            readfile(__ROOT__ . "/include/vignettes/stations-meteo/{$htmlentities_id_station}.html");
        } else {
            readfile(__ROOT__ . '/include/vignettes/stations-meteo/07149.html');
        }
        echo '</div></li>';
        $s_n++;
    } elseif ($vignette == 'c') {
        // vigicrues
        echo '<li class="boite_photo">';
        echo '<a onclick="window.open(this.href);return false;" href="https://www.vigicrues.gouv.fr"><img src="https://www.vigicrues.gouv.fr/ftp/cruemax.png" alt="Vigicrues" title="Vigicrues - cliquez pour acc&eacute;der au site" /></a>';
        echo '</li>';
    } else {
        // vigilance MF
        ?>
        <li class="boite_photo boite_photo_vigilances">
            <style>
                .boite_photo_vigilances > a {
                    background: rgb(64, 166, 195, 0.5);
                    display: inline-block;
                    padding: 4px;
                    border-radius: 5px;
                    box-shadow: 0 0 3px black;
                    width: 100px;
                    box-sizing: border-box;
                }

                .boite_photo_vigilances > a > img {
                    height: 60px;
                    filter: drop-shadow(0px 0px 1px #00000055);
                }

                .boite_photo_vigilances > a.encelade {
                    position: relative;
                    display: block;
                    top: -100%;
                    right: -70%;
                    background-color: #153a42;
                    color: white;
                    height: 1.5rem;
                    width: 1.5rem;
                    border-radius: 100vw;
                    text-decoration: none;
                }
            </style>
            <a
                onclick="window.open(this.href);return false;"
                href="https://vigilance.meteofrance.fr/fr"
            >
                <img
                    src="/vigi/current.png?<?= time() ?>"
                    alt="Vigilance M&eacute;t&eacute;oFrance"
                    title="Cliquez pour acc&eacute;der au site"
                />
            </a>
            <a
                href="https://vigilance.encelade.cloud/live"
                target="_blank"
                onclick="window.open(this.href, '_blank');return false;"
                class="encelade"
            >
                <?php if ($_pageCharset === 'utf-8') : ?>▶<?php else : ?>&#9654;<?php endif ?>
            </a>
        </li>
        <?php
    }
}
*/
