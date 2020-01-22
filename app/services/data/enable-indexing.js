const knex = require('../../../knex').indexing

module.exports = function() {
  return knex.raw('ALTER INDEX idx_region_caseload_view ON app.region_caseload_view REBUILD; ALTER INDEX idx_national_caseload_view ON app.national_caseload_view REBUILD; ALTER INDEX idx_team_capacity_breakdown_view ON app.team_capacity_breakdown_view REBUILD; ALTER INDEX idx_ldu_capacity_breakdown_view ON app.ldu_capacity_breakdown_view REBUILD; ALTER INDEX idx_region_capacity_breakdown_view ON app.region_capacity_breakdown_view REBUILD; ALTER INDEX idx_national_capacity_breakdown_view ON app.national_capacity_breakdown_view REBUILD; ALTER INDEX idx_individual_court_reporter_overview ON app.individual_court_reporter_overview REBUILD; ALTER INDEX idx_team_court_reporter_overview ON app.team_court_reporter_overview REBUILD; ALTER INDEX idx_ldu_court_reporter_overview ON app.ldu_court_reporter_overview REBUILD; ALTER INDEX idx_region_court_reporter_overview ON app.region_court_reporter_overview REBUILD; ALTER INDEX idx_national_court_reporter_overview ON app.national_court_reporter_overview REBUILD; ALTER INDEX idx_team_outstanding_reports_view ON app.team_outstanding_reports_view REBUILD; ALTER INDEX idx_ldu_outstanding_reports_view ON app.ldu_outstanding_reports_view REBUILD; ALTER INDEX idx_region_outstanding_reports_view ON app.region_outstanding_reports_view REBUILD; ALTER INDEX idx_national_outstanding_reports_view ON app.national_outstanding_reports_view REBUILD; ALTER INDEX idx_team_case_details_view ON app.team_case_details_view REBUILD; ALTER INDEX idx_individual_capacity_view ON app.individual_capacity_view REBUILD; ALTER INDEX idx_team_capacity_view ON app.team_capacity_view REBUILD; ALTER INDEX idx_ldu_capacity_view ON app.ldu_capacity_view REBUILD; ALTER INDEX idx_region_capacity_view ON app.region_capacity_view REBUILD; ALTER INDEX idx_national_capacity_view ON app.national_capacity_view REBUILD; ALTER INDEX idx_individual_case_progress_view ON app.individual_case_progress_view REBUILD; ALTER INDEX idx_team_case_progress_view ON app.team_case_progress_view REBUILD; ALTER INDEX idx_individual_case_overview ON app.individual_case_overview REBUILD; ALTER INDEX idx_team_case_overview ON app.team_case_overview REBUILD; ALTER INDEX idx_ldu_case_overview ON app.ldu_case_overview REBUILD; ALTER INDEX idx_region_case_overview ON app.region_case_overview REBUILD; ALTER INDEX idx_national_case_overview ON app.national_case_overview REBUILD; ALTER INDEX idx_team_caseload_view ON app.team_caseload_view REBUILD; ALTER INDEX idx_ldu_caseload_view ON app.ldu_caseload_view REBUILD;')
}