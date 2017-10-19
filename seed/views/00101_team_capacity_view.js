exports.seed = function (knex, Promise) {
  var sql = `CREATE VIEW app.team_capacity_view 
      WITH SCHEMABINDING 
      AS 
      SELECT SUM(total_points) AS total_points
        , SUM(available_points) AS available_points
        , SUM(reduction_hours) AS reduction_hours
        , SUM(wo.contracted_hours) AS contracted_hours
        , wr.effective_from AS effective_from
        , t.id AS id
      FROM app.workload_points_calculations wpc
        JOIN app.workload w ON wpc.workload_id = w.id
        JOIN app.workload_owner wo ON w.workload_owner_id = wo.id
        JOIN app.team t ON wo.team_id = t.id
        JOIN app.workload_report wr ON wpc.workload_report_id = wr.id
      GROUP BY t.id, wr.effective_from;`

  return knex.schema
           .raw('DROP VIEW IF EXISTS app.team_capacity_view;')
           .raw('SET ARITHABORT ON')
           .raw(sql)
}
