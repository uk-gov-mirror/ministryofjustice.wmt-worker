exports.seed = function (knex, Promise) {
  var sql = `CREATE VIEW app.ldu_caseload_view
      WITH SCHEMABINDING
      AS
      SELECT     
        MAX(l.id) AS id
        , t.id AS link_id
        , MAX(t.description) AS name
        , grade_code
        , SUM(untiered) AS untiered
        , SUM(d2) AS d2
        , SUM(d1) AS d1
        , SUM(c2) AS c2
        , SUM(c1) AS c1
        , SUM(b2) AS b2
        , SUM(b1) AS b1
        , SUM(a) AS a
        , SUM(total_cases) AS total_cases
      FROM app.team_caseload_view tv   
        JOIN app.team t ON t.id = tv.id
        JOIN app.ldu l ON t.ldu_id = l.id
      GROUP BY t.id, grade_code;`

  return knex.schema
    .raw('DROP VIEW IF EXISTS app.ldu_caseload_view;')
    .raw('SET ARITHABORT ON')
    .raw(sql)
}
