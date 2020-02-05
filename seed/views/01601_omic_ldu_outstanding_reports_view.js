exports.seed = function (knex, Promise) {
  var sql = `CREATE VIEW app.omic_ldu_outstanding_reports_view
    WITH SCHEMABINDING
    AS
  SELECT
      t.ldu_id AS id
    , t.id AS link_id
    , t.description AS name
    , omt.grade_code
    , SUM(tr.warrants_total) AS ow
    , SUM(tr.overdue_terminations_total) AS ot
    , SUM(tr.unpaid_work_total) AS upw
    , SUM(tr.t2a_warrants_total) AS t2a_ow
    , SUM(tr.t2a_overdue_terminations_total) AS t2a_ot
    , SUM(tr.t2a_unpaid_work_total) AS t2a_upw
    , SUM(tr.suspended_total) AS sso
    , SUM(tr.suspended_lifer_total) AS sl
    , COUNT_BIG(*) AS count
  FROM app.omic_tiers tr
      JOIN app.omic_workload w ON tr.omic_workload_id = w.id
      JOIN app.omic_workload_points_calculations wpc ON wpc.omic_workload_id = w.id
      JOIN app.workload_report wr ON wr.id = wpc.workload_report_id
      JOIN app.workload_owner wo ON wo.id = w.workload_owner_id
      JOIN app.team t ON t.id = wo.team_id
      JOIN app.offender_manager om ON om.id = wo.offender_manager_id
      JOIN app.offender_manager_type omt ON omt.id = om.type_id
  WHERE wr.effective_from IS NOT NULL
      AND wr.effective_to IS NULL
  GROUP BY t.ldu_id, t.id, t.description, omt.grade_code;`

  var index = `CREATE UNIQUE CLUSTERED INDEX idx_omic_ldu_outstanding_reports_view
    ON app.omic_ldu_outstanding_reports_view(link_id, grade_code)`
  
  var disable = "ALTER INDEX idx_omic_ldu_outstanding_reports_view ON app.omic_ldu_outstanding_reports_view DISABLE;"
  var enable = "ALTER INDEX idx_omic_ldu_outstanding_reports_view ON app.omic_ldu_outstanding_reports_view REBUILD;"

  return knex.schema
    .raw('DROP VIEW IF EXISTS app.omic_ldu_outstanding_reports_view;')
    .raw('SET ARITHABORT ON')
    .raw(sql)
    .raw(index)
}