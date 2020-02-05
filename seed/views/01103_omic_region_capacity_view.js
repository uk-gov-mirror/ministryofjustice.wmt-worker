exports.seed = function (knex, Promise) {
  var view = `CREATE VIEW app.omic_region_capacity_view
    WITH SCHEMABINDING
    AS
    SELECT SUM(total_points) AS total_points
      , SUM(available_points) AS available_points
      , SUM(reduction_hours) AS reduction_hours
      , SUM(wpc.contracted_hours) AS contracted_hours
      , wr.effective_from AS effective_from
      , region.id AS id
      , COUNT_BIG(*) AS count
      , wr.id AS workload_report_id
    FROM app.omic_workload_points_calculations AS wpc
      JOIN app.omic_workload AS w ON wpc.omic_workload_id = w.id
      JOIN app.workload_owner AS wo ON w.workload_owner_id = wo.id
      JOIN app.team AS t ON wo.team_id = t.id
      JOIN app.ldu AS ldu ON t.ldu_id = ldu.id
      JOIN app.region AS region ON ldu.region_id = region.id
      JOIN app.workload_report AS wr ON wpc.workload_report_id = wr.id
    GROUP BY region.id, wr.effective_from, wr.id;`

  var index = `CREATE UNIQUE CLUSTERED INDEX idx_omic_region_capacity_view
  ON app.omic_region_capacity_view (id, workload_report_id)`

  var disable = "ALTER INDEX idx_omic_region_capacity_view ON app.omic_region_capacity_view DISABLE;"
  var enable = "ALTER INDEX idx_omic_region_capacity_view ON app.omic_region_capacity_view REBUILD;"

  return knex.schema
           .raw('DROP VIEW IF EXISTS app.omic_region_capacity_view;')
           .raw('SET ARITHABORT ON')
           .raw(view)
           .raw(index)
}