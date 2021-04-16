exports.seed = function (knex, promise) {
  const sql = `CREATE VIEW app.case_details_export_view
  WITH SCHEMABINDING
  AS
  SELECT
      r.description AS regionName
    , r.id AS regionId
    , l.description AS lduName
    , l.id AS lduId
    , t.description AS teamName
    , t.id AS teamId
    , w.id AS workloadId
    , w.workload_owner_id AS workloadOwnerId
    , cc.category_name AS tierCode
    , rtd.row_type_full_name AS rowType
    , case_ref_no AS caseReferenceNo
    , location AS caseType
    , CONCAT(om.forename, ' ', om.surname) AS offenderManagerName
    , omt.grade_code AS gradeCode
  FROM app.case_details AS c
	  JOIN app.row_type_definitions AS rtd ON c.row_type = rtd.row_type
	  JOIN app.workload AS w ON c.workload_id = w.id
	  JOIN app.workload_owner AS wo ON w.workload_owner_id = wo.id
	  JOIN app.offender_manager	 AS om ON wo.offender_manager_id = om.id
	  JOIN app.offender_manager_type AS omt ON om.type_id = omt.id
	  JOIN app.team AS t ON wo.team_id = t.id
	  JOIN app.ldu AS l ON l.id = t.ldu_id
	  JOIN app.region AS r ON r.id = l.region_id
	  JOIN app.workload_report AS wr ON w.workload_report_id = wr.id
	  JOIN app.case_category AS cc ON c.tier_code = cc.category_id
  WHERE wr.effective_from IS NOT NULL AND wr.effective_to IS NULL;`

  return knex.schema
    .raw('DROP VIEW IF EXISTS app.case_details_export_view;')
    .raw('SET ARITHABORT ON')
    .raw(sql)
}
