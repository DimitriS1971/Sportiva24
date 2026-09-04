import type {
  Analysis,
  Club,
  Competition,
  EditorialDocument,
  HistoryRecord,
  Match,
  Narrative,
  Player,
  Prediction,
  Season,
  Sport,
  SportProfile,
  Validation,
} from '@/lib/domain/entities';
import type { EntityId } from '@/lib/domain/valueObjects';

export interface Repository<TEntity> {
  findById(id: EntityId): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
  delete(id: EntityId): Promise<void>;
}

export interface SportRepository extends Repository<Sport> {
  findByCode(code: Sport['code']): Promise<Sport | null>;
}

export interface CompetitionRepository extends Repository<Competition> {
  listBySport(sportId: EntityId): Promise<Competition[]>;
}

export interface SeasonRepository extends Repository<Season> {
  getActiveByCompetition(competitionId: EntityId): Promise<Season | null>;
}

export interface MatchRepository extends Repository<Match> {
  findBySlug(slug: string): Promise<Match | null>;
  listByCompetition(competitionId: EntityId, limit?: number): Promise<Match[]>;
}

export interface ClubRepository extends Repository<Club> {
  listBySport(sportId: EntityId): Promise<Club[]>;
}

export interface PlayerRepository extends Repository<Player> {
  listByClub(clubId: EntityId): Promise<Player[]>;
}

export interface PredictionRepository extends Repository<Prediction> {
  listByMatch(matchId: EntityId): Promise<Prediction[]>;
}

export interface AnalysisRepository extends Repository<Analysis> {
  listBySport(sportId: EntityId, limit?: number): Promise<Analysis[]>;
}

export interface NarrativeRepository extends Repository<Narrative> {
  listByAnalysis(analysisId: EntityId): Promise<Narrative[]>;
}

export interface ValidationRepository extends Repository<Validation> {
  listByPrediction(predictionId: EntityId): Promise<Validation[]>;
}

export interface HistoryRepository extends Repository<HistoryRecord> {
  listByEntity(entityRef: { type: string; id: EntityId }, limit?: number): Promise<HistoryRecord[]>;
}

export interface EditorialDocumentRepository extends Repository<EditorialDocument> {
  listPublishedBySport(sportId: EntityId, locale: 'es' | 'en', limit?: number): Promise<EditorialDocument[]>;
}

export interface SportProfileRepository extends Repository<SportProfile> {
  findBySportId(sportId: EntityId): Promise<SportProfile | null>;
  findBySlug(slug: string): Promise<SportProfile | null>;
}
