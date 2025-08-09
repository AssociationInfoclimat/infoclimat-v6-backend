# Guide des Tests Unitaires - InfoClimat v6 Backend

Ce guide explique comment créer et maintenir des tests unitaires pour les features du backend NestJS.

## 🎯 Objectif

Valider que les services retournent des données correctes par rapport à des mocks de base de données et des structures JSON attendues.

## 🏗️ Structure des Tests

### Organisation des Fichiers

```
src/
├── modules/
│   ├── dico/
│   │   ├── dico.service.ts
│   │   ├── dico.service.spec.ts          # Tests du service
│   │   ├── dico.repository.ts
│   │   └── dico.repository.spec.ts       # Tests du repository
│   └── stations-meteo/
│       ├── stations-meteo.service.ts
│       ├── stations-meteo.service.spec.ts
│       ├── stations-meteo.repository.ts
│       └── stations-meteo.repository.spec.ts
└── testing/
    ├── mock-factories.ts                 # Factory pour créer les données de test
    ├── prisma-mock-factory.ts           # Mocks des clients Prisma
    ├── test-utils.ts                     # Utilitaires de test
    └── jest.setup.ts                     # Configuration globale Jest
```

## 🔧 Configuration

### Scripts NPM

```bash
# Tests unitaires
npm run test              # Tous les tests unitaires
npm run test:watch        # Tests en mode watch
npm run test:cov          # Tests avec couverture
npm run test:unit         # Alias pour les tests unitaires

# Tests d'intégration
npm run test:e2e          # Tests end-to-end

# Script de test local
./test-local.sh           # Script complet avec vérifications
```

### Configuration Jest

- **Configuration principale** : `jest.unit.config.js`
- **Setup global** : `src/testing/jest.setup.ts`
- **Seuils de couverture** : 80% lignes, 80% fonctions, 70% branches

## 📋 Patrons de Tests

### 1. Test d'un Repository

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MyRepository } from './my.repository';
import { PrismaMockFactory } from '../../testing/prisma-mock-factory';
import { MockFactories } from '../../testing/mock-factories';

// Mock du client Prisma
jest.mock('../../database/my-prisma-client', () => ({
  myPrismaClient: PrismaMockFactory.createMyPrismaClientMock(),
}));

describe('MyRepository', () => {
  let repository: MyRepository;
  let mockPrismaClient: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyRepository],
    }).compile();

    repository = module.get<MyRepository>(MyRepository);
    mockPrismaClient = require('../../database/my-prisma-client').myPrismaClient;
    jest.clearAllMocks();
  });

  describe('myMethod', () => {
    it('should return expected data structure', async () => {
      // Arrange
      const mockData = MockFactories.createMockData();
      mockPrismaClient.myTable.findMany.mockResolvedValue([mockData]);

      // Act
      const result = await repository.myMethod();

      // Assert
      expect(mockPrismaClient.myTable.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockData]);
    });
  });
});
```

### 2. Test d'un Service

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { MyService } from './my.service';
import { MyRepository } from './my.repository';
import { MockFactories } from '../../testing/mock-factories';

describe('MyService', () => {
  let service: MyService;
  let mockRepository: jest.Mocked<MyRepository>;

  beforeEach(async () => {
    const mockRepositoryProvider = {
      provide: MyRepository,
      useValue: {
        myMethod: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [MyService, mockRepositoryProvider],
    }).compile();

    service = module.get<MyService>(MyService);
    mockRepository = module.get(MyRepository);
  });

  describe('myServiceMethod', () => {
    it('should return data from repository', async () => {
      // Arrange
      const expectedData = MockFactories.createMockData();
      mockRepository.myMethod.mockResolvedValue(expectedData);

      // Act
      const result = await service.myServiceMethod();

      // Assert
      expect(mockRepository.myMethod).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedData);
    });
  });
});
```

## 🏭 Mock Factories

### Création de Données de Test

```typescript
// src/testing/mock-factories.ts
export class MockFactories {
  static createMockMyEntity(overrides?: Partial<MyEntity>): MyEntity {
    return {
      id: 1,
      name: 'Test Entity',
      createdAt: new Date(),
      ...overrides,
    };
  }

  static createMockMyEntities(count: number = 5): MyEntity[] {
    return Array.from({ length: count }, (_, index) => 
      MockFactories.createMockMyEntity({ id: index + 1 })
    );
  }
}
```

### Mocks des Clients Prisma

```typescript
// src/testing/prisma-mock-factory.ts
export class PrismaMockFactory {
  static createMyPrismaClientMock() {
    return {
      myTable: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
  }
}
```

## ✅ Validation des Données

### Structure des Réponses

```typescript
import { TestValidationHelper, ExpectedResponses } from '../../testing/test-utils';

// Validation de la structure d'un objet
TestValidationHelper.validateObjectStructure(result, ['id', 'name', 'slug']);

// Validation d'un tableau d'objets
TestValidationHelper.validateArrayObjectsStructure(results, ['id', 'name']);

// Validation avec structure attendue
expect(result).toMatchObject(ExpectedResponses.MyEntity);
```

### Structures Attendues

```typescript
// src/testing/test-utils.ts
export const ExpectedResponses = {
  MyEntity: {
    id: expect.any(Number),
    name: expect.any(String),
    slug: expect.any(String),
  },
};
```

## 🚀 Tests par Module

### Modules Testés

1. **dico** - Dictionnaire/lexique météorologique
   - `dico.repository.spec.ts` - Tests d'accès aux données lexique
   - `dico.service.spec.ts` - Tests de logique métier du dictionnaire

2. **stations-meteo** - Données des stations météorologiques
   - `stations-meteo.repository.spec.ts` - Tests d'accès aux données de température
   - `stations-meteo.service.spec.ts` - Tests de logique métier des stations

### Ajout d'un Nouveau Module de Tests

1. **Créer les mocks** dans `mock-factories.ts`
2. **Ajouter le mock Prisma** dans `prisma-mock-factory.ts`
3. **Créer les tests** : `module.repository.spec.ts` et `module.service.spec.ts`
4. **Ajouter les structures attendues** dans `test-utils.ts`

## 🔄 CI/CD

### GitHub Actions

Le workflow `.github/workflows/test.yml` exécute :

1. **Tests Unitaires** sur Node.js 18.x et 20.x
2. **Tests d'Intégration** avec MySQL et Redis
3. **Tests de Build** pour API et CRON

### Commandes CI

```bash
npm ci                    # Installation des dépendances
npm run prisma:generate   # Génération des clients Prisma
npm run lint             # Vérification du code
npm run test:cov         # Tests unitaires avec couverture
npm run test:e2e         # Tests d'intégration
npm run api:build        # Build de l'API
npm run cron:build       # Build des tâches CRON
```

## 📊 Couverture de Code

### Seuils Requis

- **Lignes** : 80%
- **Fonctions** : 80%
- **Branches** : 70%
- **Instructions** : 80%

### Fichiers Exclus

- `*.spec.ts` - Fichiers de test
- `*.dto.ts` - Objets de transfert de données
- `*.types.ts` - Définitions de types
- `*.constants.ts` - Constantes
- `src/testing/**/*` - Utilitaires de test

## 🐛 Débogage

### Tests en Mode Debug

```bash
npm run test:debug
```

### Logs de Test

```typescript
// Pour réactiver les logs dans un test spécifique
beforeEach(() => {
  global.console = originalConsole;
});
```

## 📝 Bonnes Pratiques

1. **Nommage** : `describe('MethodName', () => {})` pour chaque méthode testée
2. **Structure AAA** : Arrange, Act, Assert dans chaque test
3. **Mocks** : Utiliser les factories pour des données cohérentes
4. **Isolation** : Chaque test doit être indépendant
5. **Couverture** : Tester les cas nominaux et d'erreur
6. **Lisibilité** : Tests descriptifs avec des noms explicites

## 🚀 Tests en Local

### Script de Test Rapide

Le script `./test-local.sh` execute automatiquement :

1. ✅ Vérification des dépendances
2. 🔧 Génération des clients Prisma  
3. 🧹 Lint du code
4. 🧪 Tests Repository (fonctionnels)
5. ⚠️ Tests Service (peuvent échouer - problème imports Prisma)

```bash
cd nestjs-backend
./test-local.sh
```

### Tests Individuels 

```bash
# Tests par type
npm run test -- --testPathPattern="repository.spec.ts"
npm run test -- --testPathPattern="service.spec.ts"

# Tests par module  
npm run test -- --testPathPattern="dico"
npm run test -- --testPathPattern="stations-meteo"

# Tests avec watch
npm run test:watch -- --testPathPattern="repository"
```

## 🚨 Gestion d'Erreurs

```typescript
it('should handle database errors', async () => {
  // Arrange
  const dbError = new Error('Database connection failed');
  mockRepository.myMethod.mockRejectedValue(dbError);

  // Act & Assert
  await expect(service.myServiceMethod()).rejects.toThrow('Database connection failed');
});
```

## ⚠️ Problèmes Connus

- **Tests Service**: Peuvent échouer à cause d'imports Prisma indirects
- **Solution**: Les tests Repository valident l'essentiel de la logique
- **CI/CD**: GitHub Actions génère les clients Prisma avant les tests