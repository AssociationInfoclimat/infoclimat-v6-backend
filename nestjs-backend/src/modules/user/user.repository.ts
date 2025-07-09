import { comptes } from 'prisma-v5/v5-database-client-types';
import { v5DBPrismaClient } from 'src/database/v5-prisma-client';
import { FunctionLogger } from 'src/shared/utils';
import { User, UserStatus } from './user.types';

export class UserRepository {
  private prisma = v5DBPrismaClient;
  constructor() {}
  private readonly logger = new FunctionLogger(UserRepository.name);

  private mappingUser(user: comptes): User {
    if (!user.id) {
      throw new Error('User id is required');
    }
    if (!user.pseudo) {
      throw new Error('User pseudo is required');
    }
    return {
      id: user.id,
      pseudo: user.pseudo,
      statuses: this.getStatusesFromUser(user.statuts),
    };
  }

  async getUserById(id: number): Promise<User | null> {
    if (!id) {
      return null;
    }
    const user = await this.prisma.comptes.findFirst({
      where: {
        id: id,
      },
      take: 1,
    });
    if (!user) {
      return null;
    }
    return this.mappingUser(user);
  }

  private getStatusesFromUser(statuses: string): UserStatus[] {
    return statuses.split(',').map((status) => parseInt(status) as UserStatus);
  }

  async getStatuses(id: number): Promise<UserStatus[]> {
    const statuses = await this.prisma.comptes.findFirst({
      select: {
        statuts: true,
      },
      where: {
        id: id,
      },
      take: 1,
    });
    if (!statuses) {
      return [];
    }
    return this.getStatusesFromUser(statuses.statuts);
  }
}

/*

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
    //$error->afficher_message(); // DEBUG
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
     
    }

    */
