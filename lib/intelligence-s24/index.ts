export * from '@/lib/intelligence-s24/types';
export { S24_DEFAULT_CONFIG, S24_DEFAULT_WEIGHTS, validateS24Weights } from '@/lib/intelligence-s24/config';
export {
	S24_INDEX_SCALE,
	classifyConfidence,
	classifyRisk,
	classifyS24Index,
	classifyTrend,
} from '@/lib/intelligence-s24/metodologiaOficial';
export { buildS24MatchInterpretation } from '@/lib/intelligence-s24/interpretacionPartido';
export { MotorDeInteligenciaS24, motorDeInteligenciaS24 } from '@/lib/intelligence-s24/motorDeInteligenciaS24';
export { buildInformeS24V1 } from '@/lib/intelligence-s24/informeS24V1';
export { generateS24Narrative, generateS24NarrativeFromProfile } from '@/lib/intelligence-s24/narrativa';
export type { S24NarrativeInput, S24NarrativeOutput, S24NarrativeLevel } from '@/lib/intelligence-s24/narrativa';
export { createEditorialEngine } from '@/lib/intelligence-s24/editorial';
export type { EditorialEngine, EditorialLocale } from '@/lib/intelligence-s24/editorial';
export { s24HistoryEngine } from '@/lib/intelligence-s24/history/historyEngine';
export type { S24EvaluationRecord, S24ProfileRecord } from '@/lib/intelligence-s24/history/learningTypes';
export { s24ValidationService, buildProfileValidationReport, buildValidationReport, buildValidationDashboard } from '@/lib/intelligence-s24/validation';
export type {
	BuildProfileValidationReportOptions,
	IntelligenceProfileValidationReport,
	IntelligenceProfileValidationSample,
	ValidationReport,
	MotorScore,
	NarrativeScore,
	InsightScore,
	ValidationDashboard,
} from '@/lib/intelligence-s24/validation';
export { buildPostMatchReport, s24PostMatchService } from '@/lib/intelligence-s24/post-match';
export type { PostMatchReport } from '@/lib/intelligence-s24/post-match';
export { getIntelligenceCenterData, buildIntelligenceCenterData } from '@/lib/intelligence-s24/intelligence-center';
export type {
	IntelligenceCenterData,
	CenterViewDefinition,
	CenterViewKey,
	CompetitionIntelligenceItem,
	GlobalInsightItem,
	HighUncertaintyMatch,
	RankingEntry,
	TeamStrengthItem,
	MethodologicalAlert,
} from '@/lib/intelligence-s24/intelligence-center';
export { asIntelligenceProfile, buildClubProfileFromData, buildLeagueProfileFromData, buildMatchProfileFromEvaluationRecord, buildPlayerProfileFromData, buildSeasonProfileFromData } from '@/lib/intelligence-s24/intelligence-profile';
export {
	sportResolver,
	SportResolver,
	sportRegistry,
	SportRegistry,
	footballProfile,
	basketballProfile,
	tennisProfile,
	formula1Profile,
	cyclingProfile,
	baseballProfile,
	esportsProfile,
} from '@/lib/intelligence-s24/sports';
export type { SportProfile, SportResolverInput } from '@/lib/intelligence-s24/sports';
export { getClubIntelligenceData, getClubIntelligenceHubData, getClubIntelligenceProfile, slugifyTeamName } from '@/lib/intelligence-s24/club-intelligence';
export type {
	BuildClubIntelligenceOptions,
	ClubAlertItem,
	ClubCompetitiveState,
	ClubEvolutionMatch,
	ClubEvolutionPoint,
	ClubHistorySnapshot,
	ClubIdentity,
	ClubInsightItem,
	ClubInstitutionalProfile,
	ClubIntelligenceData,
	ClubIntelligenceHubData,
	ClubIntelligentNarrative,
	ClubStrengths,
	ClubWeakness,
} from '@/lib/intelligence-s24/club-intelligence';
export { getLeagueIntelligenceData, getLeagueIntelligenceHubData, getLeagueIntelligenceProfile, slugifyCompetition } from '@/lib/intelligence-s24/league-intelligence';
export type {
	BuildLeagueIntelligenceOptions,
	LeagueCompetitiveState,
	LeagueIdentity,
	LeagueInsight,
	LeagueIntelligenceData,
	LeagueIntelligenceHubData,
	LeagueMethodologicalAlert,
	LeagueNarrative,
	LeagueSeasonComparison,
	LeagueTeamHighlight,
	LeagueTrendSnapshot,
} from '@/lib/intelligence-s24/league-intelligence';
export { getPlayerIntelligenceData, getPlayerIntelligenceHubData, getPlayerIntelligenceProfile, slugify } from '@/lib/intelligence-s24/player-intelligence';
export type {
	BuildPlayerIntelligenceOptions,
	PlayerAlert,
	PlayerComparisonItem,
	PlayerHistoryPoint,
	PlayerIdentity,
	PlayerIndicators,
	PlayerIntelligenceData,
	PlayerIntelligenceHubData,
	PlayerNarrative,
} from '@/lib/intelligence-s24/player-intelligence';
export { getSeasonIntelligenceData, getSeasonIntelligenceHubData, getSeasonIntelligenceProfile } from '@/lib/intelligence-s24/season-intelligence';
export type {
	BuildSeasonIntelligenceOptions,
	SeasonComparison,
	SeasonCriticalMoment,
	SeasonEvolutionPoint,
	SeasonIdentity,
	SeasonInsight,
	SeasonIntelligenceData,
	SeasonIntelligenceHubData,
	SeasonMethodologyChange,
	SeasonNarrative,
	SeasonStreak,
} from '@/lib/intelligence-s24/season-intelligence';
export { buildKnowledgeGraphData, getKnowledgeGraphData } from '@/lib/intelligence-s24/knowledge-graph';
export type {
	BuildKnowledgeGraphInput,
	BuildKnowledgeGraphOptions,
	KnowledgeGraphData,
	KnowledgeGraphEdge,
	KnowledgeGraphEdgeType,
	KnowledgeGraphNode,
	KnowledgeGraphNodeType,
	KnowledgeGraphStats,
} from '@/lib/intelligence-s24/knowledge-graph';
